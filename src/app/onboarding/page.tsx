// app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Import the modular components
import WelcomeStep from '@/components/onboarding/steps/WelcomeStep';
import GoalsStep from '@/components/onboarding/steps/GoalStep';
import ActivitiesStep from '@/components/onboarding/steps/ActivitiesStep'; // Your new component
// import { Goal } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });

  const totalSteps = 3;
  const progress = Math.ceil((step / totalSteps) * 100);

  const handleNext = (data = {}) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  // Function to go to the previous step
  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinish = async (finalData: any) => { // `finalData` will be { activities: [...] } not the browser's circular FormData
  setLoading(true);
  setError(null);
  const finalFormData = { ...formData, ...finalData }; // Merges previous steps with the final one

  try {
    const response = await fetch('/api/user/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // This will now correctly serialize your form data without circular references
      body: JSON.stringify(finalFormData), 
    });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding. Please try again.');
      }
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
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
          return <GoalsStep onNext={handleNext}/> // prevStep={handlePrev} />; // Pass prevStep here too
        case 3:
        return <ActivitiesStep onFinish={handleFinish} prevStep={handlePrev} isLoading={loading} />;
      default:
        return <WelcomeStep onNext={handleNext} name={session?.user?.name || 'there'} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl"> {/* Increased max-width for more space */}
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