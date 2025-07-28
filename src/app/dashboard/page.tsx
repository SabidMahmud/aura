'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Calendar, User, TrendingUp, Activity, Brain, Utensils, Moon, BarChart3 } from 'lucide-react';
import Navbar from '@/components/ui/NavBar';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [ratings, setRatings] = useState({
    mood: 4,
    productivity: 3,
    energy: 2
  });

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const RatingBar = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`w-8 h-2 rounded-full transition-colors ${
                rating <= value ? 'bg-gray-800' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 w-8">{value}/5</span>
      </div>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good afternoon, {session?.user?.name || 'Amelia'}
          </h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>

        {/* Quick Log Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Log</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Productivity</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Activity className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Exercise</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Social</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Brain className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Mindfulness</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Utensils className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Nutrition</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Moon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">Sleep</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Journal */}
          <div className="relative bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl p-6 min-h-[200px] overflow-hidden">
            <div className="absolute right-4 top-4 opacity-20">
              <div className="w-32 h-32 border-2 border-orange-300 rounded-full"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Journal</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Write about your day. The AI will find the pattern
              </button>
            </div>
          </div>

          {/* Evening Review */}
          <div className="relative bg-gradient-to-r from-green-100 to-green-200 rounded-2xl p-6 min-h-[200px] overflow-hidden">
            <div className="absolute right-4 top-4 opacity-20">
              <div className="w-24 h-32 bg-green-300 rounded-full transform rotate-12"></div>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Evening Review</h3>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                How was your day from 1 to 5
              </button>
            </div>
          </div>
        </div>

        {/* Save & Log Button */}
        <div className="flex justify-end mb-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Save & Log via AI
          </button>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="space-y-2 mb-6">
            <RatingBar 
              label="Mood" 
              value={ratings.mood} 
              onChange={(val) => handleRatingChange('mood', val)} 
            />
            <RatingBar 
              label="Productivity" 
              value={ratings.productivity} 
              onChange={(val) => handleRatingChange('productivity', val)} 
            />
            <RatingBar 
              label="Energy" 
              value={ratings.energy} 
              onChange={(val) => handleRatingChange('energy', val)} 
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Save Ratings
            </button>
          </div>
        </div>

        {/* Today's Log */}
        <div className="relative bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-6 min-h-[200px] overflow-hidden">
          <div className="absolute right-4 top-4 opacity-20">
            <div className="w-20 h-20">
              <div className="w-full h-full border-4 border-amber-300 rounded-full"></div>
              <div className="absolute inset-2 border-2 border-amber-300 rounded-full"></div>
              <div className="absolute inset-4 border border-amber-300 rounded-full"></div>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Today&apos;s Log</h3>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block text-sm">
              1:45 PM - Ate Healthy (from journal)
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-12">
          © 2025 Aura. All rights reserved.
        </div>
      </div>
    </div>
  );
}