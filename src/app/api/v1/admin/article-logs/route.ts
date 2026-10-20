import { NextRequest, NextResponse } from 'next/server';
import { layNhatKyBaiViet } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const nhom = sp.get('nhom') ?? undefined;
    const tuKhoa = sp.get('tuKhoa') ?? undefined;
    const gioiHan = sp.get('gioiHan') ? Number(sp.get('gioiHan')) : 60;

    const items = await layNhatKyBaiViet({ nhom, tuKhoa, gioiHan });
    return NextResponse.json(items);
  } catch (err) {
    console.error('[GET /api/v1/admin/article-logs]', err);
    return NextResponse.json({ message: 'Không thể tải nhật ký hoạt động.' }, { status: 500 });
  }
}
