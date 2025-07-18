"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studySession_controller_1 = require("../controllers/studySession.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Protected routes - all study session routes require authentication
router.use(auth_middleware_1.authMiddleware);
// Basic CRUD operations
router.post('/', studySession_controller_1.createStudySession);
router.get('/', studySession_controller_1.getStudySessions);
router.get('/:id', studySession_controller_1.getStudySessionById);
router.put('/:id', studySession_controller_1.updateStudySession);
// Analytics routes
router.get('/stats/performance', studySession_controller_1.getStudyStats);
exports.default = router;
