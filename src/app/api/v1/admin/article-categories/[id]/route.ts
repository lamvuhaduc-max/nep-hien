import { NextRequest, NextResponse } from 'next/server';
import {
  capNhatDanhMuc,
  layTacNhanTuRequest,
  LoiNghiepVu,
  xoaDanhMuc,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID danh mục không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const dm = await capNhatDanhMuc(
      id,
      {
        ten: body.ten,
        slug: body.slug,
        moTa: body.moTa,
        thuTu: body.thuTu !== undefined ? Number(body.thuTu) : undefined,
        hien: body.hien !== undefined ? Boolean(body.hien) : undefined,
      },
      tacNhan,
    );
    return NextResponse.json(dm);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/v1/admin/article-categories/[id]]', err);
    return NextResponse.json({ message: 'Không thể cập nhật danh mục.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID danh mục không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    await xoaDanhMuc(id, tacNhan);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[DELETE /api/v1/admin/article-categories/[id]]', err);
    return NextResponse.json({ message: 'Không thể xóa danh mục.' }, { status: 500 });
  }
}
