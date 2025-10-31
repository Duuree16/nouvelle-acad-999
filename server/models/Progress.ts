import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  lessonId: string;
  completed: boolean;
  score: number;
  progress: number;
  completedAt?: Date;
  timeSpent?: number;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    progress: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      required: false,
    },
    timeSpent: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create compound unique index on userId + lessonId (prevents duplicate progress entries)
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

// Create index on userId for fast progress retrieval by user
progressSchema.index({ userId: 1 });

export const Progress = mongoose.model<IProgress>('Progress', progressSchema);
