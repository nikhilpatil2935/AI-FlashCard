"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeText = exports.generateQuestions = exports.generateFlashcards = void 0;
const inference_1 = require("@huggingface/inference");
const config_1 = __importDefault(require("../config/config"));
// Initialize Hugging Face client
const hf = new inference_1.HfInference(config_1.default.huggingFace.apiToken);
/**
 * Generate flashcards from text
 * @param text Source text to generate flashcards from
 * @param numberOfCards Number of flashcards to generate
 * @returns Array of flashcards with questions and answers
 */
const generateFlashcards = async (text, numberOfCards = 5) => {
    try {
        // Process text in chunks if it's long
        const processedText = text.length > 10000
            ? await (0, exports.summarizeText)(text, 2000)
            : text;
        // Extract key points for flashcards
        const keyPoints = await extractKeyPoints(processedText, numberOfCards);
        // Generate questions for each key point
        const flashcards = await Promise.all(keyPoints.map(async (point) => {
            const question = await generateQuestion(point);
            return {
                question,
                answer: point
            };
        }));
        return flashcards;
    }
    catch (error) {
        console.error('Error generating flashcards:', error);
        throw new Error('Failed to generate flashcards');
    }
};
exports.generateFlashcards = generateFlashcards;
// Question generation service
const generateQuestions = async (text, numberOfQuestions = 5) => {
    try {
        const questions = [];
        // Process text in chunks if it's long
        const textChunks = splitTextIntoChunks(text, 500);
        // Generate questions from each chunk
        for (const chunk of textChunks) {
            if (questions.length >= numberOfQuestions)
                break;
            const response = await hf.textGeneration({
                model: config_1.default.huggingFace.models.questionGeneration,
                inputs: chunk,
                parameters: {
                    max_new_tokens: 256,
                    temperature: 0.7,
                    top_p: 0.9
                }
            });
            // Extract questions from the response
            const generatedQuestions = extractQuestionsFromText(response.generated_text);
            questions.push(...generatedQuestions);
            // Limit to requested number of questions
            if (questions.length > numberOfQuestions) {
                questions.splice(numberOfQuestions);
            }
        }
        return questions;
    }
    catch (error) {
        console.error('Error generating questions:', error);
        throw new Error('Failed to generate questions from text');
    }
};
exports.generateQuestions = generateQuestions;
// Generate a single question from text
const generateQuestion = async (text) => {
    try {
        const response = await hf.textGeneration({
            model: config_1.default.huggingFace.models.questionGeneration,
            inputs: `Generate a question based on this text: ${text}`,
            parameters: {
                max_new_tokens: 64,
                temperature: 0.7,
                return_full_text: false
            }
        });
        // Extract and clean up the question
        const question = extractQuestionsFromText(response.generated_text)[0] ||
            `What is meant by "${text.substring(0, 50)}..."?`;
        return question;
    }
    catch (error) {
        console.error('Error generating question:', error);
        return `What is meant by "${text.substring(0, 50)}..."?`;
    }
};
// Extract key points from text for flashcards
const extractKeyPoints = async (text, count) => {
    try {
        // Split text into sentences
        const sentenceRegex = /[^.!?]+[.!?]+/g;
        const sentences = text.match(sentenceRegex) || [];
        // Filter out very short sentences and trim
        const filteredSentences = sentences
            .filter(s => s.trim().split(' ').length > 5)
            .map(s => s.trim());
        // If we don't have enough sentences, return what we have
        if (filteredSentences.length <= count) {
            return filteredSentences;
        }
        // Otherwise, select sentences at even intervals
        const result = [];
        const step = Math.max(1, Math.floor(filteredSentences.length / count));
        for (let i = 0; i < filteredSentences.length && result.length < count; i += step) {
            result.push(filteredSentences[i]);
        }
        return result;
    }
    catch (error) {
        console.error('Error extracting key points:', error);
        throw error;
    }
};
// Text summarization service
const summarizeText = async (text, maxLength = 200) => {
    try {
        const response = await hf.summarization({
            model: config_1.default.huggingFace.models.textSummarization,
            inputs: text,
            parameters: {
                max_length: maxLength,
                min_length: Math.min(50, maxLength / 2),
            }
        });
        return response.summary_text;
    }
    catch (error) {
        console.error('Error summarizing text:', error);
        throw new Error('Failed to summarize text');
    }
};
exports.summarizeText = summarizeText;
// Helper function to split text into manageable chunks
const splitTextIntoChunks = (text, chunkSize) => {
    const chunks = [];
    // Try to split on paragraphs or sentences
    const paragraphs = text.split(/\n\n/);
    for (const paragraph of paragraphs) {
        if (paragraph.length <= chunkSize) {
            chunks.push(paragraph);
        }
        else {
            // Split long paragraphs into sentences
            const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [];
            let currentChunk = '';
            for (const sentence of sentences) {
                if (currentChunk.length + sentence.length <= chunkSize) {
                    currentChunk += sentence;
                }
                else {
                    if (currentChunk)
                        chunks.push(currentChunk);
                    currentChunk = sentence;
                }
            }
            if (currentChunk)
                chunks.push(currentChunk);
        }
    }
    return chunks;
};
// Helper function to extract questions from generated text
const extractQuestionsFromText = (text) => {
    // Split by line breaks or question marks followed by a space
    const questionCandidates = text.split(/(?:\\n|\\?\\s+)/);
    // Filter to include only valid questions
    return questionCandidates
        .map(q => q.trim())
        .filter(q => q.length > 10 &&
        (q.endsWith('?') || q.includes('?')) &&
        !q.startsWith('Answer:'));
};
