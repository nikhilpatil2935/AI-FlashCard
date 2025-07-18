import { Schema, model, Document, Types } from 'mongoose';

// Define flashcard difficulty levels
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// Define flashcard interface
export interface IFlashcard extends Document {
  user: Types.ObjectId;
  question: string;
  answer: string;
  tags: string[];
  difficulty: Difficulty;
  nextReview: Date;
  reviewCount: number;
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create flashcard schema
const flashcardSchema = new Schema<IFlashcard>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Create indices for better query performance
flashcardSchema.index({ user: 1, tags: 1 });
flashcardSchema.index({ user: 1, nextReview: 1 });

// Create and export the Flashcard model
export default model<IFlashcard>('Flashcard', flashcardSchema);
