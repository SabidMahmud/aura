import mongoose, { Document, Schema, Types } from 'mongoose';

// Source type for action logging
export type ActionSource = 'manual' | 'journal' | 'api';

// TypeScript interface for ActionLog document
export interface IActionLog extends Document {
  userId: Types.ObjectId;
  tagId: Types.ObjectId;
  loggedAt: Date;
  date: string;
  source: ActionSource;
  notes?: string;
  intensity?: number;
  duration?: number;
  context?: string;
  journalEntryId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
export interface IActionLogModel extends mongoose.Model<IActionLog> {
  getActionsForDateRange(userId: Types.ObjectId, startDate: string, endDate: string): Promise<IActionLog[]>;
  getDailyActionCounts(userId: Types.ObjectId, days?: number): Promise<any[]>;
}

// ActionLog schema definition
const actionLogSchema = new Schema<IActionLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tagId: {
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  },
  // When the action occurred
  loggedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  // Date in YYYY-MM-DD format for easy querying
  date: {
    type: String,
    required: true
  },
  // How the action was logged
  source: {
    type: String,
    enum: ['manual', 'journal', 'api'],
    default: 'manual'
  },
  // Additional context (optional)
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  // Intensity or rating (optional)
  intensity: {
    type: Number,
    min: 1,
    max: 5
  },
  // Duration in minutes (optional)
  duration: {
    type: Number,
    min: 0
  },
  // Location or context (optional)
  context: {
    type: String,
    trim: true,
    maxlength: 100
  },
  // Reference to journal entry if logged via AI
  journalEntryId: {
    type: Schema.Types.ObjectId,
    ref: 'JournalEntry'
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
actionLogSchema.index({ userId: 1, date: -1 });
actionLogSchema.index({ userId: 1, tagId: 1, date: -1 });
actionLogSchema.index({ userId: 1, loggedAt: -1 });
actionLogSchema.index({ tagId: 1, date: -1 });

// Compound index for analytics queries
actionLogSchema.index({ userId: 1, date: 1, tagId: 1 });

// Pre-save middleware to set the date field
actionLogSchema.pre('save', function(this: IActionLog, next) {
  if (this.loggedAt) {
    // Convert loggedAt to YYYY-MM-DD format
    const date = new Date(this.loggedAt);
    this.date = date.toISOString().split('T')[0];
  }
  next();
});

// Static method to get actions for a date range
actionLogSchema.statics.getActionsForDateRange = function(
  this: IActionLogModel,
  userId: Types.ObjectId,
  startDate: string,
  endDate: string
): Promise<IActionLog[]> {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).populate('tagId').sort({ loggedAt: -1 });
};

// Static method to get daily action counts
actionLogSchema.statics.getDailyActionCounts = function(
  this: IActionLogModel,
  userId: Types.ObjectId,
  days: number = 30
): Promise<any[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateStr = startDate.toISOString().split('T')[0];
  
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId.toString()),
        date: { $gte: startDateStr }
      }
    },
    {
      $group: {
        _id: '$date',
        count: { $sum: 1 },
        tags: { $addToSet: '$tagId' }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
};

// Export the model
export default mongoose.models.ActionLog || mongoose.model<IActionLog, IActionLogModel>('ActionLog', actionLogSchema);
