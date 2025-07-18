"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flashcard_controller_1 = require("../controllers/flashcard.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = __importDefault(require("../middleware/upload.middleware"));
const router = (0, express_1.Router)();
// Protected routes - all flashcard routes require authentication
router.use(auth_middleware_1.authMiddleware);
// Basic CRUD operations
router.post('/', flashcard_controller_1.createFlashcard);
router.get('/', flashcard_controller_1.getFlashcards);
router.get('/:id', flashcard_controller_1.getFlashcardById);
router.put('/:id', flashcard_controller_1.updateFlashcard);
router.delete('/:id', flashcard_controller_1.deleteFlashcard);
// AI-powered generation routes
router.post('/generate/text', flashcard_controller_1.generateFlashcardsFromText);
router.post('/generate/pdf', upload_middleware_1.default.single('pdf'), flashcard_controller_1.generateFlashcardsFromPdf);
router.post('/generate/image', upload_middleware_1.default.single('image'), flashcard_controller_1.generateFlashcardsFromImage);
exports.default = router;
