import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Lấy token từ Cookie (do js-cookie lưu ở bước trước)
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  /**
   * LUỒNG 1: Nếu người dùng đã đăng nhập (có token) 
   * mà vẫn cố tình vào trang /login -> Đẩy họ về Dashboard.
   */
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  /**
   * LUỒNG 2: Nếu người dùng CHƯA đăng nhập (không có token)
   * mà cố truy cập vào các trang yêu cầu bảo mật -> Đẩy về trang Login.
   */
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    // Lưu lại trang họ định vào để sau khi login xong có thể quay lại (Optional)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Cấu hình các đường dẫn mà Middleware sẽ quét qua
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/login'
  ],
}