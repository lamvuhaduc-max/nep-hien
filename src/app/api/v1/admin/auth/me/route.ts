import { NextRequest, NextResponse } from 'next/server';
import {
  doiMatKhauCaNhan,
  layTacNhanTuRequest,
  LoiNghiepVu,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const tacNhan = await layTacNhanTuRequest(req);
  if (!tacNhan) {
    return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
  }
  return NextResponse.json(tacNhan);
}

export async function PATCH(req: NextRequest) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    if (!tacNhan) {
      return NextResponse.json({ message: 'Chưa đăng nhập.' }, { status: 401 });
    }
    const body = await req.json();
    await doiMatKhauCaNhan(
      tacNhan,
      String(body.matKhauHienTai ?? ''),
      String(body.matKhauMoi ?? ''),
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: 'Không thể đổi mật khẩu.' }, { status: 500 });
  }
}
