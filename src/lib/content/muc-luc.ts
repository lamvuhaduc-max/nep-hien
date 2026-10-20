export interface MucLucMuc {
  id: string;
  chu: string;
  bac: 2 | 3;
}

/**
 * Chuyển chuỗi tiếng Việt bất kỳ sang slug ASCII hợp lệ `^[a-z0-9-]+$`.
 */
export function taoSlug(raw: string): string {
  return (raw || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

const MAU_SLUG_HOP_LE = /^[a-z0-9-]+$/;

export function kiemTraSlugHopLe(slug: string): boolean {
  return Boolean(slug) && slug.length <= 200 && MAU_SLUG_HOP_LE.test(slug);
}

function giaiMaThucTheHtml(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_m, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function boTheHtml(s: string): string {
  return giaiMaThucTheHtml(s.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Quét các thẻ <h2>/<h3> trong HTML đã làm sạch, gán id không trùng
 * và trả lại HTML kèm danh sách mục lục theo đúng thứ tự xuất hiện.
 */
export function rutMucLuc(htmlSach: string): { html: string; mucLuc: MucLucMuc[] } {
  if (!htmlSach) return { html: '', mucLuc: [] };

  const demId = new Map<string, number>();
  const mucLuc: MucLucMuc[] = [];

  const html = htmlSach.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (nguyenCum, capChuoi: string, thuocTinhCu: string | undefined, benTrong: string) => {
      const chu = boTheHtml(benTrong);
      if (!chu) return nguyenCum;

      const bac = (capChuoi === '3' ? 3 : 2) as 2 | 3;
      const goc = taoSlug(chu) || 'muc';
      const soLan = (demId.get(goc) ?? 0) + 1;
      demId.set(goc, soLan);
      const id = soLan === 1 ? goc : `${goc}-${soLan}`;

      const thuocTinhCon = (thuocTinhCu ?? '')
        .replace(/\s+id\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
        .trim();
      const moThe = thuocTinhCon ? `<h${bac} id="${id}" ${thuocTinhCon}>` : `<h${bac} id="${id}">`;

      mucLuc.push({ id, chu, bac });
      return `${moThe}${benTrong}</h${bac}>`;
    },
  );

  return { html, mucLuc };
}
