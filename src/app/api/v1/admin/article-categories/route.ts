import { NextRequest, NextResponse } from 'next/server';
import {
  layDanhSachDanhMucAdmin,
  layTacNhanTuRequest,
  LoiNghiepVu,
  taoDanhMuc,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const danhMuc = await layDanhSachDanhMucAdmin();
    return NextResponse.json(danhMuc);
  } catch (err) {
    console.error('[GET /api/v1/admin/article-categories]', err);
    return NextResponse.json({ message: 'Không thể tải danh mục bài viết.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const dm = await taoDanhMuc(
      {
        ten: body.ten,
        slug: body.slug,
        moTa: body.moTa,
        thuTu: body.thuTu !== undefined ? Number(body.thuTu) : 0,
        hien: body.hien !== undefined ? Boolean(body.hien) : true,
      },
      tacNhan,
    );
    return NextResponse.json(dm, { status: 201 });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/admin/article-categories]', err);
    return NextResponse.json({ message: 'Không thể tạo danh mục mới.' }, { status: 500 });
  }
}
