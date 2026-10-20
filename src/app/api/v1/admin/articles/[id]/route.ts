import { NextRequest, NextResponse } from 'next/server';
import {
  capNhatBaiViet,
  layChiTietBaiVietAdmin,
  layTacNhanTuRequest,
  LoiNghiepVu,
  xoaMemBaiViet,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID bài viết không hợp lệ.' }, { status: 400 });
    }
    const baiViet = await layChiTietBaiVietAdmin(id);
    return NextResponse.json(baiViet);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[GET /api/v1/admin/articles/[id]]', err);
    return NextResponse.json({ message: 'Lỗi máy chủ khi tải bài viết.' }, { status: 500 });
  }
}

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
    const ketQua = await capNhatBaiViet(
      id,
      {
        tieuDe: body.tieuDe,
        slug: body.slug,
        danhMucId: body.danhMucId !== undefined ? Number(body.danhMucId) : undefined,
        moTaNgan: body.moTaNgan,
        anhBia: body.anhBia,
        noiDungHtml: body.noiDungHtml,
        trangThai: body.trangThai,
        tacGia: body.tacGia,
        noiBat: body.noiBat,
      },
      tacNhan,
    );
    return NextResponse.json(ketQua);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[PATCH /api/v1/admin/articles/[id]]', err);
    return NextResponse.json({ message: 'Không thể cập nhật bài viết.' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID bài viết không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    await xoaMemBaiViet(id, tacNhan);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[DELETE /api/v1/admin/articles/[id]]', err);
    return NextResponse.json({ message: 'Không thể xóa bài viết.' }, { status: 500 });
  }
}
