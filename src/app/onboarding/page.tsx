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

  // const handleFinish = async (finalData: any) => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Create a clean, serializable object with only the data we need
  //     const cleanFormData = {
  //       // Extract only serializable properties from formData
  //       goal: (formData as any).goal || '',
  //       timezone: (formData as any).timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  //       // Add any other specific properties you need from formData
  //       ...Object.keys(formData).reduce((acc, key) => {
  //         const value = (formData as any)[key];
  //         // Only include primitive values and arrays of primitives
  //         if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
  //           acc[key] = value;
  //         } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
  //           acc[key] = value;
  //         }
  //         return acc;
  //       }, {} as any),
  //       // Add the final step data
  //       activities: finalData.activities || []
  //     };

  //     console.log('Sending clean data:', cleanFormData); // Debug log

  //     const response = await fetch('/api/user/onboarding', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(cleanFormData),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || 'Failed to complete onboarding. Please try again.');
  //     }

  //     const result = await response.json();
  //     console.log('Onboarding completed successfully:', result);

  //     // Reset loading state
  //     setLoading(false);

  //     // Wait a moment for the JWT token to be fully updated
  //     console.log('Waiting for JWT token update...');
  //     await new Promise(resolve => setTimeout(resolve, 500));

  //     // Force a complete page refresh to ensure fresh JWT token
  //     console.log('Redirecting to dashboard with fresh session...');
  //     window.location.href = '/dashboard?onboarding=complete';

  //   } catch (err) {
  //     console.error('Onboarding error:', err);
  //     setError(err instanceof Error ? err.message : 'An unknown error occurred');
  //     setLoading(false);
  //   }
  // };

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

      console.log('Sending onboarding data:', cleanFormData);

      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete onboarding. Please try again.');
      }

      console.log('✅ Onboarding API completed successfully');

      // Force NextAuth session to refresh
      console.log('🔄 Forcing session refresh...');
      try {
        await update(); // This should trigger the JWT callback
        console.log('✅ Session update triggered');
      } catch (updateError) {
        console.error('Session update error:', updateError);
      }

      // Wait for token refresh to propagate
      await new Promise(resolve => setTimeout(resolve, 2000));

      setLoading(false);

      // Navigate to dashboard
      console.log('🚀 Redirecting to dashboard...');
      router.push('/dashboard?onboarding=complete');

    } catch (err) {
      console.error('Onboarding error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session...</p>
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
          {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}