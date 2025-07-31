'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Activity, Brain, Utensils, Moon, BarChart3 } from 'lucide-react';
import Navbar from '@/components/ui/NavBar';

export default function ProfilePage() {
  const { data: session, status, update } = useSession(); // Added 'update' here
  const router = useRouter();
  const searchParams = useSearchParams(); // Added this
  const [showWelcome, setShowWelcome] = useState(false); // Added this
  const [isUpdatingSession, setIsUpdatingSession] = useState(false); // Added this
  const [ratings, setRatings] = useState({
    mood: 4,
    productivity: 3,
    energy: 2
  });

  // Protect the route - redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (status === 'unauthenticated' || !session) {
      router.push('/login'); // Redirect to login page
      return;
    }
  }, [session, status, router]);

  // ADD BACK: Onboarding completion handling
  useEffect(() => {
    const handleOnboardingComplete = async () => {
      const onboardingParam = searchParams.get('onboarding');
      const verifyParam = searchParams.get('verify');
      
      if (onboardingParam === 'complete') {
        console.log('🎉 Onboarding completion detected!');
        setShowWelcome(true);
        
        // Clean up the bypass cookie since we're now on the dashboard
        document.cookie = 'onboarding-complete=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        console.log('🧹 Cleaned up bypass cookie');
        
        // Update the session to ensure JWT has latest data
        if (!session?.user?.isOnboardingComplete) {
          console.log('🔄 Session still shows incomplete, forcing update...');
          setIsUpdatingSession(true);
          try {
            await update();
            console.log('✅ Session updated after onboarding');
          } catch (error) {
            console.error('❌ Failed to update session:', error);
          } finally {
            setIsUpdatingSession(false);
          }
        }
        
        // Clean up URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('onboarding');
        url.searchParams.delete('verify');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
      
      if (verifyParam === 'true') {
        console.log('🔍 Dashboard verification mode');
        const url = new URL(window.location.href);
        url.searchParams.delete('verify');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    };

    if (status === 'authenticated') {
      handleOnboardingComplete();
    }
  }, [searchParams, session, status, update]);

  // ADD BACK: Additional effect to handle session refresh when there's a mismatch
  useEffect(() => {
    const refreshSessionIfNeeded = async () => {
      if (session?.user && 
          !session.user.isOnboardingComplete && 
          !searchParams.get('onboarding') && 
          !isUpdatingSession) {
        
        console.log('🔍 Detected session mismatch - user on dashboard but session shows incomplete');
        
        try {
          const response = await fetch('/api/user/onboarding-status');
          const data = await response.json();
          
          if (data.success && data.isOnboardingComplete) {
            console.log('📊 Database confirms onboarding is complete, refreshing session...');
            setIsUpdatingSession(true);
            await update();
            console.log('✅ Session refreshed successfully');
          }
        } catch (error) {
          console.error('❌ Failed to verify onboarding status:', error);
        } finally {
          setIsUpdatingSession(false);
        }
      }
    };

    const timer = setTimeout(() => {
      if (status === 'authenticated') {
        refreshSessionIfNeeded();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, status, searchParams, update, isUpdatingSession]);

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

  // Show loading while checking authentication OR updating session
  if (status === "loading" || isUpdatingSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isUpdatingSession ? 'Updating your session...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ADD BACK: Welcome message */}
      {showWelcome && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                🎉 Welcome to Aura! Your onboarding is complete and your account is all set up.
              </p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setShowWelcome(false)}
                className="text-green-400 hover:text-green-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar/>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good afternoon, {session?.user?.name || session?.user?.email || 'User'}
          </h1>
          <p className="text-gray-600">{currentDate}</p>
          {/* ADD BACK: Debug info for development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <strong>Debug:</strong> Onboarding Status: {session?.user?.isOnboardingComplete ? '✅ Complete' : '⏳ Pending'}
            </div>
          )}
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