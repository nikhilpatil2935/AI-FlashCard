"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFlashcardsFromImage = exports.generateFlashcardsFromPdf = exports.generateFlashcardsFromText = exports.deleteFlashcard = exports.updateFlashcard = exports.getFlashcardById = exports.getFlashcards = exports.createFlashcard = void 0;
const flashcard_model_1 = __importStar(require("../models/flashcard.model"));
const content_processing_service_1 = require("../services/content-processing.service");
const ai_service_1 = require("../services/ai.service");
// Create a new flashcard manually
const createFlashcard = async (req, res) => {
    try {
        const { question, answer, tags, difficulty } = req.body;
        // Validate required fields
        if (!question || !answer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }
        // Create new flashcard
        const flashcard = new flashcard_model_1.default({
            user: req.userId,
            question,
            answer,
            tags: tags || [],
            difficulty: difficulty || flashcard_model_1.Difficulty.MEDIUM,
            nextReview: new Date()
        });
        await flashcard.save();
        res.status(201).json(flashcard);
    }
    catch (error) {
        console.error('Create flashcard error:', error);
        res.status(500).json({ error: 'Server error while creating flashcard' });
    }
};
exports.createFlashcard = createFlashcard;
// Get all user's flashcards with filtering options
const getFlashcards = async (req, res) => {
    try {
        const { tags, difficulty, sortBy, limit = 20, page = 1 } = req.query;
        // Build query
        const query = { user: req.userId };
        // Add filters if provided
        if (tags) {
            query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
        }
        if (difficulty) {
            query.difficulty = difficulty;
        }
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Determine sort order
        let sort = {};
        if (sortBy === 'nextReview') {
            sort = { nextReview: 1 };
        }
        else if (sortBy === 'difficulty') {
            sort = { difficulty: 1 };
        }
        else {
            sort = { createdAt: -1 };
        }
        // Execute query with pagination
        const flashcards = await flashcard_model_1.default.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));
        // Get total count for pagination
        const total = await flashcard_model_1.default.countDocuments(query);
        res.json({
            flashcards,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Get flashcards error:', error);
        res.status(500).json({ error: 'Server error while fetching flashcards' });
    }
};
exports.getFlashcards = getFlashcards;
// Get a single flashcard by ID
const getFlashcardById = async (req, res) => {
    try {
        const flashcard = await flashcard_model_1.default.findOne({
            _id: req.params.id,
            user: req.userId
        });
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json(flashcard);
    }
    catch (error) {
        console.error('Get flashcard error:', error);
        res.status(500).json({ error: 'Server error while fetching flashcard' });
    }
};
exports.getFlashcardById = getFlashcardById;
// Update an existing flashcard
const updateFlashcard = async (req, res) => {
    try {
        const { question, answer, tags, difficulty, correctCount, incorrectCount } = req.body;
        // Find and update the flashcard
        const flashcard = await flashcard_model_1.default.findOneAndUpdate({ _id: req.params.id, user: req.userId }, {
            question,
            answer,
            tags,
            difficulty,
            correctCount,
            incorrectCount,
            // If it's a review update, update the review fields
            ...(correctCount !== undefined || incorrectCount !== undefined ? {
                lastReviewed: new Date(),
                reviewCount: { $inc: 1 }
            } : {})
        }, { new: true });
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json(flashcard);
    }
    catch (error) {
        console.error('Update flashcard error:', error);
        res.status(500).json({ error: 'Server error while updating flashcard' });
    }
};
exports.updateFlashcard = updateFlashcard;
// Delete a flashcard
const deleteFlashcard = async (req, res) => {
    try {
        const flashcard = await flashcard_model_1.default.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }
        res.json({ message: 'Flashcard deleted successfully' });
    }
    catch (error) {
        console.error('Delete flashcard error:', error);
        res.status(500).json({ error: 'Server error while deleting flashcard' });
    }
};
exports.deleteFlashcard = deleteFlashcard;
// Generate flashcards from text input
const generateFlashcardsFromText = async (req, res) => {
    try {
        const { text, count = 5, tags = [] } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text content is required' });
        }
        // Call AI service to generate flashcards
        const generatedFlashcards = await (0, ai_service_1.generateFlashcards)(text, Number(count));
        // Save generated flashcards to database
        const savedFlashcards = await Promise.all(generatedFlashcards.map(async (card) => {
            const flashcard = new flashcard_model_1.default({
                user: req.userId,
                question: card.question,
                answer: card.answer,
                tags,
                difficulty: flashcard_model_1.Difficulty.MEDIUM,
                nextReview: new Date()
            });
            return await flashcard.save();
        }));
        res.status(201).json(savedFlashcards);
    }
    catch (error) {
        console.error('Generate flashcards error:', error);
        res.status(500).json({ error: 'Error generating flashcards' });
    }
};
exports.generateFlashcardsFromText = generateFlashcardsFromText;
// Generate flashcards from uploaded PDF
const generateFlashcardsFromPdf = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }
        const { count = 5, tags = [] } = req.body;
        // Extract text from PDF
        const pdfText = await (0, content_processing_service_1.extractTextFromPdf)(req.file);
        // Process the PDF text
        const processedText = await (0, content_processing_service_1.processPdfText)(pdfText);
        // Generate flashcards from the processed text
        const generatedFlashcards = await (0, ai_service_1.generateFlashcards)(processedText, Number(count));
        // Save generated flashcards to database
        const savedFlashcards = await Promise.all(generatedFlashcards.map(async (card) => {
            const flashcard = new flashcard_model_1.default({
                user: req.userId,
                question: card.question,
                answer: card.answer,
                tags,
                difficulty: flashcard_model_1.Difficulty.MEDIUM,
                nextReview: new Date()
            });
            return await flashcard.save();
        }));
        res.status(201).json(savedFlashcards);
    }
    catch (error) {
        console.error('Generate flashcards from PDF error:', error);
        res.status(500).json({ error: 'Error processing PDF or generating flashcards' });
    }
};
exports.generateFlashcardsFromPdf = generateFlashcardsFromPdf;
// Generate flashcards from uploaded image
const generateFlashcardsFromImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const { count = 5, tags = [] } = req.body;
        // Process the image to extract text
        const extractedText = await (0, content_processing_service_1.processImage)(req.file);
        if (!extractedText) {
            return res.status(400).json({ error: 'Could not extract text from image' });
        }
        // Generate flashcards from the extracted text
        const generatedFlashcards = await (0, ai_service_1.generateFlashcards)(extractedText, Number(count));
        // Save generated flashcards to database
        const savedFlashcards = await Promise.all(generatedFlashcards.map(async (card) => {
            const flashcard = new flashcard_model_1.default({
                user: req.userId,
                question: card.question,
                answer: card.answer,
                tags,
                difficulty: flashcard_model_1.Difficulty.MEDIUM,
                nextReview: new Date()
            });
            return await flashcard.save();
        }));
        res.status(201).json(savedFlashcards);
    }
    catch (error) {
        console.error('Generate flashcards from image error:', error);
        res.status(500).json({ error: 'Error processing image or generating flashcards' });
    }
};
exports.generateFlashcardsFromImage = generateFlashcardsFromImage;
