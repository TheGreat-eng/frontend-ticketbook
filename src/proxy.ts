// File: src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ĐỔI TÊN HÀM TỪ middleware -> proxy
export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/login'
  ],
}