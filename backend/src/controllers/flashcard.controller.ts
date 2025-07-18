import { Request, Response } from 'express';
import Flashcard, { Difficulty } from '../models/flashcard.model';
import { processPdfText, processImage, extractTextFromPdf } from '../services/content-processing.service';
import { generateFlashcards as aiGenerateFlashcards } from '../services/ai.service';

// Create a new flashcard manually
export const createFlashcard = async (req: Request, res: Response) => {
  try {
    const { question, answer, tags, difficulty } = req.body;
    
    // Validate required fields
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    
    // Create new flashcard
    const flashcard = new Flashcard({
      user: req.userId,
      question,
      answer,
      tags: tags || [],
      difficulty: difficulty || Difficulty.MEDIUM,
      nextReview: new Date()
    });
    
    await flashcard.save();
    
    res.status(201).json(flashcard);
  } catch (error) {
    console.error('Create flashcard error:', error);
    res.status(500).json({ error: 'Server error while creating flashcard' });
  }
};

// Get all user's flashcards with filtering options
export const getFlashcards = async (req: Request, res: Response) => {
  try {
    const { tags, difficulty, sortBy, limit = 20, page = 1 } = req.query;
    
    // Build query
    const query: any = { user: req.userId };
    
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
    } else if (sortBy === 'difficulty') {
      sort = { difficulty: 1 };
    } else {
      sort = { createdAt: -1 };
    }
    
    // Execute query with pagination
    const flashcards = await Flashcard.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Flashcard.countDocuments(query);
    
    res.json({
      flashcards,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get flashcards error:', error);
    res.status(500).json({ error: 'Server error while fetching flashcards' });
  }
};

// Get a single flashcard by ID
export const getFlashcardById = async (req: Request, res: Response) => {
  try {
    const flashcard = await Flashcard.findOne({ 
      _id: req.params.id,
      user: req.userId
    });
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json(flashcard);
  } catch (error) {
    console.error('Get flashcard error:', error);
    res.status(500).json({ error: 'Server error while fetching flashcard' });
  }
};

// Update an existing flashcard
export const updateFlashcard = async (req: Request, res: Response) => {
  try {
    const { question, answer, tags, difficulty, correctCount, incorrectCount } = req.body;
    
    // Find and update the flashcard
    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { 
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
      },
      { new: true }
    );
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json(flashcard);
  } catch (error) {
    console.error('Update flashcard error:', error);
    res.status(500).json({ error: 'Server error while updating flashcard' });
  }
};

// Delete a flashcard
export const deleteFlashcard = async (req: Request, res: Response) => {
  try {
    const flashcard = await Flashcard.findOneAndDelete({ 
      _id: req.params.id,
      user: req.userId
    });
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    console.error('Delete flashcard error:', error);
    res.status(500).json({ error: 'Server error while deleting flashcard' });
  }
};

// Generate flashcards from text input
export const generateFlashcardsFromText = async (req: Request, res: Response) => {
  try {
    const { text, count = 5, tags = [] } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Call AI service to generate flashcards
    const generatedFlashcards = await aiGenerateFlashcards(text, Number(count));
    
    // Save generated flashcards to database
    const savedFlashcards = await Promise.all(
      generatedFlashcards.map(async (card) => {
        const flashcard = new Flashcard({
          user: req.userId,
          question: card.question,
          answer: card.answer,
          tags,
          difficulty: Difficulty.MEDIUM,
          nextReview: new Date()
        });
        
        return await flashcard.save();
      })
    );
    
    res.status(201).json(savedFlashcards);
  } catch (error) {
    console.error('Generate flashcards error:', error);
    res.status(500).json({ error: 'Error generating flashcards' });
  }
};

// Generate flashcards from uploaded PDF
export const generateFlashcardsFromPdf = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }
    
    const { count = 5, tags = [] } = req.body;
    
    // Extract text from PDF
    const pdfText = await extractTextFromPdf(req.file);
    
    // Process the PDF text
    const processedText = await processPdfText(pdfText);
    
    // Generate flashcards from the processed text
    const generatedFlashcards = await aiGenerateFlashcards(processedText, Number(count));
    
    // Save generated flashcards to database
    const savedFlashcards = await Promise.all(
      generatedFlashcards.map(async (card) => {
        const flashcard = new Flashcard({
          user: req.userId,
          question: card.question,
          answer: card.answer,
          tags,
          difficulty: Difficulty.MEDIUM,
          nextReview: new Date()
        });
        
        return await flashcard.save();
      })
    );
    
    res.status(201).json(savedFlashcards);
  } catch (error) {
    console.error('Generate flashcards from PDF error:', error);
    res.status(500).json({ error: 'Error processing PDF or generating flashcards' });
  }
};

// Generate flashcards from uploaded image
export const generateFlashcardsFromImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }
    
    const { count = 5, tags = [] } = req.body;
    
    // Process the image to extract text
    const extractedText = await processImage(req.file);
    
    if (!extractedText) {
      return res.status(400).json({ error: 'Could not extract text from image' });
    }
    
    // Generate flashcards from the extracted text
    const generatedFlashcards = await aiGenerateFlashcards(extractedText, Number(count));
    
    // Save generated flashcards to database
    const savedFlashcards = await Promise.all(
      generatedFlashcards.map(async (card) => {
        const flashcard = new Flashcard({
          user: req.userId,
          question: card.question,
          answer: card.answer,
          tags,
          difficulty: Difficulty.MEDIUM,
          nextReview: new Date()
        });
        
        return await flashcard.save();
      })
    );
    
    res.status(201).json(savedFlashcards);
  } catch (error) {
    console.error('Generate flashcards from image error:', error);
    res.status(500).json({ error: 'Error processing image or generating flashcards' });
  }
};
