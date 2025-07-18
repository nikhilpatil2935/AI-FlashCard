import { Router } from 'express';
import { 
  createStudySession, 
  getStudySessions, 
  getStudySessionById, 
  updateStudySession, 
  getStudyStats
} from '../controllers/studySession.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected routes - all study session routes require authentication
router.use(authMiddleware);

// Basic CRUD operations
router.post('/', createStudySession);
router.get('/', getStudySessions);
router.get('/:id', getStudySessionById);
router.put('/:id', updateStudySession);

// Analytics routes
router.get('/stats/performance', getStudyStats);

export default router;
