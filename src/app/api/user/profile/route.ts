// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/db'; // Adjust path to your DB connection
import User, {} from '@/models/User';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


// Type definitions for the API response
interface ProfileStats {
  totalGoals: number;
  totalMetrics: number;
  totalActivities: number;
  daysActive: number;
  accountAge: number;
}

interface ActivityWithCategory {
  name: string;
  category: string;
  frequency?: string;
}

interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  timezone: string;
  displayName: string;
  joinDate: string;
  lastLoginAt?: string;
  isActive: boolean;
  isOnboardingComplete: boolean;
  goals: string[];
  metrics: string[];
  activities: ActivityWithCategory[];
  stats: ProfileStats;
  accountInfo: {
    status: 'Active' | 'Inactive';
    planType: string;
    notificationsEnabled: boolean;
    privacyLevel: 'Public' | 'Private';
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
  };
}

// Helper function to categorize activities (you can customize this logic)
function categorizeActivity(activity: string): string {
  const activityLower = activity.toLowerCase();

  if (activityLower.includes('workout') || activityLower.includes('exercise') ||
    activityLower.includes('gym') || activityLower.includes('run') ||
    activityLower.includes('fitness')) {
    return 'Fitness';
  }

  if (activityLower.includes('read') || activityLower.includes('book') ||
    activityLower.includes('study') || activityLower.includes('learn')) {
    return 'Learning';
  }

  if (activityLower.includes('meditat') || activityLower.includes('mindful') ||
    activityLower.includes('yoga') || activityLower.includes('wellness')) {
    return 'Wellness';
  }

  if (activityLower.includes('language') || activityLower.includes('spanish') ||
    activityLower.includes('french') || activityLower.includes('coding') ||
    activityLower.includes('skill')) {
    return 'Education';
  }

  return 'General';
}

// Helper function to estimate frequency (you might want to store this in your model)
function estimateFrequency(): string {
  const frequencies = ['Daily', '5x/week', '3x/week', '2x/week', 'Weekly'];
  return frequencies[Math.floor(Math.random() * frequencies.length)];
}

// Helper function to calculate days active
function calculateDaysActive(createdAt: Date, lastLoginAt?: Date): number {
  const start = new Date(createdAt);
  const end = lastLoginAt ? new Date(lastLoginAt) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// GET /api/profile - Fetch user profile
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find user by email from session
    const user = await User.findOne({
      email: session.user.email
    }).select('-password'); // Exclude password field

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Transform activities to include categories
    const activitiesWithCategories: ActivityWithCategory[] = (user.activities || []).map((activity: string) => ({
      name: activity,
      category: categorizeActivity(activity),
      frequency: estimateFrequency() // You might want to store this in your model
    }));

    // Calculate stats
    const stats: ProfileStats = {
      totalGoals: user.goals?.length || 0,
      totalMetrics: user.metrics?.length || 0,
      totalActivities: user.activities?.length || 0,
      daysActive: calculateDaysActive(user.createdAt, user.lastLoginAt),
      accountAge: Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    };

    // Prepare response data
    const profileData: ProfileResponse = {
      id: user._id.toString(),
      name: user.name || user.displayName,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      timezone: user.timezone,
      displayName: user.displayName,
      joinDate: user.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString(),
      isActive: user.isActive,
      isOnboardingComplete: user.isOnboardingComplete,
      goals: user.goals || [],
      metrics: user.metrics || [],
      activities: activitiesWithCategories,
      stats,
      accountInfo: {
        status: user.isActive ? 'Active' : 'Inactive',
        planType: 'Premium', // You might want to add this to your user model
        notificationsEnabled: true, // You might want to add this to your user model
        privacyLevel: 'Public', // You might want to add this to your user model
        termsAccepted: !!user.acceptedTermsAt,
        privacyPolicyAccepted: !!user.privacyPolicyAcceptedAt
      }
    };

    // Update last login time
    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Profile Update API Error:', error);

    // Safely handle specific Mongoose/database errors
    if (error && typeof error === 'object') {
      if ('name' in error && error.name === 'ValidationError') {
        const validationError = error as unknown as { errors: { [key: string]: { message: string } } };
        const validationMessages = Object.values(validationError.errors).map(err => err.message);
        return NextResponse.json(
          { error: 'Validation failed.', details: validationMessages },
          { status: 400 }
        );
      }

      if ('code' in error && error.code === 11000) {
        const duplicateError = error as unknown as { keyPattern: { [key: string]: number } };
        const field = Object.keys(duplicateError.keyPattern)[0];
        return NextResponse.json(
          { error: `The ${field} is already taken.` },
          { status: 409 }
        );
      }
    }

    // Fallback for general errors
    let errorMessage = 'Internal server error occurred while updating profile.';
    if (process.env.NODE_ENV === 'development') {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error occurred while updating profile.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update user profile (basic fields only)
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username, timezone, avatar } = body;

    // Validate input
    if (username && (typeof username !== 'string' || username.length < 3)) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: 'Username can only contain letters, numbers, and underscores.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Check if username is already taken (if provided)
    if (username) {
      const existingUser = await User.findOne({
        username,
        email: { $ne: session.user.email } // Exclude current user
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken.' },
          { status: 409 }
        );
      }
    }

    // Update user profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        ...(name && { name }),
        ...(username && { username }),
        ...(timezone && { timezone }),
        ...(avatar && { avatar })
      },
      {
        new: true, // Return updated document
        runValidators: true // Run mongoose validators
      }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        username: updatedUser.username,
        timezone: updatedUser.timezone,
        avatar: updatedUser.avatar,
        displayName: updatedUser.displayName
      }
    });

  } catch (error) {
    console.error('Profile Update API Error:', error);

    // Safely handle specific Mongoose/database errors
    if (error && typeof error === 'object') {
      if ('name' in error && error.name === 'ValidationError') {
        const validationError = error as unknown as { errors: { [key: string]: { message: string } } };
        const validationMessages = Object.values(validationError.errors).map(err => err.message);
        return NextResponse.json(
          { error: 'Validation failed.', details: validationMessages },
          { status: 400 }
        );
      }

      if ('code' in error && error.code === 11000) {
        const duplicateError = error as unknown as { keyPattern: { [key: string]: number } };
        const field = Object.keys(duplicateError.keyPattern)[0];
        return NextResponse.json(
          { error: `The ${field} is already taken.` },
          { status: 409 }
        );
      }
    }

    // Fallback for general errors
    let errorMessage = 'An unexpected error occurred while updating profile.';
    if (process.env.NODE_ENV === 'development') {
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error); // Convert non-Error types to string
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error occurred while updating profile.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
