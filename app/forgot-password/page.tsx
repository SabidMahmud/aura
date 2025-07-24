
import Link from 'next/link';

// A simple placeholder for the Aura logo
const AuraLogo = () => (
    <div className="font-bold text-2xl tracking-tighter">A</div>
);

export default function ForgotPasswordPage() {
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Forgot Password?</h1>
            <p className="mt-2 text-gray-500">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form className="space-y-6">
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
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 text-gray-900 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900 sm:text-sm"
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
              >
                Send Reset Link
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            <Link href="/login" className="font-semibold text-gray-800 hover:text-gray-900">
              &larr; Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
