// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for User document
export interface IUser extends Document {
  email: string;
  username?: string;
  password?: string;
  googleId?: string;
  name?: string;
  avatar?: string;
  goals?: string[]; // Added goals field
  metrics?: string[];
  activities?: string[];
  isOnboardingComplete: boolean;
  timezone: string;
  isActive: boolean;
  lastLoginAt?: Date;
  acceptedTermsAt?: Date;
  privacyPolicyAcceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  displayName: string; // virtual field
}

// User schema definition
const userSchema = new Schema<IUser>({ 
  // Authentication fields
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: function(this: IUser) {
      return !this.googleId; // Required only if not using OAuth
    },
    unique: true,
    sparse: true, // Allow null values but enforce uniqueness when not null
    minlength: 3,
    trim: true,
    match: /^[a-zA-Z0-9_]+$/
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.googleId; // Required only if not using OAuth
    },
    minlength: 8
  },
  
  // OAuth fields
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  
  // Profile information
  name: {
    type: String,
    trim: true
  },
  avatar: {
    type: String // URL to profile image
  },
  
  // Onboarding data fields
  goals: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  metrics: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  activities: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  
  // Onboarding status
  isOnboardingComplete: {
    type: Boolean,
    default: false
  },
  
  // User preferences
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date
  },
  
  // Privacy and terms
  acceptedTermsAt: {
    type: Date
  },
  privacyPolicyAcceptedAt: {
    type: Date
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { 
    transform: function(doc: any, ret: any) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance - REMOVED duplicates (email, username, googleId already have unique indexes)
userSchema.index({ createdAt: -1 });
userSchema.index({ isOnboardingComplete: 1 });

// Virtual for getting user's full display name
userSchema.virtual('displayName').get(function(this: IUser) {
  return this.name || this.username || this.email.split('@')[0];
});

// Ensure virtual fields are included in JSON
userSchema.set('toJSON', { virtuals: true });

// Export the model
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);