import { NextRequest, NextResponse } from 'next/server';
import {
  LoiNghiepVu,
  NguonYeuCauTuVan,
  taoYeuCauTuVanCongKhai,
} from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let hoTen = '';
    let soDienThoai = '';
    let email = '';
    let dichVu = '';
    let dienTich = '';
    let loiNhan = '';
    let nguon: NguonYeuCauTuVan = 'form_trang_chu';
    let maUuDai = '';
    let gotcha = '';

    if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      hoTen = String(formData.get('hoTen') || formData.get('name') || formData.get('owner_name') || '');
      soDienThoai = String(formData.get('soDienThoai') || formData.get('phone') || '');
      email = String(formData.get('email') || '');
      dichVu = String(formData.get('dichVu') || formData.get('service') || formData.get('nhu_cau') || '');
      dienTich = String(formData.get('dienTich') || formData.get('area') || formData.get('ma_can') || '');
      loiNhan = String(formData.get('loiNhan') || formData.get('message') || formData.get('note') || '');
      const nguonRaw = String(formData.get('nguon') || formData.get('source') || '');
      if (nguonRaw.includes('QR') || nguonRaw === 'form_qr_uu_dai') {
        nguon = 'form_qr_uu_dai';
      }
      maUuDai = String(formData.get('maUuDai') || '');
      gotcha = String(formData.get('_gotcha') || '');
    } else {
      const body = await req.json();
      hoTen = String(body.hoTen ?? body.name ?? body.owner_name ?? '');
      soDienThoai = String(body.soDienThoai ?? body.phone ?? '');
      email = String(body.email ?? '');
      dichVu = String(body.dichVu ?? body.service ?? body.nhu_cau ?? '');
      dienTich = String(body.dienTich ?? body.area ?? body.ma_can ?? '');
      loiNhan = String(body.loiNhan ?? body.message ?? body.note ?? '');
      if (body.nguon === 'form_qr_uu_dai' || body.nguon === 'khac' || body.nguon === 'form_trang_chu') {
        nguon = body.nguon;
      } else if (typeof body.source === 'string' && body.source.includes('QR')) {
        nguon = 'form_qr_uu_dai';
      }
      maUuDai = String(body.maUuDai ?? '');
      gotcha = String(body._gotcha ?? body.gotcha ?? '');
    }

    const ketQua = await taoYeuCauTuVanCongKhai({
      hoTen,
      soDienThoai,
      email,
      dichVu,
      dienTich,
      loiNhan,
      nguon,
      maUuDai,
      gotcha,
    });

    return NextResponse.json(ketQua, { status: 201 });
  } catch (err) {
    if (err instanceof LoiNghiepVu) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    console.error('[POST /api/v1/storefront/consultations]', err);
    return NextResponse.json(
      { message: 'Không thể gửi yêu cầu tư vấn lúc này. Vui lòng thử lại.' },
      { status: 500 },
    );
  }
}
