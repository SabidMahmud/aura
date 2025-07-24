import mongoose, { Document, Schema, Types } from 'mongoose';

// TypeScript interface for Metric document
export interface IMetric extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  minValue: number;
  maxValue: number;
  scaleLabels: Map<string, string>;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Metric schema definition
const metricSchema = new Schema<IMetric>({
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
  // Scale configuration
  minValue: {
    type: Number,
    default: 1
  },
  maxValue: {
    type: Number,
    default: 5
  },
  // Labels for scale points (optional)
  scaleLabels: {
    type: Map,
    of: String,
    default: new Map()
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

// Compound index for user's metrics
metricSchema.index({ userId: 1, sortOrder: 1 });
metricSchema.index({ userId: 1, isActive: 1 });

// Ensure metric names are unique per user
metricSchema.index({ userId: 1, name: 1 }, { unique: true });

// Export the model
export default mongoose.models.Metric || mongoose.model<IMetric>('Metric', metricSchema);
