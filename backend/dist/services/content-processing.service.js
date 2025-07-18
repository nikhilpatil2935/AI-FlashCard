"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processVideo = exports.processImage = exports.processPdfText = exports.extractTextFromPdf = void 0;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const tesseract_js_1 = require("tesseract.js");
const ai_service_1 = require("./ai.service");
/**
 * Extract text from a PDF file
 * @param file The uploaded PDF file
 * @returns Extracted text from the PDF
 */
const extractTextFromPdf = async (file) => {
    try {
        // For development environment using local file system
        if (process.env.NODE_ENV !== 'production' && file.path) {
            const dataBuffer = fs_1.default.readFileSync(file.path);
            const data = await (0, pdf_parse_1.default)(dataBuffer);
            return data.text;
        }
        // For production using Cloudinary URL
        else if (file.path) {
            const dataBuffer = fs_1.default.readFileSync(file.path);
            const data = await (0, pdf_parse_1.default)(dataBuffer);
            return data.text;
        }
        else {
            throw new Error('File path not available');
        }
    }
    catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Failed to extract text from PDF');
    }
};
exports.extractTextFromPdf = extractTextFromPdf;
/**
 * Process PDF text for better flashcard generation
 * @param text Raw text extracted from PDF
 * @returns Processed text ready for flashcard generation
 */
const processPdfText = async (text) => {
    try {
        // Clean up the text
        let processedText = text
            .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            .replace(/(\r\n|\n|\r)/gm, ' ') // Replace newlines with spaces
            .trim();
        // If the text is too long, summarize it
        if (processedText.length > 10000) {
            processedText = await (0, ai_service_1.summarizeText)(processedText, 2000);
        }
        return processedText;
    }
    catch (error) {
        console.error('Error processing PDF text:', error);
        throw new Error('Failed to process PDF text');
    }
};
exports.processPdfText = processPdfText;
/**
 * Extract text from an image using OCR
 * @param file The uploaded image file
 * @returns Extracted text from the image
 */
const processImage = async (file) => {
    try {
        // Initialize Tesseract worker for OCR
        const worker = await (0, tesseract_js_1.createWorker)();
        // For development environment using local file system
        if (process.env.NODE_ENV !== 'production' && file.path) {
            const { data: { text } } = await worker.recognize(file.path);
            await worker.terminate();
            return text;
        }
        // For production using Cloudinary URL
        else if (file.path) {
            const { data: { text } } = await worker.recognize(file.path);
            await worker.terminate();
            return text;
        }
        else {
            throw new Error('File path not available');
        }
    }
    catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to extract text from image');
    }
};
exports.processImage = processImage;
/**
 * Process video for transcription
 * This is a placeholder function that would need to be implemented
 * with a proper video transcription service like AWS Transcribe
 */
const processVideo = async (file) => {
    // This would need to be implemented with a third-party service
    throw new Error('Video processing not implemented yet');
};
exports.processVideo = processVideo;
