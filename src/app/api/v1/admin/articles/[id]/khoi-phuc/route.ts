import { NextRequest, NextResponse } from 'next/server';
import {
  khoiPhucBaiViet,
  layTacNhanTuRequest,
  LoiNghiepVu,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  context: { params: { id: string } },
) {
  try {
    const id = Number(context.params.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ message: 'ID bài viết không hợp lệ.' }, { status: 400 });
    }
    const tacNhan = await layTacNhanTuRequest(req);
    const baiViet = await khoiPhucBaiViet(id, tacNhan);
    return NextResponse.json(baiViet);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/admin/articles/[id]/khoi-phuc]', err);
    return NextResponse.json({ message: 'Không thể khôi phục bài viết.' }, { status: 500 });
  }
}
