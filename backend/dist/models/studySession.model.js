"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewResult = void 0;
const mongoose_1 = require("mongoose");
// Define review result
var ReviewResult;
(function (ReviewResult) {
    ReviewResult["CORRECT"] = "correct";
    ReviewResult["INCORRECT"] = "incorrect";
    ReviewResult["SKIP"] = "skip";
})(ReviewResult || (exports.ReviewResult = ReviewResult = {}));
// Create study session schema
const studySessionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flashcards: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Flashcard',
        }],
    results: [{
            flashcard: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Flashcard',
            },
            result: {
                type: String,
                enum: Object.values(ReviewResult),
            },
            timeTaken: {
                type: Number,
            },
        }],
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
    },
    totalTime: {
        type: Number,
        default: 0,
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
studySessionSchema.index({ user: 1, createdAt: -1 });
// Create and export the StudySession model
exports.default = (0, mongoose_1.model)('StudySession', studySessionSchema);
