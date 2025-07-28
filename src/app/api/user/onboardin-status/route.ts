// src/app/api/user/onboarding-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Find user by email and select only needed fields
    const user = await User.findOne({ 
      email: session.user.email 
    }).select('metrics activities isOnboardingComplete onboardingCompleted');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      metrics: user.metrics || [],
      activities: user.activities || [],
      isOnboardingComplete: user.isOnboardingComplete,
      onboardingCompleted: user.onboardingCompleted
    });

  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}