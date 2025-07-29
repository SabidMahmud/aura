// components/onboarding/GoalsStep.tsx
'use client';

import { useState } from 'react';

interface GoalsStepProps {
  onNext: (data: { goal: string }) => void;
}

export default function GoalsStep({ onNext }: GoalsStepProps) {
  const [goal, setGoal] = useState('');
  const goals = ['Productivity', 'Health & Fitness', 'Personal Growth', 'Work/Career'];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">What's your primary goal?</h2>
      <p className="mt-2 text-gray-500">This will help us personalize your experience.</p>
      <div className="mt-6 space-y-4">
        {goals.map((g) => (
          <label
            key={g}
            className={`flex cursor-pointer items-center rounded-lg border p-4 transition-all ${
              goal === g ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="goal"
              value={g}
              checked={goal === g}
              onChange={() => setGoal(g)}
              className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <span className="ml-3 font-medium text-gray-800">{g}</span>
          </label>
        ))}
      </div>
      <button
        onClick={() => onNext({ goal })}
        disabled={!goal}
        className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-8 py-3 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue
      </button>
    </div>
  );
}