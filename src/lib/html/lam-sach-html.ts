import sanitizeHtml from 'sanitize-html';

const THE_CHO_PHEP = [
  'h2',
  'h3',
  'h4',
  'p',
  'br',
  'hr',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'a',
  'span',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'img',
  'figure',
  'figcaption',
];

const THUOC_TINH_CHO_PHEP: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  th: ['colspan', 'rowspan'],
  td: ['colspan', 'rowspan'],
  h2: ['id'],
  h3: ['id'],
  '*': ['class'],
};

const TAP_THE = new Set(THE_CHO_PHEP);
const TAP_THUOC_TINH_CHUNG = new Set(THUOC_TINH_CHO_PHEP['*'] ?? []);

function laAnhHopLe(src: string | undefined): boolean {
  if (!src) return false;
  const s = src.trim();
  if (!s.startsWith('/anh/') && !s.startsWith('/images/')) return false;
  if (s.startsWith('//') || s.includes('..') || s.includes('\\')) return false;
  return /^\/(anh|images)\/[a-zA-Z0-9._/-]+$/.test(s);
}

export interface KetQuaLamSachHtml {
  html: string;
  theBiLoai: number;
  thuocTinhBiLoai: number;
}

/**
 * Làm sạch HTML cho nội dung bài viết, chỉ giữ thẻ & thuộc tính trong danh sách cho phép
 * và trả kèm số thẻ/thuộc tính đã bị loại để quản trị viên biết khi có nội dung bị cắt.
 */
export function lamSachHtml(html: string | null | undefined): KetQuaLamSachHtml {
  if (!html) return { html: '', theBiLoai: 0, thuocTinhBiLoai: 0 };

  let theBiLoai = 0;
  let thuocTinhBiLoai = 0;

  const ketQua = sanitizeHtml(html, {
    allowedTags: THE_CHO_PHEP,
    allowedAttributes: THUOC_TINH_CHO_PHEP,
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: [],
    },
    allowProtocolRelative: false,
    onTag: (tag: string, _uah: string, options: { isClosing?: boolean }) => {
      if (!options.isClosing && !TAP_THE.has(tag)) {
        theBiLoai += 1;
      }
    },
    onTagAttr: (tag: string, name: string, value: string) => {
      const rieng = THUOC_TINH_CHO_PHEP[tag];
      const duocPhep = TAP_THUOC_TINH_CHUNG.has(name) || (rieng ? rieng.includes(name) : false);
      if (!duocPhep) {
        thuocTinhBiLoai += 1;
        return undefined;
      }
      if (tag === 'img' && name === 'src' && !laAnhHopLe(value)) {
        thuocTinhBiLoai += 1;
        return '';
      }
      return undefined;
    },
    transformTags: {
      a: (tagName, attribs) => {
        const next: Record<string, string> = {};
        if (attribs.href) next.href = attribs.href;
        if (attribs.class) next.class = attribs.class;
        if (attribs.target === '_blank') {
          next.target = '_blank';
          next.rel = 'noopener noreferrer';
        }
        return { tagName, attribs: next };
      },
      img: (tagName, attribs) => {
        if (!laAnhHopLe(attribs.src)) {
          return { tagName: 'span', attribs: {} };
        }
        const next: Record<string, string> = {
          src: attribs.src.trim(),
          loading: 'lazy',
        };
        if (attribs.alt) next.alt = attribs.alt;
        if (attribs.width && /^\d{1,4}$/.test(attribs.width)) next.width = attribs.width;
        if (attribs.height && /^\d{1,4}$/.test(attribs.height)) next.height = attribs.height;
        if (attribs.class) next.class = attribs.class;
        return { tagName, attribs: next };
      },
    },
    exclusiveFilter: (frame) => frame.tag === 'span' && !frame.text.trim() && Object.keys(frame.attribs).length === 0,
  } as sanitizeHtml.IOptions & {
    onTag?: (tag: string, uah: string, options: { isClosing?: boolean }) => void;
    onTagAttr?: (tag: string, name: string, value: string) => string | undefined;
  });

  return { html: ketQua, theBiLoai, thuocTinhBiLoai };
}
