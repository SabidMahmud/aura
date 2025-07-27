// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import User from '@/models/User';
import dbConnect from '@/lib/db';

// GET - Get user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        isOnboardingComplete: user.isOnboardingComplete,
        timezone: user.timezone,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        displayName: user.displayName
      }
    });

  } catch (error) {
    console.error('Get profile API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
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

    // Remove sensitive fields that shouldn't be updated this way
    delete updateData.password;
    delete updateData.email;
    delete updateData._id;
    delete updateData.googleId;
    delete updateData.createdAt;

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
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id.toString(),
        email: updatedUser.email,
        username: updatedUser.username,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        isOnboardingComplete: updatedUser.isOnboardingComplete,
        timezone: updatedUser.timezone,
        isActive: updatedUser.isActive,
        updatedAt: updatedUser.updatedAt,
        displayName: updatedUser.displayName
      }
    });

  } catch (error: any) {
    console.error('Update profile API error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { success: false, message: `This ${field} is already taken` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Soft delete - mark as inactive instead of actually deleting
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}