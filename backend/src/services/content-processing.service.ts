import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { summarizeText } from './ai.service';

/**
 * Extract text from a PDF file
 * @param file The uploaded PDF file
 * @returns Extracted text from the PDF
 */
export const extractTextFromPdf = async (file: Express.Multer.File): Promise<string> => {
  try {
    // For development environment using local file system
    if (process.env.NODE_ENV !== 'production' && file.path) {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      return data.text;
    } 
    // For production using Cloudinary URL
    else if (file.path) {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdf(dataBuffer);
      return data.text;
    } else {
      throw new Error('File path not available');
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Process PDF text for better flashcard generation
 * @param text Raw text extracted from PDF
 * @returns Processed text ready for flashcard generation
 */
export const processPdfText = async (text: string): Promise<string> => {
  try {
    // Clean up the text
    let processedText = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with a single space
      .replace(/(\r\n|\n|\r)/gm, ' ')  // Replace newlines with spaces
      .trim();
      
    // If the text is too long, summarize it
    if (processedText.length > 10000) {
      processedText = await summarizeText(processedText, 2000);
    }
    
    return processedText;
  } catch (error) {
    console.error('Error processing PDF text:', error);
    throw new Error('Failed to process PDF text');
  }
};

/**
 * Extract text from an image using OCR
 * @param file The uploaded image file
 * @returns Extracted text from the image
 */
export const processImage = async (file: Express.Multer.File): Promise<string> => {
  try {
    // Initialize Tesseract worker for OCR
    const worker = await createWorker();
    
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
    } else {
      throw new Error('File path not available');
    }
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Process video for transcription
 * This is a placeholder function that would need to be implemented
 * with a proper video transcription service like AWS Transcribe
 */
export const processVideo = async (file: Express.Multer.File): Promise<string> => {
  // This would need to be implemented with a third-party service
  throw new Error('Video processing not implemented yet');
};
