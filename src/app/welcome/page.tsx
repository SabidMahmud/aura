import React from 'react';
import { Search, TrendingUp, Target, Menu, X } from 'lucide-react';
import GetStartedButton from '@/components/ui/GetStartedButton';
import Navbar from '@/components/ui/NavBar';

export default function AuraLandingPage() {
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar/>

      {/* Hero Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-gray-900 bg-cover bg-center min-h-[500px] flex items-center justify-center rounded-2xl"
            style={{
              backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/landing-bg.png')"
            }}
          >
            <div className="max-w-4xl mx-auto text-center px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Unlock Your Potential with Personal Pattern Analysis
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Gain deep insights into your habits, behaviors, and thought patterns to foster personal growth and achieve your goals.
              </p>
              
              {/* Hero Get Started Button */}
              <GetStartedButton className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                Get Started
              </GetStartedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Explore the powerful tools that make Personal Pattern Analysis your ultimate companion for self discovery and growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* In-Depth Analysis */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">In-Depth Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Uncover hidden patterns in your daily life with our advanced analytical tools.
              </p>
            </div>

            {/* Progress Tracking */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your progress over time and celebrate your achievements.
              </p>
            </div>

            {/* Personalized Insights */}
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personalized Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive tailored recommendations and insights to help you reach your full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a>
            </div>
            <p className="text-gray-500">© 2025 Aura. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}