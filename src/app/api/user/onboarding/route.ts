// app/api/user/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import dbConnect from '@/lib/db';

// GET - Get onboarding status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('isOnboardingComplete');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      isOnboardingComplete: user.isOnboardingComplete
    });

  } catch (error) {
    console.error('Get onboarding status API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Complete onboarding
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get optional onboarding data
    const body = await request.json().catch(() => ({}));
    
    await dbConnect();

    // Update user with onboarding completion and any additional data
    const updateData = {
      isOnboardingComplete: true,
      updatedAt: new Date(),
      ...body // Include any additional onboarding data
    };

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData._id;
    delete updateData.googleId;

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { 
        new: true,
        select: '-password'
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        isOnboardingComplete: updatedUser.isOnboardingComplete,
        timezone: updatedUser.timezone,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Complete onboarding API error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update onboarding data (without completing)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updateData = await request.json();
    
    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData._id;
    delete updateData.googleId;
    delete updateData.isOnboardingComplete; // Don't allow completing via PUT

    // Add update timestamp
    updateData.updatedAt = new Date();

    await dbConnect();

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      updateData,
      { 
        new: true,
        runValidators: true,
        select: '-password'
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding data updated successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        isOnboardingComplete: updatedUser.isOnboardingComplete,
        timezone: updatedUser.timezone,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Update onboarding API error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}