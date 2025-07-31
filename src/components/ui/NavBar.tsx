"use client"; // This is the most important line!

import React, { useState } from 'react';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import GetStartedButton from './GetStartedButton';
import Image from 'next/image';
import Link from 'next/link';


export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isLoggedIn = status === 'authenticated';
  const isLoading = status === 'loading';

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    signOut({callbackUrl: '/login'});
  };

  // Show loading state while session is being fetched
  if (isLoading) {
    return (
      <nav className="bg-white px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">AURA</div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">AURA</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            {isLoggedIn ? 'Dashboard' : 'Home'}
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
          {isLoggedIn && (
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">My Account</a>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="User menu"
              >
                {session?.user?.image ? (
                  // <img
                  //   src={session.user.image}
                  //   alt="Profile"
                  //   className="w-8 h-8 rounded-full"
                  // />
                  <Image src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full">

                  </Image>
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium">
                  {session?.user?.name || session?.user?.email || 'User'}
                </span>
              </button>
              
              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      {session?.user?.email}
                    </div>
                    <Link href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <GetStartedButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
              Get Started
            </GetStartedButton>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              {isLoggedIn ? 'Dashboard' : 'Home'}
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Support</a>
            {isLoggedIn && (
              <Link href="/(profile-details)/profile" className="text-gray-600 hover:text-gray-900 transition-colors">My Account</Link>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-700">
                    {session?.user?.image ? (
                      <Link href="/profile">
                      <Image src={session.user.image}
                        alt="Profile"
                        className="w-6 h-6 rounded-full">

                      </Image>
                      </Link>
                    ) : (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-medium">
                    <Link href="/profile">
                      {session?.user?.name || session?.user?.email || 'User'}
                    </Link>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <GetStartedButton className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors w-full">
                  Get Started
                </GetStartedButton>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
}