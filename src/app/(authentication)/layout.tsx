// app/(auth)/layout.tsx
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const metadata: Metadata = {
  title: 'Aura - Authentication',
  description: 'Sign in or create your Aura account',
};

// Aura logo component
const AuraLogo = () => (
  <div className="font-bold text-2xl tracking-tighter">AURA</div>
);

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  // Check if user is already authenticated
  const session = await getServerSession(authOptions);
  
  if (session) {
    // If user is authenticated but hasn't completed onboarding
    if (!session.user.isOnboardingComplete) {
      redirect('/onboarding');
    } else {
      // If user is fully authenticated, redirect to profile
      redirect('/profile');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative grid min-h-screen w-full lg:grid-cols-2">
        {/* Left Panel - Hidden on mobile, visible on lg+ */}
        <div className="hidden bg-gray-900 p-10 text-white lg:flex lg:flex-col">
          {/* Logo */}
          <div className="flex-shrink-0">
            <AuraLogo />
          </div>

          {/* Center Content */}
          <div className="my-auto space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter">
                Welcome to Aura
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                &quot;The best way to predict the future is to create it.&quot;
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4 pt-8">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <p className="text-sm text-gray-300">
                  Secure authentication with Google integration
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <p className="text-sm text-gray-300">
                  Personalized user experience
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-purple-400" />
                <p className="text-sm text-gray-300">
                  Advanced privacy controls
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 mt-auto">
            <p className="text-sm text-gray-400">
              © 2025 Aura Inc. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Panel - Main content area */}
        <div className="flex items-center justify-center bg-white p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Mobile logo - only shown on small screens */}
            <div className="mb-8 text-center lg:hidden">
              <AuraLogo />
            </div>
            
            {/* Main content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}