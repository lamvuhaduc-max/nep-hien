import { NextRequest, NextResponse } from 'next/server';
import { layDanhSachBaiVietCongKhai } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const danhMuc = sp.get('danhMuc') ?? undefined;
    const tuKhoa = sp.get('tuKhoa') ?? undefined;
    const trang = sp.get('trang') ? Number(sp.get('trang')) : 1;
    const kichThuoc = sp.get('kichThuoc') ? Number(sp.get('kichThuoc')) : 9;

    const ketQua = await layDanhSachBaiVietCongKhai({
      danhMuc,
      tuKhoa,
      trang,
      kichThuoc,
    });
    return NextResponse.json(ketQua);
  } catch (err) {
    console.error('[GET /api/v1/storefront/articles]', err);
    return NextResponse.json(
      { message: 'Không thể tải danh sách bài viết công khai.' },
      { status: 500 },
    );
  }
}
