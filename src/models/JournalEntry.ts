import mongoose, { Document, Schema, Types } from 'mongoose';

// Type definitions
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type SentimentLabel = 'very_negative' | 'negative' | 'neutral' | 'positive' | 'very_positive';
export type EntryCategory = 'daily' | 'reflection' | 'goals' | 'gratitude' | 'challenges' | 'insights' | 'other';

// Interface for sentiment analysis
export interface ISentiment {
  score: number;
  label: SentimentLabel;
  confidence: number;
}

// Interface for extracted tags
export interface IExtractedTag {
  tagId: Types.ObjectId;
  confidence: number;
  extractedText: string;
}

// Interface for AI response metadata
export interface IAIResponse {
  model: string;
  processingTime: number;
  tokensUsed: number;
  rawResponse: string;
}

// Interface for processing error
export interface IProcessingError {
  message: string;
  code: string;
  timestamp: Date;
}

// TypeScript interface for JournalEntry document
export interface IJournalEntry extends Document {
  userId: Types.ObjectId;
  content: string;
  date: string;
  entryDate: Date;
  sentiment?: ISentiment;
  aiProcessingStatus: ProcessingStatus;
  extractedTags: IExtractedTag[];
  aiResponse?: IAIResponse;
  processingError?: IProcessingError;
  categories: EntryCategory[];
  isPrivate: boolean;
  wordCount: number;
  createdAt: Date;
  updatedAt: Date;
  processingStatusDisplay: string; // virtual field
  markAsProcessing(): Promise<IJournalEntry>;
  markProcessingCompleted(extractedTags: IExtractedTag[], aiResponse: IAIResponse): Promise<IJournalEntry>;
  markProcessingFailed(error: Error): Promise<IJournalEntry>;
  getSummary(maxLength?: number): string;
}

// Static methods interface
export interface IJournalEntryModel extends mongoose.Model<IJournalEntry> {
  getEntriesForDateRange(userId: Types.ObjectId, startDate: string, endDate: string): Promise<IJournalEntry[]>;
  getPendingProcessing(): Promise<IJournalEntry[]>;
}

// JournalEntry schema definition
const journalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Original journal text
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  // Date of the entry
  date: {
    type: String,
    required: true
  },
  // Entry metadata
  entryDate: {
    type: Date,
    default: Date.now
  },
  // Mood/sentiment analysis (optional)
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1
    },
    label: {
      type: String,
      enum: ['very_negative', 'negative', 'neutral', 'positive', 'very_positive']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  },
  // AI processing status
  aiProcessingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  // AI extracted tags
  extractedTags: [{
    tagId: {
      type: Schema.Types.ObjectId,
      ref: 'Tag'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    extractedText: {
      type: String
    }
  }],
  // AI response metadata
  aiResponse: {
    model: String,
    processingTime: Number, // in milliseconds
    tokensUsed: Number,
    rawResponse: String
  },
  // Error information if AI processing failed
  processingError: {
    message: String,
    code: String,
    timestamp: Date
  },
  // Entry tags/categories
  categories: [{
    type: String,
    enum: ['daily', 'reflection', 'goals', 'gratitude', 'challenges', 'insights', 'other']
  }],
  // Privacy settings
  isPrivate: {
    type: Boolean,
    default: true
  },
  // Word count for analytics
  wordCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
journalEntrySchema.index({ userId: 1, date: -1 });
journalEntrySchema.index({ userId: 1, entryDate: -1 });
journalEntrySchema.index({ userId: 1, aiProcessingStatus: 1 });

// Text index for searching journal content
journalEntrySchema.index({ content: 'text' });

// Pre-save middleware to calculate word count and set date
journalEntrySchema.pre('save', function(this: IJournalEntry, next) {
  // Calculate word count
  this.wordCount = this.content.trim().split(/\s+/).length;
  
  // Set date if not provided
  if (!this.date) {
    this.date = new Date().toISOString().split('T')[0];
  }
  
  next();
});

// Static method to get entries for date range
journalEntrySchema.statics.getEntriesForDateRange = function(
  this: IJournalEntryModel,
  userId: Types.ObjectId,
  startDate: string,
  endDate: string
): Promise<IJournalEntry[]> {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get entries pending AI processing
journalEntrySchema.statics.getPendingProcessing = function(
  this: IJournalEntryModel
): Promise<IJournalEntry[]> {
  return this.find({
    aiProcessingStatus: { $in: ['pending', 'processing'] }
  }).sort({ entryDate: 1 });
};

// Instance method to mark as processing
journalEntrySchema.methods.markAsProcessing = function(this: IJournalEntry): Promise<IJournalEntry> {
  this.aiProcessingStatus = 'processing';
  return this.save();
};

// Instance method to mark processing as completed
journalEntrySchema.methods.markProcessingCompleted = function(
  this: IJournalEntry,
  extractedTags: IExtractedTag[],
  aiResponse: IAIResponse
): Promise<IJournalEntry> {
  this.aiProcessingStatus = 'completed';
  this.extractedTags = extractedTags;
  this.aiResponse = aiResponse;
  return this.save();
};

// Instance method to mark processing as failed
journalEntrySchema.methods.markProcessingFailed = function(
  this: IJournalEntry,
  error: Error
): Promise<IJournalEntry> {
  this.aiProcessingStatus = 'failed';
  this.processingError = {
    message: error.message,
    code: (error as any).code || 'UNKNOWN_ERROR',
    timestamp: new Date()
  };
  return this.save();
};

// Instance method to get summary
journalEntrySchema.methods.getSummary = function(
  this: IJournalEntry,
  maxLength: number = 100
): string {
  if (this.content.length <= maxLength) {
    return this.content;
  }
  return this.content.substring(0, maxLength).trim() + '...';
};

// Virtual for getting readable processing status
journalEntrySchema.virtual('processingStatusDisplay').get(function(this: IJournalEntry) {
  const statusMap = {
    'pending': 'Waiting for processing',
    'processing': 'Analyzing entry...',
    'completed': 'Analysis complete',
    'failed': 'Processing failed'
  };
  return statusMap[this.aiProcessingStatus] || 'Unknown status';
});

// Ensure virtual fields are included in JSON
journalEntrySchema.set('toJSON', { virtuals: true });

// Export the model
export default mongoose.models.JournalEntry || mongoose.model<IJournalEntry, IJournalEntryModel>('JournalEntry', journalEntrySchema);
