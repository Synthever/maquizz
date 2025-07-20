import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizQuestion {
  question: string;
  answer: number;
  operation: string;
  level: string;
}

export interface IQuizEpisode extends Document {
  operation: string;
  level: string;
  episode: number;
  questions: IQuizQuestion[];
  timeLimit: number; // in seconds
  pointsPerQuestion: number;
  isUnlocked: boolean;
  prerequisites?: {
    operation: string;
    level: string;
    episode: number;
  }[];
}

const QuizEpisodeSchema = new Schema<IQuizEpisode>({
  operation: {
    type: String,
    enum: ['addition', 'subtraction', 'multiplication', 'division', 'mixed'],
    required: true,
  },
  level: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'extreme'],
    required: true,
  },
  episode: {
    type: Number,
    required: true,
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: Number,
      required: true,
    },
    operation: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  }],
  timeLimit: {
    type: Number,
    required: true,
  },
  pointsPerQuestion: {
    type: Number,
    required: true,
  },
  isUnlocked: {
    type: Boolean,
    default: true,
  },
  prerequisites: [{
    operation: String,
    level: String,
    episode: Number,
  }],
}, {
  timestamps: true,
});

// Create compound index for efficient querying
QuizEpisodeSchema.index({ operation: 1, level: 1, episode: 1 }, { unique: true });

export default mongoose.models.QuizEpisode || mongoose.model<IQuizEpisode>('QuizEpisode', QuizEpisodeSchema);
