import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/privacy-policy',
    '/terms-of-service',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google',
    '/api/auth/firebase-login',
  ];

  // Public asset paths
  const publicAssets = [
    '/taralogo.jpg',
    '/celebrities/',
    '/_next/',
    '/favicon.ico',
    '/static/',
  ];

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));
  const isPublicAsset = publicAssets.some(asset => pathname.startsWith(asset));

  // Allow public routes and static files
  if (isPublicRoute || isPublicAsset || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for auth token
  const token = request.cookies.get('authToken')?.value;

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
