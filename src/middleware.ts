import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ADMIN, xacThucTokenPhienAdmin } from '@/lib/auth-admin';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Bỏ qua trang đăng nhập và API đăng nhập/đăng xuất
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/v1/admin/auth/')
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_ADMIN)?.value;
  const ketQua = await xacThucTokenPhienAdmin(token);

  if (!ketQua.hopLe) {
    if (pathname.startsWith('/api/v1/admin/')) {
      return NextResponse.json(
        { message: 'Vui lòng đăng nhập tài khoản quản trị để thực hiện thao tác này.' },
        { status: 401 },
      );
    }

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/v1/admin/:path*'],
};
