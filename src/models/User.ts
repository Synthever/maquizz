import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  totalPoints: number;
  completedEpisodes: {
    operation: string;
    level: string;
    episode: number;
    score: number;
    timeCompleted: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  profilePicture: {
    type: String,
    default: '',
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  completedEpisodes: [{
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
    score: {
      type: Number,
      required: true,
    },
    maxScore: {
      type: Number,
      default: 10,
    },
    isPerfect: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 1,
    },
    bestScore: {
      type: Number,
      required: true,
    },
    timeCompleted: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Create index for leaderboard queries
UserSchema.index({ totalPoints: -1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
