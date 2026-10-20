export interface DauVaoSoiSeo {
  tieuDe: string;
  slug: string;
  moTaNgan: string;
  anhBia: string;
  noiDungHtml: string;
  tuKhoa: string;
}

export type MucDatSeo = 'dat' | 'can_cai_thien' | 'chua_dat' | 'bo_qua';

export interface TieuChiSeo {
  ma: string;
  nhom: 'co_ban' | 'noi_dung' | 'tu_khoa';
  ten: string;
  muc: MucDatSeo;
  hienTai: string;
  goiY: string;
}

export interface KetQuaSoiSeo {
  sanSang: number;
  soDat: number;
  tongTinhDiem: number;
  soTu: number;
  soPhutDoc: number;
  tieuChi: TieuChiSeo[];
}

export interface NguongSeo {
  tieuDeMin: number;
  tieuDeMax: number;
  moTaMin: number;
  moTaMax: number;
  slugMax: number;
  soTuMin: number;
  soH2Min: number;
  matDoMin: number;
  matDoMax: number;
}

export const NGUONG_SEO_MAC_DINH: NguongSeo = {
  tieuDeMin: 30,
  tieuDeMax: 65,
  moTaMin: 120,
  moTaMax: 160,
  slugMax: 75,
  soTuMin: 300,
  soH2Min: 2,
  matDoMin: 0.5,
  matDoMax: 2.5,
};

function boDau(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase();
}

function trichChuThuan(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function demSoTu(chu: string): number {
  if (!chu) return 0;
  return chu.split(/\s+/).filter(Boolean).length;
}

function demLanXuatHien(vanBan: string, cumTu: string): number {
  const vb = boDau(vanBan);
  const ct = boDau(cumTu).trim();
  if (!vb || !ct) return 0;
  let dem = 0;
  let viTri = 0;
  while (viTri <= vb.length - ct.length) {
    const tim = vb.indexOf(ct, viTri);
    if (tim === -1) break;
    dem += 1;
    viTri = tim + ct.length;
  }
  return dem;
}

export function chamSeo(
  dauVao: DauVaoSoiSeo,
  nguongTuyChinh?: Partial<NguongSeo>,
): KetQuaSoiSeo {
  const N: NguongSeo = { ...NGUONG_SEO_MAC_DINH, ...(nguongTuyChinh ?? {}) };
  const tieuDe = dauVao.tieuDe.trim();
  const slug = dauVao.slug.trim();
  const moTa = dauVao.moTaNgan.trim();
  const anhBia = dauVao.anhBia.trim();
  const html = dauVao.noiDungHtml || '';
  const tuKhoa = dauVao.tuKhoa.trim();

  const chuThuan = trichChuThuan(html);
  const soTu = demSoTu(chuThuan);
  const soPhutDoc = Math.max(1, Math.round(soTu / 220));

  const dsH2 = html.match(/<h2(\s[^>]*)?>[\s\S]*?<\/h2>/gi) ?? [];
  const dsH3 = html.match(/<h3(\s[^>]*)?>[\s\S]*?<\/h3>/gi) ?? [];
  const dsAnh = html.match(/<img\b[^>]*>/gi) ?? [];
  const anhThieuAlt = dsAnh.filter((the) => {
    const m = the.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
    const alt = (m?.[2] ?? m?.[3] ?? '').trim();
    return alt.length === 0;
  });
  const dsLienKetNoiBo =
    html.match(/<a\b[^>]*\bhref\s*=\s*["'](\/[^"']*|\.\.?\/[^"']*)["'][^>]*>/gi) ?? [];

  const doanDauMatch = html.match(/<p(\s[^>]*)?>([\s\S]*?)<\/p>/i);
  const chuDoanDau = trichChuThuan(doanDauMatch?.[2] ?? chuThuan.slice(0, 300));

  const tieuChi: TieuChiSeo[] = [];

  // 1. Độ dài tiêu đề
  const daiTieuDe = tieuDe.length;
  tieuChi.push({
    ma: 'tieu_de_do_dai',
    nhom: 'co_ban',
    ten: 'Độ dài tiêu đề',
    muc:
      daiTieuDe >= N.tieuDeMin && daiTieuDe <= N.tieuDeMax
        ? 'dat'
        : daiTieuDe >= Math.max(10, Math.round(N.tieuDeMin * 0.5)) && daiTieuDe <= N.tieuDeMax + 20
          ? 'can_cai_thien'
          : 'chua_dat',
    hienTai: `${daiTieuDe} ký tự`,
    goiY:
      daiTieuDe < N.tieuDeMin
        ? `Nên viết từ ${N.tieuDeMin}–${N.tieuDeMax} ký tự để hiển thị đầy đủ trên Google.`
        : daiTieuDe > N.tieuDeMax
          ? `Tiêu đề hơi dài (> ${N.tieuDeMax} ký tự), dễ bị cắt chữ ở kết quả tìm kiếm.`
          : `Độ dài chuẩn (${N.tieuDeMin}–${N.tieuDeMax} ký tự).`,
  });

  // 2. Độ dài mô tả ngắn
  const daiMoTa = moTa.length;
  tieuChi.push({
    ma: 'mo_ta_do_dai',
    nhom: 'co_ban',
    ten: 'Mô tả ngắn (meta description)',
    muc:
      daiMoTa >= N.moTaMin && daiMoTa <= N.moTaMax
        ? 'dat'
        : daiMoTa >= Math.max(40, Math.round(N.moTaMin * 0.6)) && daiMoTa <= N.moTaMax + 60
          ? 'can_cai_thien'
          : 'chua_dat',
    hienTai: `${daiMoTa} ký tự`,
    goiY:
      daiMoTa === 0
        ? `Hãy viết tóm tắt ${N.moTaMin}–${N.moTaMax} ký tự để thu hút người đọc bấm vào bài.`
        : daiMoTa < N.moTaMin
          ? `Mô tả hơi ngắn, nên đạt ${N.moTaMin}–${N.moTaMax} ký tự.`
          : daiMoTa > N.moTaMax
            ? `Mô tả vượt ${N.moTaMax} ký tự, phần đuôi có thể bị Google lược bớt.`
            : `Độ dài chuẩn (${N.moTaMin}–${N.moTaMax} ký tự).`,
  });

  // 3. Đường dẫn (slug)
  const slugHopLe = /^[a-z0-9-]+$/.test(slug);
  tieuChi.push({
    ma: 'slug_gon',
    nhom: 'co_ban',
    ten: 'Đường dẫn (slug) gọn & sạch',
    muc:
      slugHopLe && slug.length >= 5 && slug.length <= N.slugMax
        ? 'dat'
        : slugHopLe && slug.length > N.slugMax
          ? 'can_cai_thien'
          : 'chua_dat',
    hienTai: slug ? `/bai-viet/${slug} (${slug.length} ký tự)` : 'Chưa có',
    goiY: !slug
      ? 'Nhập tiêu đề để tự sinh đường dẫn.'
      : !slugHopLe
        ? 'Chỉ dùng chữ thường a–z, số 0–9 và dấu gạch ngang (-).'
        : slug.length > N.slugMax
          ? `Rút gọn dưới ${N.slugMax} ký tự, giữ các từ chính.`
          : 'Đường dẫn ngắn gọn, dễ nhớ.',
  });

  // 4. Ảnh bìa
  tieuChi.push({
    ma: 'anh_bia',
    nhom: 'co_ban',
    ten: 'Ảnh bìa đại diện (OpenGraph)',
    muc: anhBia ? 'dat' : 'chua_dat',
    hienTai: anhBia ? 'Đã có ảnh bìa' : 'Chưa có',
    goiY: anhBia
      ? 'Bài viết đã có ảnh đại diện khi chia sẻ mạng xã hội.'
      : 'Tải ảnh bìa (tỷ lệ 16:9 hoặc 1200×630) để hiển thị đẹp khi chia sẻ.',
  });

  // 5. Độ dài bài viết
  const nguongTuKha = Math.max(50, Math.round(N.soTuMin * 0.6));
  tieuChi.push({
    ma: 'do_dai_bai',
    nhom: 'noi_dung',
    ten: 'Độ dài nội dung',
    muc: soTu >= N.soTuMin ? 'dat' : soTu >= nguongTuKha ? 'can_cai_thien' : 'chua_dat',
    hienTai: `${soTu} từ (~${soPhutDoc} phút đọc)`,
    goiY:
      soTu < nguongTuKha
        ? `Bài quá ngắn. Nên viết tối thiểu ${N.soTuMin} từ để cung cấp thông tin đầy đủ.`
        : soTu < N.soTuMin
          ? `Bổ sung thêm ví dụ hoặc hướng dẫn chi tiết để đạt từ ${N.soTuMin} từ trở lên.`
          : 'Độ dài bài viết tốt, đủ chiều sâu nội dung.',
  });

  // 6. Cấu trúc tiêu đề con H2/H3
  tieuChi.push({
    ma: 'cau_truc_h2',
    nhom: 'noi_dung',
    ten: 'Chia mục bằng tiêu đề H2 / H3',
    muc:
      dsH2.length >= N.soH2Min
        ? 'dat'
        : dsH2.length >= 1
          ? 'can_cai_thien'
          : 'chua_dat',
    hienTai: `${dsH2.length} mục H2 · ${dsH3.length} mục H3`,
    goiY:
      dsH2.length === 0
        ? 'Thêm các tiêu đề H2 để chia nhỏ bài viết và tự động tạo Mục lục.'
        : dsH2.length < N.soH2Min
          ? `Nên có ít nhất ${N.soH2Min} mục H2 để khung Mục lục hiển thị ở trang đọc bài.`
          : 'Cấu trúc mục lớn/nhỏ rõ ràng, đã tự sinh Mục lục.',
  });

  // 7. Ảnh minh họa & thuộc tính alt
  tieuChi.push({
    ma: 'anh_alt',
    nhom: 'noi_dung',
    ten: 'Ảnh minh họa & mô tả ảnh (alt)',
    muc:
      dsAnh.length > 0 && anhThieuAlt.length === 0
        ? 'dat'
        : dsAnh.length > 0
          ? 'can_cai_thien'
          : 'can_cai_thien',
    hienTai:
      dsAnh.length === 0
        ? 'Chưa có ảnh trong bài'
        : `${dsAnh.length} ảnh · ${dsAnh.length - anhThieuAlt.length}/${dsAnh.length} có alt`,
    goiY:
      dsAnh.length === 0
        ? 'Nên chèn ít nhất 1 ảnh minh họa trong thân bài.'
        : anhThieuAlt.length > 0
          ? `Còn ${anhThieuAlt.length} ảnh chưa có mô tả (alt).`
          : 'Tất cả ảnh trong bài đều có mô tả alt.',
  });

  // 8. Liên kết nội bộ
  tieuChi.push({
    ma: 'lien_ket_noi_bo',
    nhom: 'noi_dung',
    ten: 'Liên kết nội bộ',
    muc: dsLienKetNoiBo.length >= 1 ? 'dat' : 'can_cai_thien',
    hienTai: `${dsLienKetNoiBo.length} liên kết nội bộ`,
    goiY:
      dsLienKetNoiBo.length === 0
        ? 'Nên gắn ít nhất 1 liên kết tới dự án (/du-an/...) hoặc bài viết liên quan (/bai-viet/...).'
        : 'Đã có liên kết điều hướng nội bộ trong bài.',
  });

  // 9–12. Nhóm tiêu chí theo từ khóa chính
  if (!tuKhoa) {
    const danhSachBoQua: Array<{ ma: string; ten: string }> = [
      { ma: 'tk_tieu_de', ten: 'Từ khóa có trong tiêu đề' },
      { ma: 'tk_mo_ta', ten: 'Từ khóa có trong mô tả ngắn' },
      { ma: 'tk_doan_dau', ten: 'Từ khóa ở đoạn mở đầu' },
      { ma: 'tk_mat_do', ten: 'Mật độ từ khóa trong bài' },
    ];
    for (const muc of danhSachBoQua) {
      tieuChi.push({
        ma: muc.ma,
        nhom: 'tu_khoa',
        ten: muc.ten,
        muc: 'bo_qua',
        hienTai: 'Chưa nhập từ khóa chính',
        goiY: 'Nhập "Từ khóa chính" ở ô phía trên nếu bạn muốn kiểm tra sâu theo từ khóa.',
      });
    }
  } else {
    const coTrongTieuDe = demLanXuatHien(tieuDe, tuKhoa) > 0;
    const coTrongSlug = boDau(slug).includes(
      boDau(tuKhoa)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    );
    tieuChi.push({
      ma: 'tk_tieu_de',
      nhom: 'tu_khoa',
      ten: 'Từ khóa trong tiêu đề & đường dẫn',
      muc: coTrongTieuDe && coTrongSlug ? 'dat' : coTrongTieuDe ? 'can_cai_thien' : 'chua_dat',
      hienTai: coTrongTieuDe
        ? coTrongSlug
          ? 'Có trong tiêu đề & slug'
          : 'Có trong tiêu đề, thiếu ở slug'
        : 'Chưa xuất hiện',
      goiY:
        coTrongTieuDe && coTrongSlug
          ? 'Từ khóa đã nằm ở cả tiêu đề và đường dẫn.'
          : `Đưa cụm "${tuKhoa}" vào tiêu đề và đường dẫn của bài.`,
    });

    const coTrongMoTa = demLanXuatHien(moTa, tuKhoa) > 0;
    tieuChi.push({
      ma: 'tk_mo_ta',
      nhom: 'tu_khoa',
      ten: 'Từ khóa trong mô tả ngắn',
      muc: coTrongMoTa ? 'dat' : 'can_cai_thien',
      hienTai: coTrongMoTa ? 'Đã có' : 'Chưa có',
      goiY: coTrongMoTa
        ? 'Google sẽ in đậm cụm từ khóa này trong phần mô tả khi khách tìm kiếm.'
        : `Nên nhắc tự nhiên cụm "${tuKhoa}" trong mô tả ngắn.`,
    });

    const coODoanDau = demLanXuatHien(chuDoanDau, tuKhoa) > 0;
    tieuChi.push({
      ma: 'tk_doan_dau',
      nhom: 'tu_khoa',
      ten: 'Từ khóa ở đoạn mở đầu',
      muc: coODoanDau ? 'dat' : 'can_cai_thien',
      hienTai: coODoanDau ? 'Có ở đoạn đầu' : 'Chưa có ở đoạn đầu',
      goiY: coODoanDau
        ? 'Từ khóa xuất hiện sớm ở ngay mở bài.'
        : `Đưa "${tuKhoa}" vào đoạn văn đầu tiên để định hình chủ đề ngay từ đầu.`,
    });

    const soLanTk = demLanXuatHien(chuThuan, tuKhoa);
    const soTuTk = Math.max(1, demSoTu(tuKhoa));
    const matDo = soTu > 0 ? Number((((soLanTk * soTuTk) / soTu) * 100).toFixed(2)) : 0;
    tieuChi.push({
      ma: 'tk_mat_do',
      nhom: 'tu_khoa',
      ten: 'Tần suất xuất hiện từ khóa',
      muc:
        soLanTk >= 2 && matDo >= N.matDoMin && matDo <= N.matDoMax
          ? 'dat'
          : soLanTk >= 1 && matDo <= N.matDoMax + 1
            ? 'can_cai_thien'
            : 'chua_dat',
      hienTai: `${soLanTk} lần (${matDo}%)`,
      goiY:
        soLanTk === 0
          ? `Từ khóa "${tuKhoa}" chưa xuất hiện trong thân bài.`
          : matDo > N.matDoMax
            ? `Lặp lại hơi dày (> ${N.matDoMax}%), hãy dùng từ đồng nghĩa để câu văn tự nhiên.`
            : matDo < N.matDoMin || soLanTk < 2
              ? `Nhắc thêm "${tuKhoa}" ở 1–2 mục con (mật độ lý tưởng ${N.matDoMin}%–${N.matDoMax}%).`
              : `Mật độ tự nhiên (${N.matDoMin}%–${N.matDoMax}%).`,
    });
  }

  const dsTinh = tieuChi.filter((t) => t.muc !== 'bo_qua');
  const tongTinhDiem = dsTinh.length;
  const soDat = dsTinh.filter((t) => t.muc === 'dat').length;
  const diemThuc = dsTinh.reduce(
    (tong, t) => tong + (t.muc === 'dat' ? 1 : t.muc === 'can_cai_thien' ? 0.5 : 0),
    0,
  );
  const sanSang = tongTinhDiem > 0 ? Math.round((diemThuc / tongTinhDiem) * 100) : 0;

  return {
    sanSang,
    soDat,
    tongTinhDiem,
    soTu,
    soPhutDoc,
    tieuChi,
  };
}
