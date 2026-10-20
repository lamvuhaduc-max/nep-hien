import { NextRequest, NextResponse } from 'next/server';
import { layChiTietBaiVietCongKhai } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: { slug: string } },
) {
  try {
    const ketQua = await layChiTietBaiVietCongKhai(context.params.slug);
    if (!ketQua) {
      return NextResponse.json({ message: 'Không tìm thấy bài viết.' }, { status: 404 });
    }
    return NextResponse.json(ketQua);
  } catch (err) {
    console.error('[GET /api/v1/storefront/articles/[slug]]', err);
    return NextResponse.json({ message: 'Không thể tải bài viết.' }, { status: 500 });
  }
}
