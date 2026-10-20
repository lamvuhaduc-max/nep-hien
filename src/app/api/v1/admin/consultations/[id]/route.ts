import { NextRequest, NextResponse } from 'next/server';
import {
  capNhatYeuCauTuVanAdmin,
  layTacNhanTuRequest,
  LoiNghiepVu,
  TrangThaiYeuCauTuVan,
  xoaYeuCauTuVanAdmin,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    if (!tacNhan) {
      return NextResponse.json({ message: 'Chưa đăng nhập quản trị.' }, { status: 401 });
    }

    const { id } = await context.params;
    const idSo = Number(id);
    if (!Number.isFinite(idSo) || idSo <= 0) {
      return NextResponse.json({ message: 'ID yêu cầu tư vấn không hợp lệ.' }, { status: 400 });
    }

    const body = await req.json();
    const ketQua = await capNhatYeuCauTuVanAdmin(
      idSo,
      {
        trangThai: body.trangThai as TrangThaiYeuCauTuVan | undefined,
        ghiChuNoiBo: body.ghiChuNoiBo,
        nguoiPhuTrach: body.nguoiPhuTrach,
      },
      tacNhan,
    );

    return NextResponse.json(ketQua);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/v1/admin/consultations/[id]]', err);
    return NextResponse.json(
      { message: 'Không thể cập nhật yêu cầu tư vấn.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    if (!tacNhan) {
      return NextResponse.json({ message: 'Chưa đăng nhập quản trị.' }, { status: 401 });
    }

    const { id } = await context.params;
    const idSo = Number(id);
    if (!Number.isFinite(idSo) || idSo <= 0) {
      return NextResponse.json({ message: 'ID yêu cầu tư vấn không hợp lệ.' }, { status: 400 });
    }

    await xoaYeuCauTuVanAdmin(idSo, tacNhan);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[DELETE /api/v1/admin/consultations/[id]]', err);
    return NextResponse.json(
      { message: 'Không thể xóa yêu cầu tư vấn.' },
      { status: 500 },
    );
  }
}
