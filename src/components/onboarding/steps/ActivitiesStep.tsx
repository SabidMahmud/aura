// components/onboarding/steps/ActivitiesStep.tsx
'use client';

import { useState } from 'react';

// Define the props to match our onboarding page's state management
interface ActivitiesStepProps {
  onFinish: (data: { activities: string[] }) => void;
  prevStep: () => void;
  isLoading: boolean;
}

const SUGGESTED_ACTIVITIES = [
  // ... (keeping your list of activities as it is excellent)
  { name: 'Morning workout', category: 'Fitness', icon: '💪' },
  { name: 'Yoga session', category: 'Fitness', icon: '🧘' },
  { name: 'Read a book', category: 'Learning', icon: '📚' },
  { name: 'Practice coding', category: 'Learning', icon: '👨‍💻' },
  { name: 'Daily planning', category: 'Productivity', icon: '📅' },
  { name: 'Focus work session', category: 'Productivity', icon: '🎯' },
  { name: 'Cook a meal', category: 'Lifestyle', icon: '👨‍🍳' },
  { name: 'Listen to music', category: 'Recreation', icon: '🎵' },
  { name: 'Social time', category: 'Social', icon: '👫' },
  { name: 'Skincare routine', category: 'Self-care', icon: '🧴' },
  { name: 'Drink water', category: 'Health', icon: '💧' },
];

const CATEGORIES = [
  'All', 'Fitness', 'Wellness', 'Learning', 'Productivity',
  'Lifestyle', 'Recreation', 'Social', 'Self-care', 'Health'
];

export default function ActivitiesStep({ onFinish, prevStep, isLoading }: ActivitiesStepProps) {
  const [activities, setActivities] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleActivity = (activityName: string) => {
    setActivities(prev => 
      prev.includes(activityName) 
        ? prev.filter(a => a !== activityName)
        : [...prev, activityName]
    );
  };

  const addCustomActivity = () => {
    const trimmedActivity = customActivity.trim();
    if (trimmedActivity && !activities.includes(trimmedActivity)) {
      setActivities(prev => [...prev, trimmedActivity]);
      setCustomActivity('');
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const removeActivity = (activity: string) => {
    setActivities(prev => prev.filter(a => a !== activity));
  };

  const filteredActivities = selectedCategory === 'All' 
    ? SUGGESTED_ACTIVITIES 
    : SUGGESTED_ACTIVITIES.filter(activity => activity.category === selectedCategory);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What Activities Do You Want to Track?</h2>
        <p className="text-gray-600">
          Choose the daily activities you&apos;d like to track. These will help you build better habits.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {filteredActivities.map((activity) => (
          <button
            key={activity.name}
            onClick={() => toggleActivity(activity.name)}
            className={`p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
              activities.includes(activity.name)
                ? 'bg-green-50 border-green-300 text-green-900'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{activity.icon}</span>
              <div>
                <div className="font-medium">{activity.name}</div>
              </div>
            </div>
            {activities.includes(activity.name) && (
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            )}
          </button>
        ))}
      </div>

      {/* Custom Activity Input */}
      <div className="border-t pt-6">
        <h4 className="font-medium text-gray-900 mb-3">Add a Custom Activity</h4>
        <div className="flex space-x-3">
          <input
            type="text"
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomActivity()}
            placeholder="E.g., Water plants"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addCustomActivity}
            disabled={!customActivity.trim()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={prevStep}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={() => onFinish({ activities })}
          disabled={isLoading || activities.length === 0}
          className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50"
        >
          {isLoading ? 'Completing...' : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
}