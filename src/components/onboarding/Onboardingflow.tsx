// 'use client';
import { useState } from 'react';
import { ChevronRight, Plus, X } from 'lucide-react';

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMetrics, setSelectedMetrics] = useState(['Mood', 'Energy']);
  const [selectedTags, setSelectedTags] = useState(['💪 Workout', '📖 Read', 'Ate Healthy', '☀️ Morning Sunlight']);
  const [customMetric, setCustomMetric] = useState('');
  const [customTag, setCustomTag] = useState('');

  const defaultMetrics = ['Mood', 'Energy', 'Focus', 'Sleep Quality', 'Productivity', 'Stress Level'];
  const defaultTags = ['💪 Workout', '📖 Read', 'Ate Healthy', '☀️ Morning Sunlight', '🧘 Meditation', '☕ Coffee', '🚶 Walk', '💻 Work'];

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomMetric = () => {
    if (customMetric.trim() && !selectedMetrics.includes(customMetric.trim())) {
      setSelectedMetrics(prev => [...prev, customMetric.trim()]);
      setCustomMetric('');
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const removeMetric = (metric: string) => {
    setSelectedMetrics(prev => prev.filter(m => m !== metric));
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const finishOnboarding = () => {
    // Handle onboarding completion
    console.log('Onboarding completed with:', { selectedMetrics, selectedTags });
    // Redirect to dashboard or main app
  };

  const ProgressBar = ({ step }: { step: number }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Step {step} of 2</span>
        {step === 1 && <span className="text-sm text-gray-500">50%</span>}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
          style={{ width: step === 1 ? '50%' : '100%' }}
        />
      </div>
    </div>
  );

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center mr-3">
              <div className="w-4 h-4 border-2 border-white border-l-0 border-b-0 transform rotate-45"></div>
            </div>
            <span className="text-xl font-semibold text-gray-900">Aura</span>
          </div>

          <ProgressBar step={1} />

          {/* Hero Image */}
          <div className="relative bg-gradient-to-br from-pink-100 via-blue-50 to-green-100 rounded-2xl p-8 mb-8 min-h-[300px] overflow-hidden">
            {/* Abstract mountain shapes */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 400 200" className="w-full h-full">
                <path d="M0,200 L0,120 Q100,80 200,100 Q300,120 400,90 L400,200 Z" fill="#10B981" opacity="0.6"/>
                <path d="M0,200 L0,140 Q150,100 250,110 Q350,120 400,100 L400,200 Z" fill="#F59E0B" opacity="0.4"/>
                <path d="M0,200 L0,160 Q200,130 400,140 L400,200 Z" fill="#EF4444" opacity="0.3"/>
              </svg>
            </div>
            {/* Wooden frame effect */}
            <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-amber-800 to-amber-600 rounded-l-2xl"></div>
            <div className="absolute right-0 top-0 w-4 h-full bg-gradient-to-l from-amber-800 to-amber-600 rounded-r-2xl"></div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Mood, Energy, Focus"
                value={customMetric}
                onChange={(e) => setCustomMetric(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomMetric()}
                className="w-full p-4 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addCustomMetric}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-blue-600 transition-colors"
              >
                Add Metric
              </button>
            </div>
          </div>

          {/* Selected Metrics */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {selectedMetrics.map((metric) => (
                <span
                  key={metric}
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                >
                  {metric}
                  <button
                    onClick={() => removeMetric(metric)}
                    className="ml-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Available Metrics */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {defaultMetrics.filter(metric => !selectedMetrics.includes(metric)).map((metric) => (
                <button
                  key={metric}
                  onClick={() => toggleMetric(metric)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Next <ChevronRight size={20} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center mr-3">
            <div className="w-4 h-4 border-2 border-white border-l-0 border-b-0 transform rotate-45"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">Aura</span>
        </div>

        <ProgressBar step={2} />

        {/* Hero Image */}
        <div className="relative bg-gradient-to-br from-orange-100 via-amber-50 to-green-100 rounded-2xl p-8 mb-8 min-h-[300px] overflow-hidden">
          {/* Plant silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Shirt/torso shape */}
              <div className="w-32 h-40 bg-green-800 rounded-t-full mx-auto relative">
                {/* Leaves */}
                <div className="absolute -top-4 left-4 w-12 h-8 bg-green-700 rounded-full transform -rotate-45"></div>
                <div className="absolute -top-2 right-6 w-10 h-6 bg-orange-400 rounded-full transform rotate-30"></div>
                <div className="absolute top-8 -left-2 w-14 h-10 bg-green-600 rounded-full transform -rotate-30"></div>
                <div className="absolute top-6 -right-3 w-12 h-8 bg-orange-500 rounded-full transform rotate-45"></div>
                <div className="absolute top-16 left-2 w-10 h-6 bg-green-500 rounded-full transform -rotate-60"></div>
                <div className="absolute top-14 right-0 w-11 h-7 bg-orange-300 rounded-full transform rotate-60"></div>
              </div>
              {/* Sun */}
              <div className="absolute -top-8 right-8 w-16 h-16 bg-orange-400 rounded-full opacity-80"></div>
              <div className="absolute -top-12 right-4 w-12 h-12 bg-orange-300 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g., Workout, Read a Book, Drank Coffee"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
              className="w-full p-4 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addCustomTag}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-blue-600 transition-colors"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Selected Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Available Tags */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {defaultTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Finish Button */}
        <div className="flex justify-end">
          <button
            onClick={finishOnboarding}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Finish Setup & Enter App
          </button>
        </div>
      </div>
    </div>
  );
}