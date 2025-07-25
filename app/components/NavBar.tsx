// Location: app/components/Navbar.tsx

"use client"; // This is the most important line!

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import GetStartedButton from './GetStartedButton';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">AURA</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
        </div>

        {/* Desktop Get Started Button */}
        <div className="hidden md:block">
          <GetStartedButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Get Started
          </GetStartedButton>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        //   onTouchEnd={toggleMobileMenu} // Add this for touch devices
            aria-label="Toggle mobile menu"
            type="button"
          >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4 pt-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            <div className="mt-4">
              <GetStartedButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors w-full">
                Get Started
              </GetStartedButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}