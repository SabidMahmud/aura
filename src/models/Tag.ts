// models/Tag.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript interface for Tag document
export interface ITag extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tag schema definition
const tagSchema = new Schema<ITag>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  // Color for UI display
  color: {
    type: String,
    default: '#3B82F6' // Default blue
  },
  // Order for display
  sortOrder: {
    type: Number,
    default: 0
  },
  // Active status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index for user's tags
tagSchema.index({ userId: 1, sortOrder: 1 });
tagSchema.index({ userId: 1, isActive: 1 });

// Ensure tag names are unique per user
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

// Export the model
export default mongoose.models.Tag || mongoose.model<ITag>('Tag', tagSchema);