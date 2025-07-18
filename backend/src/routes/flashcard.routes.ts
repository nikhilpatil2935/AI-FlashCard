import { Router } from 'express';
import { 
  createFlashcard, 
  getFlashcards, 
  getFlashcardById, 
  updateFlashcard, 
  deleteFlashcard, 
  generateFlashcardsFromText,
  generateFlashcardsFromPdf,
  generateFlashcardsFromImage
} from '../controllers/flashcard.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// Protected routes - all flashcard routes require authentication
router.use(authMiddleware);

// Basic CRUD operations
router.post('/', createFlashcard);
router.get('/', getFlashcards);
router.get('/:id', getFlashcardById);
router.put('/:id', updateFlashcard);
router.delete('/:id', deleteFlashcard);

// AI-powered generation routes
router.post('/generate/text', generateFlashcardsFromText);
router.post('/generate/pdf', upload.single('pdf'), generateFlashcardsFromPdf);
router.post('/generate/image', upload.single('image'), generateFlashcardsFromImage);

export default router;
