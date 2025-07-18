import { Schema, model, Document, Types } from 'mongoose';

// Define review result
export enum ReviewResult {
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  SKIP = 'skip'
}

// Define study session interface
export interface IStudySession extends Document {
  user: Types.ObjectId;
  flashcards: Types.ObjectId[];
  results: {
    flashcard: Types.ObjectId;
    result: ReviewResult;
    timeTaken: number; // in milliseconds
  }[];
  startTime: Date;
  endTime: Date;
  totalTime: number; // in milliseconds
  correctCount: number;
  incorrectCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create study session schema
const studySessionSchema = new Schema<IStudySession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flashcards: [{
      type: Schema.Types.ObjectId,
      ref: 'Flashcard',
    }],
    results: [{
      flashcard: {
        type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

// Create indices for better query performance
studySessionSchema.index({ user: 1, createdAt: -1 });

// Create and export the StudySession model
export default model<IStudySession>('StudySession', studySessionSchema);
