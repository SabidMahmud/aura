// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;

  // Define your auth routes and protected routes
  const authRoutes = ['/login', '/signup', '/register'];
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];

  // --- LOGIC FOR AUTHENTICATED USERS ---
  if (isAuthenticated) {
    // Rule 1: If logged in, redirect from auth pages to the dashboard.
    if (authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    const isOnboardingComplete = token.isOnboardingComplete as boolean;

    // Rule 2: If onboarding is not complete, force user to the onboarding page.
    // (but don't redirect if they are already there).
    if (!isOnboardingComplete && !pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // Rule 3: If onboarding IS complete, prevent them from accessing the onboarding page again.
    if (isOnboardingComplete && pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If all checks pass, allow the request.
    return NextResponse.next();
  }

  // --- LOGIC FOR UNAUTHENTICATED USERS ---
  if (!isAuthenticated) {
    // If an unauthenticated user tries to access a protected route OR the onboarding page,
    // redirect them to the login page.
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtectedRoute || pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow the request to proceed for all other cases (e.g., public homepage).
  return NextResponse.next();
}

// --- CONFIG ---
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};