import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/auth-utils';

export function middleware(request: NextRequest) {
  const session = getSession();
  const pathname = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/', '/api/auth/login', '/api/auth/register'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(path));
  
  // If path requires authentication and user is not logged in, redirect to login
  if (!isPublicPath && !session) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // If user is logged in and trying to access login/register, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
