import { NextRequest, NextResponse } from 'next/server';
import { VaiTroQuanTri } from '@/lib/auth-admin';
import {
  layDanhSachTaiKhoanQuanTri,
  layTacNhanTuRequest,
  LoiNghiepVu,
  taoTaiKhoanQuanTri,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ds = await layDanhSachTaiKhoanQuanTri();
    return NextResponse.json(ds);
  } catch (err) {
    console.error('[GET /api/v1/admin/accounts]', err);
    return NextResponse.json({ message: 'Không thể tải danh sách tài khoản.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const moi = await taoTaiKhoanQuanTri(
      {
        taiKhoan: body.taiKhoan,
        hoTen: body.hoTen,
        matKhau: body.matKhau,
        vaiTro: (body.vaiTro as VaiTroQuanTri) || 'admin',
        kichHoat: body.kichHoat !== undefined ? Boolean(body.kichHoat) : true,
      },
      tacNhan,
    );
    return NextResponse.json(moi, { status: 201 });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/admin/accounts]', err);
    return NextResponse.json({ message: 'Không thể tạo tài khoản mới.' }, { status: 500 });
  }
}
