import { NextRequest, NextResponse } from 'next/server';
import {
  layDanhSachYeuCauTuVanAdmin,
  layTacNhanTuRequest,
  LoiNghiepVu,
  NguonYeuCauTuVan,
  TrangThaiYeuCauTuVan,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    if (!tacNhan) {
      return NextResponse.json({ message: 'Chưa đăng nhập quản trị.' }, { status: 401 });
    }

    const sp = req.nextUrl.searchParams;
    const tuKhoa = sp.get('tuKhoa') ?? undefined;
    const trangThai = (sp.get('trangThai') as TrangThaiYeuCauTuVan | null) ?? undefined;
    const nguon = (sp.get('nguon') as NguonYeuCauTuVan | null) ?? undefined;
    const trang = sp.get('trang') ? Number(sp.get('trang')) : 1;
    const kichThuoc = sp.get('kichThuoc') ? Number(sp.get('kichThuoc')) : 15;

    const ketQua = await layDanhSachYeuCauTuVanAdmin({
      tuKhoa,
      trangThai,
      nguon,
      trang,
      kichThuoc,
    });

    return NextResponse.json(ketQua);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[GET /api/v1/admin/consultations]', err);
    return NextResponse.json(
      { message: 'Lỗi máy chủ khi tải danh sách yêu cầu tư vấn.' },
      { status: 500 },
    );
  }
}
