import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ADMIN, taoTokenPhienAdmin } from '@/lib/auth-admin';
import {
  LoiNghiepVu,
  xacThucDangNhapQuanTri,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tk = await xacThucDangNhapQuanTri(
      String(body.taiKhoan ?? ''),
      String(body.matKhau ?? ''),
    );

    const token = await taoTokenPhienAdmin({
      id: tk.id,
      taiKhoan: tk.taiKhoan,
      hoTen: tk.hoTen,
      vaiTro: tk.vaiTro,
    });

    const res = NextResponse.json({
      ok: true,
      nguoiDung: tk,
    });

    res.cookies.set(COOKIE_ADMIN, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/admin/auth/login]', err);
    return NextResponse.json(
      { message: 'Lỗi xử lý đăng nhập quản trị.' },
      { status: 500 },
    );
  }
}
