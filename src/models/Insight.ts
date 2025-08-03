import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Type definitions
export type CorrelationType = 'positive' | 'negative' | 'neutral';
export type InsightStatus = 'active' | 'dismissed' | 'archived';
export type InsightCategory = 'health' | 'productivity' | 'mood' | 'energy' | 'sleep' | 'exercise' | 'nutrition' | 'social' | 'other';

// Interface for statistical data
export interface IStatisticalData {
  avgWithTag: number;
  avgWithoutTag: number;
  daysWithTag: number;
  daysWithoutTag: number;
  analysisStartDate: string;
  analysisEndDate: string;
}

// Base interface for the Insight data
export interface IInsightBase {
  userId: Types.ObjectId;
  tagId: Types.ObjectId;
  metricId: Types.ObjectId;
  correlationType: CorrelationType;
  correlationStrength: number;
  pValue?: number;
  content: string;
  title: string;
  statisticalData: IStatisticalData;
  status: InsightStatus;
  isRead: boolean;
  readAt?: Date;
  userRating?: number;
  userFeedback?: string;
  priority: number;
  categories: InsightCategory[];
  createdAt: Date;
  updatedAt: Date;
}

// TypeScript interface for Insight document
export interface IInsight extends IInsightBase, Document {
  correlationDescription: string; // virtual field
  markAsRead(): Promise<IInsight>;
  dismiss(): Promise<IInsight>;
  getImpactDescription(): string;
}

// Static methods interface
export interface IInsightModel extends Model<IInsight> {
  getInsightsForUser(userId: Types.ObjectId, status?: InsightStatus): Promise<IInsight[]>;
  getUnreadCount(userId: Types.ObjectId): Promise<number>;
}

// StatisticalData sub-schema
const statisticalDataSchema = new Schema({
  avgWithTag: { type: Number, required: true },
  avgWithoutTag: { type: Number, required: true },
  daysWithTag: { type: Number, required: true },
  daysWithoutTag: { type: Number, required: true },
  analysisStartDate: { type: String, required: true },
  analysisEndDate: { type: String, required: true }
}, { _id: false });

// Insight schema definition
const insightSchema = new Schema<IInsight>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // The tag that was analyzed
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
  // The metric that was correlated
  metricId: {
    type: Schema.Types.ObjectId,
    ref: 'Metric',
    required: true
  },
  // Type of correlation found
  correlationType: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  // Strength of correlation (0-1)
  correlationStrength: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  // Statistical significance (p-value)
  pValue: {
    type: Number,
    min: 0,
    max: 1
  },
  // AI-generated insight content
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  // Short title for the insight
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  // Statistical data supporting the insight
  statisticalData: { type: statisticalDataSchema, required: true },
  // Insight status
  status: {
    type: String,
    enum: ['active', 'dismissed', 'archived'],
    default: 'active'
  },
  // User interaction
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  userFeedback: {
    type: String,
    maxlength: 500
  },
  // Priority for display (higher = more important)
  priority: {
    type: Number,
    default: 0
  },
  // Tags for categorization
  categories: [{
    type: String,
    enum: ['health', 'productivity', 'mood', 'energy', 'sleep', 'exercise', 'nutrition', 'social', 'other']
  }]
}, {
  timestamps: true
});

// Indexes for efficient querying
insightSchema.index({ userId: 1, createdAt: -1 });
insightSchema.index({ userId: 1, status: 1, priority: -1 });
insightSchema.index({ userId: 1, tagId: 1, metricId: 1 });
insightSchema.index({ userId: 1, isRead: 1 });

// Compound index to prevent duplicate insights
insightSchema.index({ userId: 1, tagId: 1, metricId: 1, correlationType: 1 }, { unique: true });

// Static method to get insights for user
insightSchema.statics.getInsightsForUser = async function(
  userId: Types.ObjectId,
  status: InsightStatus = 'active'
): Promise<IInsight[]> {
  return this.find({ userId, status })
    .populate('tagId', 'name color icon')
    .populate('metricId', 'name color')
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get unread insights count
insightSchema.statics.getUnreadCount = async function(
  userId: Types.ObjectId
): Promise<number> {
  return this.countDocuments({ userId, isRead: false, status: 'active' });
};

// Instance method to mark as read
insightSchema.methods.markAsRead = function(): Promise<IInsight> {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Instance method to dismiss insight
insightSchema.methods.dismiss = function(): Promise<IInsight> {
  this.status = 'dismissed';
  return this.save();
};

// Instance method to get impact description
insightSchema.methods.getImpactDescription = function(): string {
  const diff = Math.abs(this.statisticalData.avgWithTag - this.statisticalData.avgWithoutTag);
  const percentage = ((diff / this.statisticalData.avgWithoutTag) * 100).toFixed(1);
  
  if (this.correlationType === 'positive') {
    return `${percentage}% higher on average`;
  } else if (this.correlationType === 'negative') {
    return `${percentage}% lower on average`;
  }
  return 'No significant difference';
};

// Virtual for correlation description
insightSchema.virtual('correlationDescription').get(function() {
  const strength = this.correlationStrength;
  if (strength >= 0.7) return 'Strong';
  if (strength >= 0.5) return 'Moderate';
  if (strength >= 0.3) return 'Weak';
  return 'Very Weak';
});

// Ensure virtual fields are included in JSON
insightSchema.set('toJSON', { virtuals: true });

// Export the model
const Insight = (mongoose.models.Insight as IInsightModel) || 
  mongoose.model<IInsight, IInsightModel>('Insight', insightSchema);

export default Insight;