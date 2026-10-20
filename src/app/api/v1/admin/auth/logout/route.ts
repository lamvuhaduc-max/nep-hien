import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_ADMIN } from '@/lib/auth-admin';
import { ghiNhatKy, layTacNhanTuRequest } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const tacNhan = await layTacNhanTuRequest(req);
  if (tacNhan) {
    await ghiNhatKy(
      'he_thong.dang_xuat',
      tacNhan.id,
      { taiKhoan: tacNhan.taiKhoan, vaiTro: tacNhan.vaiTro },
      tacNhan,
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_ADMIN, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
