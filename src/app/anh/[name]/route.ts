import { NextRequest, NextResponse } from 'next/server';
import { layAnhBaiViet } from '@/lib/content/bai-viet-service';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  context: { params: { name: string } },
) {
  try {
    const tenFile = context.params.name;
    if (!tenFile || !/^[a-zA-Z0-9._-]+$/.test(tenFile)) {
      return new NextResponse('Not Found', { status: 404 });
    }
    const anh = await layAnhBaiViet(tenFile);
    if (!anh) {
      return new NextResponse('Not Found', { status: 404 });
    }
    return new NextResponse(new Uint8Array(anh.duLieu), {
      status: 200,
      headers: {
        'Content-Type': anh.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[GET /anh/[name]]', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
