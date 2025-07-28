// src/app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { metrics, activities } = await request.json();

    // Validate input
    if (!Array.isArray(metrics) || !Array.isArray(activities)) {
      return NextResponse.json(
        { error: 'Invalid data format' }, 
        { status: 400 }
      );
    }

    await dbConnect();

    // Update user with new preferences
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { 
        metrics: metrics,
        activities: activities,
        isOnboardingComplete: true,
        onboardingCompleted: true, // Update both fields for consistency
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Preferences saved successfully' 
    });

  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}