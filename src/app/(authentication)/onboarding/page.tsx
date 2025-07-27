// src/app/(authentication)/onboarding/page.tsx
'use client'; // Add this directive for client components

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Changed from 'next/router'
import { useEffect } from 'react';
import OnboardingFlow from '@/components/onboarding/Onboardingflow';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // If user has already completed onboarding, redirect to dashboard
    if (session?.user?.isOnboardingComplete) {
      router.push('/profile');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <OnboardingFlow />;
}