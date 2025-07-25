'use client';

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/lib/actions/user';

// A simple placeholder for the Google icon
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// A simple placeholder for the Aura logo
const AuraLogo = () => (
    <div className="font-bold text-2xl tracking-tighter">AURA</div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    console.log('handleSubmit called');
    setError(null);
    setLoading(true);
    console.log('Loading state set to true');

    const result = await loginUser(formData);

    if (result.success) {
      console.log('Login successful, redirecting...');
      // Add a small delay to allow the spinner to render
      setTimeout(() => {
        window.location.href = '/';
      }, 300); // 300ms delay
    } else {
      console.log('Login failed:', result.message);
      setError(result.message || 'Something went wrong');
      setLoading(false); // Only set loading to false if login fails
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left Panel */}
      <div className="hidden bg-gray-900 p-10 text-white lg:flex lg:flex-col">
        <div className="flex-shrink-0">
            <AuraLogo />
        </div>
        <div className="my-auto">
            <h1 className="text-4xl font-bold tracking-tighter">Aura</h1>
            <p className="mt-4 text-lg text-gray-300">
            "The best way to predict the future is to create it."
            </p>
        </div>
        <div className="flex-shrink-0 mt-auto">
            <p className="text-sm text-gray-400">© 2025 Aura Inc.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex items-center justify-center bg-white p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Login</h1>
            <p className="mt-2 text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="space-y-6" action={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>
                    <Link href="/forgot-password" className="text-sm font-medium text-gray-800 hover:text-gray-900">
                        Forgot password?
                    </Link>
                </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-800 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
              />
            </div>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  'Log in'
                )}
              </button>
            </div>

            <div>
              <button
                type="button"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <GoogleIcon />
                <span className="ml-2">Sign in with Google</span>
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-gray-800 hover:text-gray-900">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}