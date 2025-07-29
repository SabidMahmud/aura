// src/app/api/user/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import Metric from '@/models/Metric';
import Tag from '@/models/Tag';
import dbConnect from '@/lib/db';

// GET - Check onboarding status
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
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

    // Store the user email to avoid scope conflicts
    const userEmail = session.user.email;

    // Start a MongoDB transaction
    const mongoSession = await User.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        // Update user with onboarding data and mark as complete
        const updatedUser = await User.findOneAndUpdate(
          { email: userEmail }, // Use the stored email variable
          {
            $set: {
              timezone: timezone,
              goals: goals || [],
              activities: activities,
              isOnboardingComplete: true,
              onboardingCompleted: true // Keep both for backward compatibility
            }
          },
          { new: true, runValidators: true, session: mongoSession }
        );

        if (!updatedUser) {
          throw new Error('User not found');
        }

        console.log('✅ User updated successfully:', {
          id: updatedUser._id,
          email: updatedUser.email,
          isOnboardingComplete: updatedUser.isOnboardingComplete
        });

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
          await Metric.deleteMany({ userId: updatedUser._id }, { session: mongoSession });
          await Metric.insertMany(defaultMetrics, { session: mongoSession });
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
          await Tag.deleteMany({ userId: updatedUser._id }, { session: mongoSession });
          await Tag.insertMany(defaultTags, { session: mongoSession });
        }
      });

      // Verify the update worked
      const verifyUser = await User.findOne({ email: userEmail });
      console.log('🔍 VERIFICATION - User onboarding status after update:', verifyUser?.isOnboardingComplete);

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
      await mongoSession.endSession();
    }

  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to complete onboarding'
    }, { status: 500 });
  }
}