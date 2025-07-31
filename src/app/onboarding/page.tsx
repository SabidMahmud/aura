// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import WelcomeStep from '@/components/onboarding/steps/WelcomeStep';
import GoalsStep from '@/components/onboarding/steps/GoalStep';
import ActivitiesStep from '@/components/onboarding/steps/ActivitiesStep';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status, update } = useSession({ required: true });

  const totalSteps = 3;
  const progress = Math.ceil((step / totalSteps) * 100);

  const handleNext = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  // Replace your handleFinish function with this simplified version:

const handleFinish = async (finalData: any) => {
  setLoading(true);
  setError(null);

  try {
    const cleanFormData = {
      goal: (formData as any).goal || '',
      timezone: (formData as any).timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      ...Object.keys(formData).reduce((acc, key) => {
        const value = (formData as any)[key];
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          acc[key] = value;
        } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
          acc[key] = value;
        }
        return acc;
      }, {} as any),
      activities: finalData.activities || []
    };

    console.log('🚀 Starting onboarding completion process...');
    console.log('Sending onboarding data:', cleanFormData);

    // Step 1: Complete onboarding via API (this updates the database)
    const response = await fetch('/api/user/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanFormData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to complete onboarding. Please try again.');
    }

    console.log('✅ Onboarding API completed successfully - database updated');

    // Step 2: Set bypass cookie for immediate middleware access
    document.cookie = 'onboarding-complete=true; path=/; max-age=300; SameSite=Lax';
    console.log('🍪 Bypass cookie set');

    // Step 3: Force NextAuth session update with the new status
    console.log('🔄 Calling update({ isOnboardingComplete: true }) to trigger JWT refresh...');
    await update({ isOnboardingComplete: true });
    console.log('✅ Session update called');

    // Step 4: Small delay to ensure token propagation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 5: Navigate to dashboard
    console.log('🚀 Navigating to dashboard...');
    router.replace('/dashboard?onboarding=complete');

    setLoading(false);

  } catch (err) {
    console.error('❌ Onboarding error:', err);
    setError(err instanceof Error ? err.message : 'An unknown error occurred');
    setLoading(false);
  }
};

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={handleNext} name={session?.user?.name || 'there'} />;
      case 2:
        return <GoalsStep onNext={handleNext} />;
      case 3:
        return <ActivitiesStep onFinish={handleFinish} prevStep={handlePrev} isLoading={loading} />;
      default:
        return <WelcomeStep onNext={handleNext} name={session?.user?.name || 'there'} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-2 w-full rounded-full bg-gray-200">
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-gray-900 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {loading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <p className="text-sm text-blue-600">
                  Completing your onboarding and setting up your account...
                </p>
              </div>
            </div>
          )}
          
          {renderStep()}
        </div>
      </div>
    </div>
  );
}