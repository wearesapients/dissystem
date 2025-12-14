/**
 * Middleware - Route Protection
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get('sapients_session')
  
  // Public paths
  const publicPaths = ['/login', '/api/auth/login']
  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }
  
  // API routes - let them handle their own auth
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Protected routes - redirect to login if no session
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)'],
}



