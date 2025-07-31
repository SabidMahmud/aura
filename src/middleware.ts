// middleware.ts
import { getToken } from 'next-auth/jwt';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!token;

  console.log('--- MIDDLEWARE RUNNING ---');
  console.log('Request Path:', pathname);
  
  if (token) {
    console.log('🔍 MIDDLEWARE TOKEN DEBUG:', {
      isOnboardingComplete: token.isOnboardingComplete,
      tokenId: token.id,
    });
  }

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

    // 🚨 CRITICAL FIX: Check for bypass cookie first with better handling
    const hasOnboardingBypass = req.cookies.get('onboarding-complete');
    console.log('🍪 Onboarding bypass cookie present:', !!hasOnboardingBypass);
    
    if (hasOnboardingBypass) {
      console.log('✅ Allowing access via onboarding bypass cookie');
      
      // If user is trying to access onboarding page with bypass cookie, redirect to dashboard
      if (pathname.startsWith('/onboarding')) {
        console.log('🔄 Redirecting from onboarding to dashboard (bypass cookie active)');
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      
      // Allow access to protected routes
      if (protectedRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
      }
    }

    // Special handling for dashboard access when token says onboarding incomplete
    if (!isOnboardingComplete && pathname === '/dashboard') {
      console.log('🔍 Token says onboarding incomplete, checking for bypass...');
      
      // If no bypass cookie, redirect to onboarding
      if (!hasOnboardingBypass) {
        console.log('🔄 No bypass cookie, redirecting to onboarding');
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
    }

    // Rule 2: If onboarding is not complete and no bypass, force user to the onboarding page
    if (!isOnboardingComplete && !hasOnboardingBypass && !pathname.startsWith('/onboarding')) {
      console.log('🔄 Redirecting to onboarding (incomplete + no bypass)');
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    // Rule 3: If onboarding IS complete, prevent them from accessing the onboarding page again
    if (isOnboardingComplete && pathname.startsWith('/onboarding')) {
      console.log('🔄 Redirecting to dashboard (onboarding complete)');
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  // --- LOGIC FOR UNAUTHENTICATED USERS ---
  if (!isAuthenticated) {
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtectedRoute || pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};