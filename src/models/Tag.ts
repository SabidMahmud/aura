import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript interface for Tag document
export interface ITag extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  color: string;
  icon?: string;
  sortOrder: number;
  usageCount: number;
  lastUsedAt?: Date;
  isActive: boolean;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
  incrementUsage(): Promise<ITag>;
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
  // Category for grouping tags
  category: {
    type: String,
    trim: true,
    maxlength: 30,
    default: 'General'
  },
  // Color for UI display
  color: {
    type: String,
    default: '#10B981' // Default green
  },
  // Icon or emoji for display
  icon: {
    type: String,
    maxlength: 10
  },
  // Order for display
  sortOrder: {
    type: Number,
    default: 0
  },
  // Usage statistics
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsedAt: {
    type: Date
  },
  // Active status
  isActive: {
    type: Boolean,
    default: true
  },
  // AI extraction keywords (for journal parsing)
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Compound indexes for user's tags
tagSchema.index({ userId: 1, sortOrder: 1 });
tagSchema.index({ userId: 1, isActive: 1 });
tagSchema.index({ userId: 1, category: 1 });
tagSchema.index({ userId: 1, usageCount: -1 });

// Ensure tag names are unique per user
tagSchema.index({ userId: 1, name: 1 }, { unique: true });

// Text index for keyword search
tagSchema.index({ name: 'text', keywords: 'text' });

// Method to increment usage count
tagSchema.methods.incrementUsage = function(this: ITag): Promise<ITag> {
  this.usageCount++;
  this.lastUsedAt = new Date();
  return this.save();
};

// Export the model
export default mongoose.models.Tag || mongoose.model<ITag>('Tag', tagSchema);
