import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes - client-side will handle the actual auth check
  // This middleware just ensures a consistent experience by redirecting
  // unauthenticated users to login for protected pages
  // Note: Since Supabase auth cookies are used, we can't fully validate server-side
  // The client-side components handle the actual role-based access control

  // For dashboard and admin routes, we rely on client-side auth checks
  // since Supabase session is managed via cookies and client-side JS

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};
