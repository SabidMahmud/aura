// components/onboarding/WelcomeStep.tsx
'use client';

interface WelcomeStepProps {
  onNext: () => void;
  name: string;
}

export default function WelcomeStep({ onNext, name }: WelcomeStepProps) {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Welcome to Aura, {name}!</h1>
      <p className="mt-4 text-lg text-gray-600">Let&apos;s get your account set up in a few quick steps.</p>
      <button
        onClick={onNext}
        className="mt-8 inline-flex items-center justify-center rounded-md bg-gray-900 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        Let&apos;s Get Started
      </button>
    </div>
  );
}