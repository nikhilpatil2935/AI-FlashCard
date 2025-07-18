"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStudySession = exports.validateFlashcard = exports.validateLogin = exports.validateRegistration = void 0;
// User registration validation
const validateRegistration = (name, email, password) => {
    if (!name || !email || !password) {
        return 'Please provide all required fields';
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address';
    }
    // Validate password
    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }
    return null;
};
exports.validateRegistration = validateRegistration;
// User login validation
const validateLogin = (email, password) => {
    if (!email || !password) {
        return 'Please provide both email and password';
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please provide a valid email address';
    }
    return null;
};
exports.validateLogin = validateLogin;
// Flashcard validation
const validateFlashcard = (question, answer) => {
    if (!question || !answer) {
        return 'Question and answer are required';
    }
    if (question.trim().length < 3) {
        return 'Question must be at least 3 characters long';
    }
    if (answer.trim().length < 1) {
        return 'Answer cannot be empty';
    }
    return null;
};
exports.validateFlashcard = validateFlashcard;
// Study session validation
const validateStudySession = (flashcards, startTime, endTime) => {
    if (!flashcards || flashcards.length === 0) {
        return 'At least one flashcard is required for a study session';
    }
    if (!startTime) {
        return 'Start time is required';
    }
    if (endTime && endTime < startTime) {
        return 'End time cannot be before start time';
    }
    return null;
};
exports.validateStudySession = validateStudySession;
