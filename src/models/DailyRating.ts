import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Interface for individual rating
export interface IRating {
  metricId: Types.ObjectId;
  value: number;
  notes?: string;
}

// Base interface for the DailyRating data
export interface IDailyRatingBase {
  userId: Types.ObjectId;
  date: string;
  ratings: Map<string, IRating>;
  dayNotes?: string;
  submittedAt: Date;
  overallMood?: number;
  overallEnergy?: number;
  sleepQuality?: number;
  sleepHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

// TypeScript interface for DailyRating document
export interface IDailyRating extends IDailyRatingBase, Document {
  getRatingForMetric(metricId: Types.ObjectId): IRating | undefined;
  setRatingForMetric(metricId: Types.ObjectId, value: number, notes?: string): void;
}

// Static methods interface
export interface IDailyRatingModel extends Model<IDailyRating> {
  getRatingsForDateRange(userId: Types.ObjectId, startDate: string, endDate: string): Promise<IDailyRating[]>;
  getAverageRatings(userId: Types.ObjectId, metricId: Types.ObjectId, days?: number): Promise<any[]>;
}

// DailyRating schema definition
const dailyRatingSchema = new Schema<IDailyRating>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Date in YYYY-MM-DD format
  date: {
    type: String,
    required: true
  },
  // Map of metricId to rating value
  ratings: {
    type: Map,
    of: {
      metricId: {
        type: Schema.Types.ObjectId,
        ref: 'Metric',
        required: true
      },
      value: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      notes: {
        type: String,
        trim: true,
        maxlength: 200
      }
    },
    required: true
  },
  // Overall notes for the day
  dayNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  // When the rating was submitted
  submittedAt: {
    type: Date,
    default: Date.now
  },
  // Mood tracking (optional quick rating)
  overallMood: {
    type: Number,
    min: 1,
    max: 5
  },
  // Energy level (optional quick rating)
  overallEnergy: {
    type: Number,
    min: 1,
    max: 5
  },
  // Sleep quality from previous night
  sleepQuality: {
    type: Number,
    min: 1,
    max: 5
  },
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  }
}, {
  timestamps: true
});

// Compound unique index to ensure one rating per user per day
dailyRatingSchema.index({ userId: 1, date: 1 }, { unique: true });

// Index for date range queries
dailyRatingSchema.index({ userId: 1, date: -1 });

// Index for analytics queries
dailyRatingSchema.index({ userId: 1, submittedAt: -1 });

// Static method to get ratings for a date range
dailyRatingSchema.statics.getRatingsForDateRange = async function(
  userId: Types.ObjectId,
  startDate: string,
  endDate: string
): Promise<IDailyRating[]> {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get average ratings for metrics
dailyRatingSchema.statics.getAverageRatings = async function(
  userId: Types.ObjectId,
  metricId: Types.ObjectId,
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
      $addFields: {
        ratingsArray: { $objectToArray: '$ratings' }
      }
    },
    {
      $unwind: '$ratingsArray'
    },
    {
      $match: {
        'ratingsArray.v.metricId': new mongoose.Types.ObjectId(metricId.toString())
      }
    },
    {
      $group: {
        _id: '$userId',
        averageRating: { $avg: '$ratingsArray.v.value' },
        count: { $sum: 1 },
        minRating: { $min: '$ratingsArray.v.value' },
        maxRating: { $max: '$ratingsArray.v.value' }
      }
    }
  ]);
};

// Instance method to get rating for a specific metric
dailyRatingSchema.methods.getRatingForMetric = function(
  metricId: Types.ObjectId
): IRating | undefined {
  const metricIdStr = metricId.toString();
  return this.ratings.get(metricIdStr);
};

// Instance method to set rating for a specific metric
dailyRatingSchema.methods.setRatingForMetric = function(
  metricId: Types.ObjectId,
  value: number,
  notes: string = ''
): void {
  const metricIdStr = metricId.toString();
  this.ratings.set(metricIdStr, {
    metricId: metricId,
    value: value,
    notes: notes
  });
};

// Export the model
const DailyRating = (mongoose.models.DailyRating as IDailyRatingModel) || 
  mongoose.model<IDailyRating, IDailyRatingModel>('DailyRating', dailyRatingSchema);

export default DailyRating;