// src/app/api/user/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import Metric from '@/models/Metric';
import Tag from '@/models/Tag';
import dbConnect from '@/lib/db';

// GET - Check onboarding status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ 
      email: session.user.email 
    }).select('timezone goals activities isOnboardingComplete onboardingCompleted');

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      isOnboardingComplete: user.isOnboardingComplete || user.onboardingCompleted || false,
      data: {
        timezone: user.timezone,
        goals: user.goals || [],
        activities: user.activities || []
      }
    });

  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

// PUT - Update onboarding data (partial update)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { timezone, goals, activities } = body;

    // Validate input data
    const updateData: any = {};
    
    if (timezone && typeof timezone === 'string') {
      updateData.timezone = timezone;
    }
    
    if (goals && Array.isArray(goals)) {
      updateData.goals = goals.filter(goal => typeof goal === 'string' && goal.trim());
    }
    
    if (activities && Array.isArray(activities)) {
      updateData.activities = activities.filter(activity => typeof activity === 'string' && activity.trim());
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No valid data provided'
      }, { status: 400 });
    }

    await dbConnect();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data updated successfully',
      data: {
        timezone: updatedUser.timezone,
        goals: updatedUser.goals || [],
        activities: updatedUser.activities || []
      }
    });

  } catch (error) {
    console.error('Error updating onboarding data:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update onboarding data'
    }, { status: 500 });
  }
}

// POST - Complete onboarding
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { timezone, goals, activities } = body;

    // Validate required data for completion
    if (!timezone || !Array.isArray(activities) || activities.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Timezone and at least one activity are required to complete onboarding'
      }, { status: 400 });
    }

    await dbConnect();

    // Start a transaction to ensure data consistency
    const session_db = await User.startSession();
    
    try {
      await session_db.withTransaction(async () => {
        // Update user with onboarding data and mark as complete
        const updatedUser = await User.findOneAndUpdate(
          { email: session.user.email },
          {
            $set: {
              timezone: timezone,
              goals: goals || [],
              activities: activities,
              isOnboardingComplete: true,
              onboardingCompleted: true // Keep both for backward compatibility
            }
          },
          { new: true, runValidators: true, session: session_db }
        );

        if (!updatedUser) {
          throw new Error('User not found');
        }

        // Create default metrics from activities (optional)
        const defaultMetrics = activities.slice(0, 5).map((activity: string, index: number) => ({
          userId: updatedUser._id,
          name: activity,
          description: `Track your ${activity.toLowerCase()} progress`,
          minValue: 1,
          maxValue: 5,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index] || '#6B7280',
          sortOrder: index,
          isActive: true
        }));

        if (defaultMetrics.length > 0) {
          // Remove existing metrics for this user to avoid duplicates
          await Metric.deleteMany({ userId: updatedUser._id }, { session: session_db });
          await Metric.insertMany(defaultMetrics, { session: session_db });
        }

        // Create default tags from activities
        const defaultTags = activities.map((activity: string, index: number) => ({
          userId: updatedUser._id,
          name: activity,
          description: `Tag for ${activity.toLowerCase()}`,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5] || '#6B7280',
          sortOrder: index,
          isActive: true
        }));

        if (defaultTags.length > 0) {
          // Remove existing tags for this user to avoid duplicates
          await Tag.deleteMany({ userId: updatedUser._id }, { session: session_db });
          await Tag.insertMany(defaultTags, { session: session_db });
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Onboarding completed successfully',
        data: {
          onboardingComplete: true
        }
      });

    } catch (transactionError) {
      console.error('Transaction error:', transactionError);
      throw transactionError;
    } finally {
      await session_db.endSession();
    }

  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to complete onboarding'
    }, { status: 500 });
  }
}