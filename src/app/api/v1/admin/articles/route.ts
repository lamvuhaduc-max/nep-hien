import { NextRequest, NextResponse } from 'next/server';
import {
  layDanhSachBaiVietAdmin,
  layTacNhanTuRequest,
  LoiNghiepVu,
  taoBaiViet,
  TrangThaiBaiViet,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const tuKhoa = sp.get('tuKhoa') ?? undefined;
    const danhMucId = sp.get('danhMucId') ? Number(sp.get('danhMucId')) : undefined;
    const trangThai = (sp.get('trangThai') as TrangThaiBaiViet | null) ?? undefined;
    const daXoa = sp.get('daXoa') === 'true';
    const tuNgay = sp.get('tuNgay') ?? undefined;
    const denNgay = sp.get('denNgay') ?? undefined;
    const sapXep =
      (sp.get('sapXep') as 'cap_nhat' | 'ngay_dang' | 'tieu_de' | null) ?? 'cap_nhat';
    const trang = sp.get('trang') ? Number(sp.get('trang')) : 1;
    const kichThuoc = sp.get('kichThuoc') ? Number(sp.get('kichThuoc')) : 12;

    const ketQua = await layDanhSachBaiVietAdmin({
      tuKhoa,
      danhMucId,
      trangThai,
      daXoa,
      tuNgay,
      denNgay,
      sapXep,
      trang,
      kichThuoc,
    });

    return NextResponse.json(ketQua);
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[GET /api/v1/admin/articles]', err);
    return NextResponse.json({ message: 'Lỗi máy chủ khi tải danh sách bài viết.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tacNhan = await layTacNhanTuRequest(req);
    const body = await req.json();
    const ketQua = await taoBaiViet(
      {
        tieuDe: body.tieuDe,
        slug: body.slug,
        danhMucId: Number(body.danhMucId),
        moTaNgan: body.moTaNgan,
        anhBia: body.anhBia,
        noiDungHtml: body.noiDungHtml,
        trangThai: body.trangThai,
        tacGia: body.tacGia,
        noiBat: body.noiBat,
        taoBoiAi: body.taoBoiAi,
      },
      tacNhan,
    );
    return NextResponse.json(ketQua, { status: 201 });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/admin/articles]', err);
    return NextResponse.json({ message: 'Không thể tạo bài viết mới.' }, { status: 500 });
  }
}
