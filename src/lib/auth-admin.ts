export const COOKIE_ADMIN = 'nh_admin_session';

export type VaiTroQuanTri = 'super_admin' | 'admin';

export interface ThongTinPhienAdmin {
  id: number;
  taiKhoan: string;
  hoTen: string;
  vaiTro: VaiTroQuanTri;
}

const SECRET_DEFAULT = 'nephien-cms-secret-key-2026-quiet-luxury';
const PASSWORD_SALT = 'nephien-pwd-salt-2026';

function layBiMat(): string {
  return process.env.ADMIN_SESSION_SECRET || SECRET_DEFAULT;
}

export async function bamMatKhau(matKhau: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${PASSWORD_SALT}:${matKhau}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function kyChuoi(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(layBiMat()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function taoTokenPhienAdmin(
  nguoiDung: ThongTinPhienAdmin,
): Promise<string> {
  const hetHan = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 ngày
  const payloadObj = {
    id: nguoiDung.id,
    taiKhoan: nguoiDung.taiKhoan,
    hoTen: nguoiDung.hoTen,
    vaiTro: nguoiDung.vaiTro,
    hetHan,
  };
  const json = JSON.stringify(payloadObj);
  const encodedPayload = encodeURIComponent(json);
  const chuKy = await kyChuoi(encodedPayload);
  return `${encodedPayload}.${chuKy}`;
}

export async function xacThucTokenPhienAdmin(
  token: string | undefined | null,
): Promise<{ hopLe: boolean; nguoiDung?: ThongTinPhienAdmin }> {
  if (!token) return { hopLe: false };
  try {
    const dotIdx = token.lastIndexOf('.');
    if (dotIdx <= 0) return { hopLe: false };
    const encodedPayload = token.slice(0, dotIdx);
    const chuKy = token.slice(dotIdx + 1);

    const chuKyDung = await kyChuoi(encodedPayload);
    if (chuKy !== chuKyDung) return { hopLe: false };

    const parsed = JSON.parse(decodeURIComponent(encodedPayload)) as {
      id: number;
      taiKhoan: string;
      hoTen: string;
      vaiTro: VaiTroQuanTri;
      hetHan: number;
    };

    if (!parsed || !Number.isFinite(parsed.hetHan) || Date.now() > parsed.hetHan) {
      return { hopLe: false };
    }

    const vaiTro: VaiTroQuanTri =
      parsed.vaiTro === 'super_admin' ? 'super_admin' : 'admin';

    return {
      hopLe: true,
      nguoiDung: {
        id: Number(parsed.id) || 1,
        taiKhoan: String(parsed.taiKhoan),
        hoTen: String(parsed.hoTen || parsed.taiKhoan),
        vaiTro,
      },
    };
  } catch {
    return { hopLe: false };
  }
}
