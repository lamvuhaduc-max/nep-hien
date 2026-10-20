export interface BanNhapBaiVietCucBo {
  tieuDe: string;
  slug: string;
  slugTuSua: boolean;
  danhMucId: number | '';
  moTaNgan: string;
  anhBia: string;
  noiDungHtml: string;
  tacGia: string;
  noiBat: boolean;
  luuLuc: number;
}

const TIEN_TO = 'nephien:bai-viet:nhap:';
const THOI_HAN_MS = 7 * 24 * 60 * 60 * 1000;

export function khoaNhapCucBo(cheDo: 'moi' | 'sua', id?: number): string {
  return cheDo === 'moi' ? `${TIEN_TO}moi` : `${TIEN_TO}sua:${id ?? 0}`;
}

export function docNhapCucBo(khoa: string): BanNhapBaiVietCucBo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(khoa);
    if (!raw) return null;
    const data = JSON.parse(raw) as BanNhapBaiVietCucBo;
    if (!data || typeof data.luuLuc !== 'number') return null;
    if (Date.now() - data.luuLuc > THOI_HAN_MS) {
      window.localStorage.removeItem(khoa);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function ghiNhapCucBo(khoa: string, banNhap: Omit<BanNhapBaiVietCucBo, 'luuLuc'>): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: BanNhapBaiVietCucBo = { ...banNhap, luuLuc: Date.now() };
    window.localStorage.setItem(khoa, JSON.stringify(payload));
  } catch {
    // Bỏ qua nếu bộ nhớ trình duyệt đầy
  }
}

export function xoaNhapCucBo(khoa: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(khoa);
  } catch {
    // Bỏ qua
  }
}
