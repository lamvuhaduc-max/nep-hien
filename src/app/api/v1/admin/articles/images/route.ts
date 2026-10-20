import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { luuAnhBaiViet } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

const GIOI_HAN_BYTE = 5 * 1024 * 1024; // 5 MB

function nhanDienDinhDang(buf: Buffer): { duoi: string; mime: string } | null {
  if (buf.length < 12) return null;
  // PNG
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return { duoi: 'png', mime: 'image/png' };
  }
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { duoi: 'jpg', mime: 'image/jpeg' };
  }
  // GIF
  if (
    buf[0] === 0x47 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x38 &&
    (buf[4] === 0x37 || buf[4] === 0x39) &&
    buf[5] === 0x61
  ) {
    return { duoi: 'gif', mime: 'image/gif' };
  }
  // WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return { duoi: 'webp', mime: 'image/webp' };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: 'Thiếu tệp ảnh tải lên (trường "file").' }, { status: 400 });
    }

    if (file.size === 0 || file.size > GIOI_HAN_BYTE) {
      return NextResponse.json(
        { message: 'Kích thước ảnh phải từ 1 byte đến tối đa 5 MB.' },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dinhDang = nhanDienDinhDang(buffer);

    if (!dinhDang) {
      return NextResponse.json(
        { message: 'Định dạng ảnh không hợp lệ (chỉ chấp nhận PNG, JPG, WEBP, GIF).' },
        { status: 400 },
      );
    }

    const tenFile = `bv-${Date.now()}-${randomBytes(6).toString('hex')}.${dinhDang.duoi}`;
    const ketQua = await luuAnhBaiViet({
      tenFile,
      mimeType: dinhDang.mime,
      duLieu: buffer,
    });

    return NextResponse.json(ketQua, { status: 201 });
  } catch (err) {
    console.error('[POST /api/v1/admin/articles/images]', err);
    return NextResponse.json({ message: 'Không thể tải ảnh lên máy chủ.' }, { status: 500 });
  }
}
