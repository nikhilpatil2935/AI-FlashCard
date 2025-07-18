"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difficulty = void 0;
const mongoose_1 = require("mongoose");
// Define flashcard difficulty levels
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "easy";
    Difficulty["MEDIUM"] = "medium";
    Difficulty["HARD"] = "hard";
})(Difficulty || (exports.Difficulty = Difficulty = {}));
// Create flashcard schema
const flashcardSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    difficulty: {
        type: String,
        enum: Object.values(Difficulty),
        default: Difficulty.MEDIUM,
    },
    nextReview: {
        type: Date,
        default: Date.now,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    lastReviewed: {
        type: Date,
    },
    correctCount: {
        type: Number,
        default: 0,
    },
    incorrectCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
// Create indices for better query performance
flashcardSchema.index({ user: 1, tags: 1 });
flashcardSchema.index({ user: 1, nextReview: 1 });
// Create and export the Flashcard model
exports.default = (0, mongoose_1.model)('Flashcard', flashcardSchema);
