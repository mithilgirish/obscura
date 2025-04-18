
// models/Book.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  userId: string;
  title: string;
  author: string;
  status: 'reading' | 'completed' | 'to-read';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['reading', 'completed', 'to-read'],
      default: 'to-read'
    },
    notes: { type: String },
  }, 
  { timestamps: true }
);

// Compound index for userId + title to ensure unique books per user
BookSchema.index({ userId: 1, title: 1 }, { unique: true });

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);