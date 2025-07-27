// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                      req.nextUrl.pathname.startsWith('/signup');
    const isOnboardingPage = req.nextUrl.pathname.startsWith('/onboarding');
    const isPublicPage = req.nextUrl.pathname === '/' || 
                        req.nextUrl.pathname.startsWith('/public') ||
                        req.nextUrl.pathname.startsWith('/api/auth');

    // Allow public pages and API routes
    if (isPublicPage) {
      return NextResponse.next();
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      // Check if onboarding is complete
      if (!token?.isOnboardingComplete) {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    // Redirect unauthenticated users to login
    if (!isAuth && !isAuthPage) {
      const loginUrl = new URL('/login', req.url);
      // Add callback URL for redirect after login
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Handle onboarding flow for authenticated users
    if (isAuth && !isOnboardingPage) {
      // If user is authenticated but hasn't completed onboarding
      if (!token?.isOnboardingComplete && req.nextUrl.pathname !== '/onboarding') {
        return NextResponse.redirect(new URL('/onboarding', req.url));
      }
      
      // If user has completed onboarding but tries to access onboarding page
      if (token?.isOnboardingComplete && req.nextUrl.pathname === '/onboarding') {
        return NextResponse.redirect(new URL('/profile', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes without authentication
        const isPublicRoute = req.nextUrl.pathname === '/' || 
                             req.nextUrl.pathname.startsWith('/public') ||
                             req.nextUrl.pathname.startsWith('/api/auth') ||
                             req.nextUrl.pathname.startsWith('/login') ||
                             req.nextUrl.pathname.startsWith('/signup');
        
        if (isPublicRoute) return true;
        
        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};