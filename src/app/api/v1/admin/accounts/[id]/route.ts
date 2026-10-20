import { NextRequest, NextResponse } from 'next/server';
import { VaiTroQuanTri } from '@/lib/auth-admin';
import {
  capNhatTaiKhoanQuanTri,
  layTacNhanTuRequest,
  LoiNghiepVu,
  xoaTaiKhoanQuanTri,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID tài khoản không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const capNhat = await capNhatTaiKhoanQuanTri(
      id,
      {
        hoTen: body.hoTen,
        vaiTro: body.vaiTro as VaiTroQuanTri | undefined,
        kichHoat: body.kichHoat,
        matKhauMoi: body.matKhauMoi,
      },
      tacNhan,
    );
    return NextResponse.json(capNhat);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/v1/admin/accounts/[id]]', err);
    return NextResponse.json({ message: 'Không thể cập nhật tài khoản.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID tài khoản không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    await xoaTaiKhoanQuanTri(id, tacNhan);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[DELETE /api/v1/admin/accounts/[id]]', err);
    return NextResponse.json({ message: 'Không thể xóa tài khoản.' }, { status: 500 });
  }
}
