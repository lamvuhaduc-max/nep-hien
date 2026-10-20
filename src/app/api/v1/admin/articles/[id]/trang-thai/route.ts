import { NextRequest, NextResponse } from 'next/server';
import {
  doiTrangThaiBaiViet,
  layTacNhanTuRequest,
  LoiNghiepVu,
  TrangThaiBaiViet,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID bài viết không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const baiViet = await doiTrangThaiBaiViet(
      id,
      body.trangThai as TrangThaiBaiViet,
      tacNhan,
    );
    return NextResponse.json(baiViet);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/v1/admin/articles/[id]/trang-thai]', err);
    return NextResponse.json({ message: 'Không thể đổi trạng thái bài viết.' }, { status: 500 });
  }
}
