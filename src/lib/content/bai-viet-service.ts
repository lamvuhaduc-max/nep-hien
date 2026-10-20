import { NextRequest } from 'next/server';
import {
  bamMatKhau,
  COOKIE_ADMIN,
  ThongTinPhienAdmin,
  VaiTroQuanTri,
  xacThucTokenPhienAdmin,
} from '../auth-admin';
import { sql } from '../db';
import { lamSachHtml } from '../html/lam-sach-html';
import { kiemTraSlugHopLe, MucLucMuc, rutMucLuc, taoSlug } from './muc-luc';

export type TrangThaiBaiViet = 'nhap' | 'dang' | 'an';

export class LoiNghiepVu extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export interface TaiKhoanQuanTriDto {
  id: number;
  taiKhoan: string;
  hoTen: string;
  vaiTro: VaiTroQuanTri;
  kichHoat: boolean;
  lanDangNhapCuoi: string | null;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface DanhMucBaiVietDto {
  id: number;
  ten: string;
  slug: string;
  moTa: string | null;
  thuTu: number;
  hien: boolean;
  ngayTao: string;
  soBaiViet?: number;
}

export interface TomTatBaiVietDto {
  id: number;
  tieuDe: string;
  slug: string;
  danhMucId: number;
  tenDanhMuc: string;
  slugDanhMuc: string;
  danhMucHien: boolean;
  moTaNgan: string | null;
  anhBia: string | null;
  trangThai: TrangThaiBaiViet;
  ngayDang: string | null;
  taoBoiAi: boolean;
  tacGia: string;
  noiBat: boolean;
  luotXem: number;
  ngayTao: string;
  ngayCapNhat: string;
  xoaLuc: string | null;
}

export interface ChiTietBaiVietDto extends TomTatBaiVietDto {
  noiDungHtml: string;
  mucLuc: MucLucMuc[];
}

export interface ThongKeBaiVietDto {
  tatCa: number;
  dang: number;
  nhap: number;
  an: number;
  thungRac: number;
}

export interface NhatKyBaiVietDto {
  id: number;
  hanhDong: string;
  doiTuongId: number | null;
  nguoiThucHienId: number | null;
  taiKhoanThucHien: string | null;
  vaiTroThucHien: VaiTroQuanTri | null;
  chiTiet: Record<string, unknown>;
  ngayTao: string;
}

function isoHoacNull(val: unknown): string | null {
  if (!val) return null;
  if (val instanceof Date) return val.toISOString();
  return String(val);
}

function chuanHoaMucLuc(raw: unknown): MucLucMuc[] {
  let parsed = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (m): m is { id: string; chu: string; bac: number } =>
        Boolean(m) &&
        typeof m === 'object' &&
        typeof (m as { id?: unknown }).id === 'string' &&
        typeof (m as { chu?: unknown }).chu === 'string' &&
        ((m as { bac?: unknown }).bac === 2 || (m as { bac?: unknown }).bac === 3),
    )
    .map((m) => ({ id: m.id, chu: m.chu, bac: m.bac === 3 ? 3 : 2 }));
}

export async function layTacNhanTuRequest(
  req: NextRequest,
): Promise<ThongTinPhienAdmin | null> {
  const token = req.cookies.get(COOKIE_ADMIN)?.value;
  const kq = await xacThucTokenPhienAdmin(token);
  return kq.hopLe && kq.nguoiDung ? kq.nguoiDung : null;
}

export async function ghiNhatKy(
  hanhDong: string,
  doiTuongId: number | null,
  chiTiet: Record<string, unknown>,
  tacNhan?: ThongTinPhienAdmin | null,
) {
  try {
    await sql`
      INSERT INTO nhat_ky_bai_viet (
        hanh_dong,
        doi_tuong_id,
        nguoi_thuc_hien_id,
        tai_khoan_thuc_hien,
        vai_tro_thuc_hien,
        chi_tiet
      )
      VALUES (
        ${hanhDong},
        ${doiTuongId},
        ${tacNhan?.id ?? null},
        ${tacNhan?.taiKhoan ?? null},
        ${tacNhan?.vaiTro ?? null},
        ${sql.json(chiTiet as never)}
      )
    `;
  } catch {
    // Không chặn luồng chính nếu ghi nhật ký gặp sự cố
  }
}

async function slugBaiVietKhongTrung(goc: string, boQuaId?: number): Promise<string> {
  const chuan = taoSlug(goc) || 'bai-viet';
  for (let i = 1; i <= 80; i++) {
    const ungVien = i === 1 ? chuan : `${chuan}-${i}`;
    const dong = boQuaId
      ? await sql`SELECT id FROM bai_viet WHERE slug = ${ungVien} AND id <> ${boQuaId} LIMIT 1`
      : await sql`SELECT id FROM bai_viet WHERE slug = ${ungVien} LIMIT 1`;
    if (dong.length === 0) return ungVien;
  }
  return `${chuan}-${Date.now()}`;
}

async function slugDanhMucKhongTrung(goc: string, boQuaId?: number): Promise<string> {
  const chuan = taoSlug(goc) || 'danh-muc';
  for (let i = 1; i <= 80; i++) {
    const ungVien = i === 1 ? chuan : `${chuan}-${i}`;
    const dong = boQuaId
      ? await sql`SELECT id FROM danh_muc_bai_viet WHERE slug = ${ungVien} AND id <> ${boQuaId} LIMIT 1`
      : await sql`SELECT id FROM danh_muc_bai_viet WHERE slug = ${ungVien} LIMIT 1`;
    if (dong.length === 0) return ungVien;
  }
  return `${chuan}-${Date.now()}`;
}

function mapTomTat(r: Record<string, unknown>): TomTatBaiVietDto {
  return {
    id: Number(r.id),
    tieuDe: String(r.tieu_de ?? ''),
    slug: String(r.slug ?? ''),
    danhMucId: Number(r.danh_muc_id),
    tenDanhMuc: String(r.ten_danh_muc ?? ''),
    slugDanhMuc: String(r.slug_danh_muc ?? ''),
    danhMucHien: Boolean(r.danh_muc_hien ?? true),
    moTaNgan: r.mo_ta_ngan ? String(r.mo_ta_ngan) : null,
    anhBia: r.anh_bia ? String(r.anh_bia) : null,
    trangThai: (r.trang_thai as TrangThaiBaiViet) || 'nhap',
    ngayDang: isoHoacNull(r.ngay_dang),
    taoBoiAi: Boolean(r.tao_boi_ai),
    tacGia: String(r.tac_gia ?? 'Ban Biên Tập Nếp Hiên'),
    noiBat: Boolean(r.noi_bat),
    luotXem: Number(r.luot_xem ?? 0),
    ngayTao: isoHoacNull(r.ngay_tao) ?? new Date().toISOString(),
    ngayCapNhat: isoHoacNull(r.ngay_cap_nhat) ?? new Date().toISOString(),
    xoaLuc: isoHoacNull(r.xoa_luc),
  };
}

function mapChiTiet(r: Record<string, unknown>): ChiTietBaiVietDto {
  return {
    ...mapTomTat(r),
    noiDungHtml: String(r.noi_dung_html ?? ''),
    mucLuc: chuanHoaMucLuc(r.muc_luc),
  };
}

function mapTaiKhoan(r: Record<string, unknown>): TaiKhoanQuanTriDto {
  return {
    id: Number(r.id),
    taiKhoan: String(r.tai_khoan),
    hoTen: String(r.ho_ten),
    vaiTro: r.vai_tro === 'super_admin' ? 'super_admin' : 'admin',
    kichHoat: Boolean(r.kich_hoat),
    lanDangNhapCuoi: isoHoacNull(r.lan_dang_nhap_cuoi),
    ngayTao: isoHoacNull(r.ngay_tao) ?? new Date().toISOString(),
    ngayCapNhat: isoHoacNull(r.ngay_cap_nhat) ?? new Date().toISOString(),
  };
}

// ============================================================================
// TÀI KHOẢN QUẢN TRỊ & PHÂN QUYỀN (SUPER_ADMIN / ADMIN)
// ============================================================================

export async function xacThucDangNhapQuanTri(
  taiKhoanNhap: string,
  matKhauNhap: string,
): Promise<TaiKhoanQuanTriDto> {
  const tkRaw = (taiKhoanNhap ?? '').trim().toLowerCase();
  if (!tkRaw || !matKhauNhap) {
    throw new LoiNghiepVu('Vui lòng nhập đầy đủ tài khoản và mật khẩu.', 400);
  }

  // Hỗ trợ gõ tắt 'admin' -> 'admin@nephien.com' hoặc 'bientap' -> 'bientap@nephien.com'
  const tkChuan =
    tkRaw === 'admin'
      ? 'admin@nephien.com'
      : tkRaw === 'bientap'
        ? 'bientap@nephien.com'
        : tkRaw;

  const [row] = await sql`
    SELECT * FROM tai_khoan_quan_tri
    WHERE LOWER(tai_khoan) = ${tkChuan} OR LOWER(tai_khoan) = ${tkRaw}
    LIMIT 1
  `;

  if (!row) {
    await ghiNhatKy('he_thong.dang_nhap_that_bai', null, {
      taiKhoanNhap: tkRaw,
      lyDo: 'Khong ton tai tai khoan',
    });
    throw new LoiNghiepVu('Tài khoản hoặc mật khẩu quản trị không chính xác.', 401);
  }

  if (!row.kich_hoat) {
    await ghiNhatKy(
      'he_thong.dang_nhap_that_bai',
      Number(row.id),
      { taiKhoan: String(row.tai_khoan), lyDo: 'Tai khoan bi khoa' },
      {
        id: Number(row.id),
        taiKhoan: String(row.tai_khoan),
        hoTen: String(row.ho_ten),
        vaiTro: row.vai_tro === 'super_admin' ? 'super_admin' : 'admin',
      },
    );
    throw new LoiNghiepVu('Tài khoản này đang bị khóa. Vui lòng liên hệ Super Admin.', 403);
  }

  const bamNhap = await bamMatKhau(matKhauNhap);
  if (bamNhap !== String(row.mat_khau_bam)) {
    await ghiNhatKy('he_thong.dang_nhap_that_bai', Number(row.id), {
      taiKhoan: String(row.tai_khoan),
      lyDo: 'Sai mat khau',
    });
    throw new LoiNghiepVu('Tài khoản hoặc mật khẩu quản trị không chính xác.', 401);
  }

  const [capNhat] = await sql`
    UPDATE tai_khoan_quan_tri
    SET lan_dang_nhap_cuoi = now()
    WHERE id = ${row.id}
    RETURNING *
  `;

  const dto = mapTaiKhoan(capNhat);
  await ghiNhatKy(
    'he_thong.dang_nhap',
    dto.id,
    { taiKhoan: dto.taiKhoan, vaiTro: dto.vaiTro },
    { id: dto.id, taiKhoan: dto.taiKhoan, hoTen: dto.hoTen, vaiTro: dto.vaiTro },
  );

  return dto;
}

export async function layDanhSachTaiKhoanQuanTri(): Promise<TaiKhoanQuanTriDto[]> {
  const rows = await sql`
    SELECT id, tai_khoan, ho_ten, vai_tro, kich_hoat, lan_dang_nhap_cuoi, ngay_tao, ngay_cap_nhat
    FROM tai_khoan_quan_tri
    ORDER BY CASE WHEN vai_tro = 'super_admin' THEN 0 ELSE 1 END, id ASC
  `;
  return rows.map(mapTaiKhoan);
}

function kiemTraQuyenSuperAdmin(tacNhan?: ThongTinPhienAdmin | null) {
  if (!tacNhan || tacNhan.vaiTro !== 'super_admin') {
    throw new LoiNghiepVu(
      'Chỉ tài khoản Super Admin mới có quyền quản lý tài khoản và phân quyền.',
      403,
    );
  }
}

export async function taoTaiKhoanQuanTri(
  dauVao: {
    taiKhoan: string;
    hoTen: string;
    matKhau: string;
    vaiTro?: VaiTroQuanTri;
    kichHoat?: boolean;
  },
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<TaiKhoanQuanTriDto> {
  kiemTraQuyenSuperAdmin(tacNhan);

  const taiKhoan = (dauVao.taiKhoan ?? '').trim().toLowerCase();
  const hoTen = (dauVao.hoTen ?? '').trim();
  const matKhau = dauVao.matKhau ?? '';
  const vaiTro: VaiTroQuanTri = dauVao.vaiTro === 'super_admin' ? 'super_admin' : 'admin';
  const kichHoat = dauVao.kichHoat ?? true;

  if (!taiKhoan || taiKhoan.length < 3 || taiKhoan.length > 120) {
    throw new LoiNghiepVu('Tài khoản / Email phải từ 3–120 ký tự.', 400);
  }
  if (!hoTen || hoTen.length > 120) {
    throw new LoiNghiepVu('Họ tên hiển thị bắt buộc (1–120 ký tự).', 400);
  }
  if (matKhau.length < 6) {
    throw new LoiNghiepVu('Mật khẩu phải có ít nhất 6 ký tự.', 400);
  }

  const trung = await sql`
    SELECT id FROM tai_khoan_quan_tri WHERE LOWER(tai_khoan) = ${taiKhoan} LIMIT 1
  `;
  if (trung.length > 0) {
    throw new LoiNghiepVu(`Tài khoản "${taiKhoan}" đã tồn tại trong hệ thống.`, 409);
  }

  const matKhauBam = await bamMatKhau(matKhau);
  const [moi] = await sql`
    INSERT INTO tai_khoan_quan_tri (tai_khoan, ho_ten, mat_khau_bam, vai_tro, kich_hoat)
    VALUES (${taiKhoan}, ${hoTen}, ${matKhauBam}, ${vaiTro}, ${kichHoat})
    RETURNING *
  `;

  const dto = mapTaiKhoan(moi);
  await ghiNhatKy(
    'tai_khoan.tao',
    dto.id,
    { taiKhoan: dto.taiKhoan, hoTen: dto.hoTen, vaiTro: dto.vaiTro },
    tacNhan,
  );
  return dto;
}

export async function capNhatTaiKhoanQuanTri(
  id: number,
  dauVao: {
    hoTen?: string;
    vaiTro?: VaiTroQuanTri;
    kichHoat?: boolean;
    matKhauMoi?: string;
  },
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<TaiKhoanQuanTriDto> {
  kiemTraQuyenSuperAdmin(tacNhan);

  const [hienTai] = await sql`SELECT * FROM tai_khoan_quan_tri WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy tài khoản quản trị.', 404);
  }

  const hoTen = dauVao.hoTen !== undefined ? dauVao.hoTen.trim() : String(hienTai.ho_ten);
  if (!hoTen || hoTen.length > 120) {
    throw new LoiNghiepVu('Họ tên hiển thị bắt buộc (1–120 ký tự).', 400);
  }

  const vaiTroMoi: VaiTroQuanTri =
    dauVao.vaiTro !== undefined
      ? dauVao.vaiTro === 'super_admin'
        ? 'super_admin'
        : 'admin'
      : hienTai.vai_tro === 'super_admin'
        ? 'super_admin'
        : 'admin';

  const kichHoatMoi =
    dauVao.kichHoat !== undefined ? Boolean(dauVao.kichHoat) : Boolean(hienTai.kich_hoat);

  // Bảo vệ: Không tự khóa hoặc tự hạ quyền chính mình
  if (tacNhan && tacNhan.id === id) {
    if (!kichHoatMoi) {
      throw new LoiNghiepVu('Bạn không thể tự khóa tài khoản đang đăng nhập của chính mình.', 409);
    }
    if (vaiTroMoi !== 'super_admin') {
      throw new LoiNghiepVu('Bạn không thể tự hạ quyền Super Admin của chính mình.', 409);
    }
  }

  // Bảo vệ: Luôn phải còn ít nhất 1 Super Admin đang hoạt động
  if (
    hienTai.vai_tro === 'super_admin' &&
    (vaiTroMoi !== 'super_admin' || !kichHoatMoi)
  ) {
    const [demSa] = await sql`
      SELECT COUNT(*)::int AS c
      FROM tai_khoan_quan_tri
      WHERE vai_tro = 'super_admin' AND kich_hoat = true AND id <> ${id}
    `;
    if (Number(demSa?.c ?? 0) === 0) {
      throw new LoiNghiepVu(
        'Hệ thống phải có ít nhất 1 Super Admin đang hoạt động.',
        409,
      );
    }
  }

  let matKhauBam = String(hienTai.mat_khau_bam);
  if (dauVao.matKhauMoi && dauVao.matKhauMoi.trim()) {
    if (dauVao.matKhauMoi.trim().length < 6) {
      throw new LoiNghiepVu('Mật khẩu mới phải có ít nhất 6 ký tự.', 400);
    }
    matKhauBam = await bamMatKhau(dauVao.matKhauMoi.trim());
  }

  const [capNhat] = await sql`
    UPDATE tai_khoan_quan_tri
    SET ho_ten = ${hoTen},
        vai_tro = ${vaiTroMoi},
        kich_hoat = ${kichHoatMoi},
        mat_khau_bam = ${matKhauBam},
        ngay_cap_nhat = now()
    WHERE id = ${id}
    RETURNING *
  `;

  const dto = mapTaiKhoan(capNhat);
  const hanhDongLog =
    dauVao.vaiTro !== undefined && dauVao.vaiTro !== hienTai.vai_tro
      ? 'tai_khoan.doi_vai_tro'
      : dauVao.kichHoat !== undefined && dauVao.kichHoat !== hienTai.kich_hoat
        ? 'tai_khoan.khoa_mo'
        : dauVao.matKhauMoi
          ? 'tai_khoan.doi_mat_khau'
          : 'tai_khoan.sua';

  await ghiNhatKy(
    hanhDongLog,
    id,
    {
      taiKhoan: dto.taiKhoan,
      hoTen: dto.hoTen,
      vaiTro: dto.vaiTro,
      kichHoat: dto.kichHoat,
      doiMatKhau: Boolean(dauVao.matKhauMoi),
    },
    tacNhan,
  );

  return dto;
}

export async function doiMatKhauCaNhan(
  tacNhan: ThongTinPhienAdmin,
  matKhauHienTai: string,
  matKhauMoi: string,
): Promise<void> {
  if (!matKhauMoi || matKhauMoi.trim().length < 6) {
    throw new LoiNghiepVu('Mật khẩu mới phải có ít nhất 6 ký tự.', 400);
  }
  const [hienTai] = await sql`
    SELECT * FROM tai_khoan_quan_tri WHERE id = ${tacNhan.id} LIMIT 1
  `;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy tài khoản của bạn.', 404);
  }
  const bamCu = await bamMatKhau(matKhauHienTai);
  if (bamCu !== String(hienTai.mat_khau_bam)) {
    throw new LoiNghiepVu('Mật khẩu hiện tại không đúng.', 400);
  }

  const bamMoi = await bamMatKhau(matKhauMoi.trim());
  await sql`
    UPDATE tai_khoan_quan_tri
    SET mat_khau_bam = ${bamMoi},
        ngay_cap_nhat = now()
    WHERE id = ${tacNhan.id}
  `;

  await ghiNhatKy(
    'tai_khoan.doi_mat_khau',
    tacNhan.id,
    { taiKhoan: tacNhan.taiKhoan, tuDoi: true },
    tacNhan,
  );
}

export async function xoaTaiKhoanQuanTri(
  id: number,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<void> {
  kiemTraQuyenSuperAdmin(tacNhan);

  if (tacNhan && tacNhan.id === id) {
    throw new LoiNghiepVu('Bạn không thể tự xóa tài khoản đang đăng nhập của chính mình.', 409);
  }

  const [hienTai] = await sql`SELECT * FROM tai_khoan_quan_tri WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy tài khoản quản trị.', 404);
  }

  if (hienTai.vai_tro === 'super_admin') {
    const [demSa] = await sql`
      SELECT COUNT(*)::int AS c
      FROM tai_khoan_quan_tri
      WHERE vai_tro = 'super_admin' AND kich_hoat = true AND id <> ${id}
    `;
    if (Number(demSa?.c ?? 0) === 0) {
      throw new LoiNghiepVu(
        'Không thể xóa Super Admin duy nhất đang hoạt động trong hệ thống.',
        409,
      );
    }
  }

  await sql`DELETE FROM tai_khoan_quan_tri WHERE id = ${id}`;
  await ghiNhatKy(
    'tai_khoan.xoa',
    id,
    { taiKhoan: String(hienTai.tai_khoan), vaiTro: String(hienTai.vai_tro) },
    tacNhan,
  );
}

// ============================================================================
// DANH MỤC BÀI VIẾT
// ============================================================================

export async function layDanhSachDanhMucAdmin(): Promise<DanhMucBaiVietDto[]> {
  const rows = await sql`
    SELECT
      dm.id,
      dm.ten,
      dm.slug,
      dm.mo_ta,
      dm.thu_tu,
      dm.hien,
      dm.ngay_tao,
      COUNT(bv.id)::int AS so_bai_viet
    FROM danh_muc_bai_viet dm
    LEFT JOIN bai_viet bv ON bv.danh_muc_id = dm.id AND bv.xoa_luc IS NULL
    GROUP BY dm.id
    ORDER BY dm.thu_tu ASC, dm.id ASC
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    ten: String(r.ten),
    slug: String(r.slug),
    moTa: r.mo_ta ? String(r.mo_ta) : null,
    thuTu: Number(r.thu_tu ?? 0),
    hien: Boolean(r.hien),
    ngayTao: isoHoacNull(r.ngay_tao) ?? new Date().toISOString(),
    soBaiViet: Number(r.so_bai_viet ?? 0),
  }));
}

export async function layDanhSachDanhMucCongKhai(): Promise<DanhMucBaiVietDto[]> {
  const rows = await sql`
    SELECT
      dm.id,
      dm.ten,
      dm.slug,
      dm.mo_ta,
      dm.thu_tu,
      dm.hien,
      dm.ngay_tao,
      COUNT(bv.id)::int AS so_bai_viet
    FROM danh_muc_bai_viet dm
    LEFT JOIN bai_viet bv
      ON bv.danh_muc_id = dm.id
     AND bv.trang_thai = 'dang'
     AND bv.xoa_luc IS NULL
    WHERE dm.hien = true
    GROUP BY dm.id
    ORDER BY dm.thu_tu ASC, dm.id ASC
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    ten: String(r.ten),
    slug: String(r.slug),
    moTa: r.mo_ta ? String(r.mo_ta) : null,
    thuTu: Number(r.thu_tu ?? 0),
    hien: Boolean(r.hien),
    ngayTao: isoHoacNull(r.ngay_tao) ?? new Date().toISOString(),
    soBaiViet: Number(r.so_bai_viet ?? 0),
  }));
}

export async function taoDanhMuc(
  dauVao: {
    ten: string;
    slug?: string;
    moTa?: string | null;
    thuTu?: number;
    hien?: boolean;
  },
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<DanhMucBaiVietDto> {
  const ten = (dauVao.ten ?? '').trim();
  if (!ten || ten.length > 120) {
    throw new LoiNghiepVu('Tên danh mục bắt buộc (1–120 ký tự).', 400);
  }

  let slug: string;
  if (dauVao.slug && dauVao.slug.trim()) {
    slug = dauVao.slug.trim().toLowerCase();
    if (!kiemTraSlugHopLe(slug)) {
      throw new LoiNghiepVu('Slug chỉ gồm chữ thường a-z, số 0-9 và dấu gạch ngang (-).', 400);
    }
    const trung = await sql`SELECT id FROM danh_muc_bai_viet WHERE slug = ${slug} LIMIT 1`;
    if (trung.length > 0) {
      throw new LoiNghiepVu(`Slug "${slug}" đã tồn tại.`, 409);
    }
  } else {
    slug = await slugDanhMucKhongTrung(ten);
  }

  const moTa = dauVao.moTa?.trim() || null;
  const thuTu = Number.isFinite(dauVao.thuTu) ? Number(dauVao.thuTu) : 0;
  const hien = dauVao.hien ?? true;

  const [moi] = await sql`
    INSERT INTO danh_muc_bai_viet (ten, slug, mo_ta, thu_tu, hien)
    VALUES (${ten}, ${slug}, ${moTa}, ${thuTu}, ${hien})
    RETURNING id, ten, slug, mo_ta, thu_tu, hien, ngay_tao
  `;

  await ghiNhatKy('danh_muc_bai_viet.tao', Number(moi.id), { ten, slug, thuTu, hien }, tacNhan);

  return {
    id: Number(moi.id),
    ten: String(moi.ten),
    slug: String(moi.slug),
    moTa: moi.mo_ta ? String(moi.mo_ta) : null,
    thuTu: Number(moi.thu_tu),
    hien: Boolean(moi.hien),
    ngayTao: isoHoacNull(moi.ngay_tao) ?? new Date().toISOString(),
    soBaiViet: 0,
  };
}

export async function capNhatDanhMuc(
  id: number,
  dauVao: {
    ten?: string;
    slug?: string;
    moTa?: string | null;
    thuTu?: number;
    hien?: boolean;
  },
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<DanhMucBaiVietDto> {
  const [hienTai] = await sql`SELECT * FROM danh_muc_bai_viet WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy danh mục bài viết.', 404);
  }

  const ten = dauVao.ten !== undefined ? dauVao.ten.trim() : String(hienTai.ten);
  if (!ten || ten.length > 120) {
    throw new LoiNghiepVu('Tên danh mục bắt buộc (1–120 ký tự).', 400);
  }

  let slug = String(hienTai.slug);
  if (dauVao.slug !== undefined && dauVao.slug.trim() !== slug) {
    slug = dauVao.slug.trim().toLowerCase();
    if (!kiemTraSlugHopLe(slug)) {
      throw new LoiNghiepVu('Slug chỉ gồm chữ thường a-z, số 0-9 và dấu gạch ngang (-).', 400);
    }
    const trung = await sql`
      SELECT id FROM danh_muc_bai_viet WHERE slug = ${slug} AND id <> ${id} LIMIT 1
    `;
    if (trung.length > 0) {
      throw new LoiNghiepVu(`Slug "${slug}" đã tồn tại.`, 409);
    }
  }

  const moTa =
    dauVao.moTa !== undefined ? dauVao.moTa?.trim() || null : (hienTai.mo_ta as string | null);
  const thuTu =
    dauVao.thuTu !== undefined && Number.isFinite(dauVao.thuTu)
      ? Number(dauVao.thuTu)
      : Number(hienTai.thu_tu);
  const hien = dauVao.hien !== undefined ? Boolean(dauVao.hien) : Boolean(hienTai.hien);

  const [capNhat] = await sql`
    UPDATE danh_muc_bai_viet
    SET ten = ${ten},
        slug = ${slug},
        mo_ta = ${moTa},
        thu_tu = ${thuTu},
        hien = ${hien}
    WHERE id = ${id}
    RETURNING id, ten, slug, mo_ta, thu_tu, hien, ngay_tao
  `;

  await ghiNhatKy('danh_muc_bai_viet.sua', id, { ten, slug, thuTu, hien }, tacNhan);

  const [dem] = await sql`
    SELECT COUNT(*)::int AS so_bai_viet FROM bai_viet WHERE danh_muc_id = ${id} AND xoa_luc IS NULL
  `;

  return {
    id: Number(capNhat.id),
    ten: String(capNhat.ten),
    slug: String(capNhat.slug),
    moTa: capNhat.mo_ta ? String(capNhat.mo_ta) : null,
    thuTu: Number(capNhat.thu_tu),
    hien: Boolean(capNhat.hien),
    ngayTao: isoHoacNull(capNhat.ngay_tao) ?? new Date().toISOString(),
    soBaiViet: Number(dem?.so_bai_viet ?? 0),
  };
}

export async function xoaDanhMuc(
  id: number,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<void> {
  const [hienTai] = await sql`SELECT id, ten FROM danh_muc_bai_viet WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy danh mục bài viết.', 404);
  }

  const [dem] = await sql`
    SELECT COUNT(*)::int AS c FROM bai_viet WHERE danh_muc_id = ${id}
  `;
  const soBai = Number(dem?.c ?? 0);
  if (soBai > 0) {
    throw new LoiNghiepVu(
      `Danh mục "${hienTai.ten}" còn ${soBai} bài viết, hãy chuyển bài sang danh mục khác trước khi xóa.`,
      409,
    );
  }

  await sql`DELETE FROM danh_muc_bai_viet WHERE id = ${id}`;
  await ghiNhatKy('danh_muc_bai_viet.xoa', id, { ten: String(hienTai.ten) }, tacNhan);
}

// ============================================================================
// BÀI VIẾT — QUẢN TRỊ (ADMIN)
// ============================================================================

export async function layThongKeBaiVietAdmin(): Promise<ThongKeBaiVietDto> {
  const [row] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE xoa_luc IS NULL)::int AS tat_ca,
      COUNT(*) FILTER (WHERE xoa_luc IS NULL AND trang_thai = 'dang')::int AS dang,
      COUNT(*) FILTER (WHERE xoa_luc IS NULL AND trang_thai = 'nhap')::int AS nhap,
      COUNT(*) FILTER (WHERE xoa_luc IS NULL AND trang_thai = 'an')::int AS an,
      COUNT(*) FILTER (WHERE xoa_luc IS NOT NULL)::int AS thung_rac
    FROM bai_viet
  `;
  return {
    tatCa: Number(row?.tat_ca ?? 0),
    dang: Number(row?.dang ?? 0),
    nhap: Number(row?.nhap ?? 0),
    an: Number(row?.an ?? 0),
    thungRac: Number(row?.thung_rac ?? 0),
  };
}

export async function layDanhSachBaiVietAdmin(thamSo: {
  tuKhoa?: string;
  danhMucId?: number;
  trangThai?: TrangThaiBaiViet;
  daXoa?: boolean;
  tuNgay?: string;
  denNgay?: string;
  sapXep?: 'cap_nhat' | 'ngay_dang' | 'tieu_de';
  trang?: number;
  kichThuoc?: number;
}): Promise<{
  items: TomTatBaiVietDto[];
  tong: number;
  trang: number;
  kichThuoc: number;
  thongKe: ThongKeBaiVietDto;
}> {
  const trang = Math.max(1, Number(thamSo.trang) || 1);
  const kichThuoc = Math.min(50, Math.max(1, Number(thamSo.kichThuoc) || 12));
  const offset = (trang - 1) * kichThuoc;
  const daXoa = Boolean(thamSo.daXoa);
  const tuKhoa = (thamSo.tuKhoa ?? '').trim();
  const mauTim = tuKhoa ? `%${tuKhoa}%` : null;
  const danhMucId =
    thamSo.danhMucId && Number.isFinite(thamSo.danhMucId) ? Number(thamSo.danhMucId) : null;
  const trangThai =
    thamSo.trangThai && ['nhap', 'dang', 'an'].includes(thamSo.trangThai)
      ? thamSo.trangThai
      : null;
  const tuNgay = thamSo.tuNgay ? new Date(thamSo.tuNgay) : null;
  const denNgay = thamSo.denNgay ? new Date(`${thamSo.denNgay}T23:59:59.999Z`) : null;
  const sapXep = thamSo.sapXep ?? 'cap_nhat';

  const orderClause =
    sapXep === 'ngay_dang'
      ? sql`bv.ngay_dang DESC NULLS LAST, bv.id DESC`
      : sapXep === 'tieu_de'
        ? sql`bv.tieu_de ASC, bv.id DESC`
        : sql`bv.ngay_cap_nhat DESC, bv.id DESC`;

  const rows = await sql`
    SELECT
      bv.id,
      bv.tieu_de,
      bv.slug,
      bv.danh_muc_id,
      dm.ten AS ten_danh_muc,
      dm.slug AS slug_danh_muc,
      dm.hien AS danh_muc_hien,
      bv.mo_ta_ngan,
      bv.anh_bia,
      bv.trang_thai,
      bv.ngay_dang,
      bv.tao_boi_ai,
      bv.tac_gia,
      bv.noi_bat,
      bv.luot_xem,
      bv.ngay_tao,
      bv.ngay_cap_nhat,
      bv.xoa_luc
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE
      (${daXoa}::boolean = true AND bv.xoa_luc IS NOT NULL OR ${daXoa}::boolean = false AND bv.xoa_luc IS NULL)
      AND (${mauTim}::text IS NULL OR bv.tieu_de ILIKE ${mauTim} OR bv.slug ILIKE ${mauTim})
      AND (${danhMucId}::bigint IS NULL OR bv.danh_muc_id = ${danhMucId})
      AND (${trangThai}::text IS NULL OR bv.trang_thai = ${trangThai})
      AND (${tuNgay ? tuNgay.toISOString() : null}::timestamptz IS NULL OR COALESCE(bv.ngay_dang, bv.ngay_tao) >= ${tuNgay ? tuNgay.toISOString() : null}::timestamptz)
      AND (${denNgay ? denNgay.toISOString() : null}::timestamptz IS NULL OR COALESCE(bv.ngay_dang, bv.ngay_tao) <= ${denNgay ? denNgay.toISOString() : null}::timestamptz)
    ORDER BY ${orderClause}
    LIMIT ${kichThuoc}
    OFFSET ${offset}
  `;

  const [dem] = await sql`
    SELECT COUNT(*)::int AS tong
    FROM bai_viet bv
    WHERE
      (${daXoa}::boolean = true AND bv.xoa_luc IS NOT NULL OR ${daXoa}::boolean = false AND bv.xoa_luc IS NULL)
      AND (${mauTim}::text IS NULL OR bv.tieu_de ILIKE ${mauTim} OR bv.slug ILIKE ${mauTim})
      AND (${danhMucId}::bigint IS NULL OR bv.danh_muc_id = ${danhMucId})
      AND (${trangThai}::text IS NULL OR bv.trang_thai = ${trangThai})
      AND (${tuNgay ? tuNgay.toISOString() : null}::timestamptz IS NULL OR COALESCE(bv.ngay_dang, bv.ngay_tao) >= ${tuNgay ? tuNgay.toISOString() : null}::timestamptz)
      AND (${denNgay ? denNgay.toISOString() : null}::timestamptz IS NULL OR COALESCE(bv.ngay_dang, bv.ngay_tao) <= ${denNgay ? denNgay.toISOString() : null}::timestamptz)
  `;

  const thongKe = await layThongKeBaiVietAdmin();

  return {
    items: rows.map(mapTomTat),
    tong: Number(dem?.tong ?? 0),
    trang,
    kichThuoc,
    thongKe,
  };
}

export async function layChiTietBaiVietAdmin(id: number): Promise<ChiTietBaiVietDto> {
  const [row] = await sql`
    SELECT
      bv.*,
      dm.ten AS ten_danh_muc,
      dm.slug AS slug_danh_muc,
      dm.hien AS danh_muc_hien
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.id = ${id}
    LIMIT 1
  `;
  if (!row) {
    throw new LoiNghiepVu('Không tìm thấy bài viết.', 404);
  }
  return mapChiTiet(row);
}

export interface DauVaoLuuBaiViet {
  tieuDe: string;
  slug?: string;
  danhMucId: number;
  moTaNgan?: string | null;
  anhBia?: string | null;
  noiDungHtml?: string;
  trangThai?: TrangThaiBaiViet;
  tacGia?: string;
  noiBat?: boolean;
  taoBoiAi?: boolean;
}

export async function taoBaiViet(
  dauVao: DauVaoLuuBaiViet,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<{
  baiViet: ChiTietBaiVietDto;
  canhBao: { theBiLoai: number; thuocTinhBiLoai: number };
}> {
  const tieuDe = (dauVao.tieuDe ?? '').trim();
  if (!tieuDe || tieuDe.length > 200) {
    throw new LoiNghiepVu('Tiêu đề bài viết bắt buộc (1–200 ký tự).', 400);
  }

  const danhMucId = Number(dauVao.danhMucId);
  const [dm] = await sql`SELECT id FROM danh_muc_bai_viet WHERE id = ${danhMucId} LIMIT 1`;
  if (!dm) {
    throw new LoiNghiepVu('Danh mục bài viết không tồn tại.', 400);
  }

  let slug: string;
  if (dauVao.slug && dauVao.slug.trim()) {
    slug = dauVao.slug.trim().toLowerCase();
    if (!kiemTraSlugHopLe(slug)) {
      if (dauVao.trangThai === 'nhap') {
        slug = await slugBaiVietKhongTrung(tieuDe);
      } else {
        throw new LoiNghiepVu('Slug chỉ gồm chữ thường a-z, số 0-9 và dấu gạch ngang (-).', 400);
      }
    } else {
      const trung = await sql`SELECT id FROM bai_viet WHERE slug = ${slug} LIMIT 1`;
      if (trung.length > 0) {
        if (dauVao.trangThai === 'nhap') {
          slug = await slugBaiVietKhongTrung(slug);
        } else {
          throw new LoiNghiepVu(`Slug "${slug}" đã được dùng cho bài viết khác.`, 409);
        }
      }
    }
  } else {
    slug = await slugBaiVietKhongTrung(tieuDe);
  }

  const moTaNgan = dauVao.moTaNgan?.trim() ? dauVao.moTaNgan.trim().slice(0, 400) : null;
  const anhBia = dauVao.anhBia?.trim() || null;
  const trangThai: TrangThaiBaiViet =
    dauVao.trangThai && ['nhap', 'dang', 'an'].includes(dauVao.trangThai)
      ? dauVao.trangThai
      : 'nhap';
  const tacGia = dauVao.tacGia?.trim() || tacNhan?.hoTen || 'Ban Biên Tập Nếp Hiên';
  const noiBat = Boolean(dauVao.noiBat);
  const taoBoiAi = Boolean(dauVao.taoBoiAi);

  const ketQuaSach = lamSachHtml(dauVao.noiDungHtml ?? '');
  const { html: noiDungHtml, mucLuc } = rutMucLuc(ketQuaSach.html);
  const ngayDang = trangThai === 'dang' ? new Date().toISOString() : null;

  const [moi] = await sql`
    INSERT INTO bai_viet (
      tieu_de,
      slug,
      danh_muc_id,
      mo_ta_ngan,
      anh_bia,
      noi_dung_html,
      muc_luc,
      trang_thai,
      ngay_dang,
      tao_boi_ai,
      tac_gia,
      noi_bat
    ) VALUES (
      ${tieuDe},
      ${slug},
      ${danhMucId},
      ${moTaNgan},
      ${anhBia},
      ${noiDungHtml},
      ${sql.json(mucLuc as never)},
      ${trangThai},
      ${ngayDang},
      ${taoBoiAi},
      ${tacGia},
      ${noiBat}
    )
    RETURNING id
  `;

  await ghiNhatKy('bai_viet.tao', Number(moi.id), { tieuDe, slug, trangThai }, tacNhan);
  const baiViet = await layChiTietBaiVietAdmin(Number(moi.id));

  return {
    baiViet,
    canhBao: {
      theBiLoai: ketQuaSach.theBiLoai,
      thuocTinhBiLoai: ketQuaSach.thuocTinhBiLoai,
    },
  };
}

export async function capNhatBaiViet(
  id: number,
  dauVao: Partial<DauVaoLuuBaiViet>,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<{
  baiViet: ChiTietBaiVietDto;
  canhBao: { theBiLoai: number; thuocTinhBiLoai: number };
}> {
  const [hienTai] = await sql`SELECT * FROM bai_viet WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy bài viết.', 404);
  }
  if (hienTai.xoa_luc) {
    throw new LoiNghiepVu('Bài viết đang ở trong thùng rác, hãy khôi phục trước khi chỉnh sửa.', 409);
  }

  const tieuDe = dauVao.tieuDe !== undefined ? dauVao.tieuDe.trim() : String(hienTai.tieu_de);
  if (!tieuDe || tieuDe.length > 200) {
    throw new LoiNghiepVu('Tiêu đề bài viết bắt buộc (1–200 ký tự).', 400);
  }

  const danhMucId =
    dauVao.danhMucId !== undefined ? Number(dauVao.danhMucId) : Number(hienTai.danh_muc_id);
  const [dm] = await sql`SELECT id FROM danh_muc_bai_viet WHERE id = ${danhMucId} LIMIT 1`;
  if (!dm) {
    throw new LoiNghiepVu('Danh mục bài viết không tồn tại.', 400);
  }

  let slug = String(hienTai.slug);
  if (dauVao.slug !== undefined && dauVao.slug.trim() !== slug) {
    slug = dauVao.slug.trim().toLowerCase();
    if (!kiemTraSlugHopLe(slug)) {
      throw new LoiNghiepVu('Slug chỉ gồm chữ thường a-z, số 0-9 và dấu gạch ngang (-).', 400);
    }
    const trung = await sql`SELECT id FROM bai_viet WHERE slug = ${slug} AND id <> ${id} LIMIT 1`;
    if (trung.length > 0) {
      throw new LoiNghiepVu(`Slug "${slug}" đã được dùng cho bài viết khác.`, 409);
    }
  }

  const moTaNgan =
    dauVao.moTaNgan !== undefined
      ? dauVao.moTaNgan?.trim()
        ? dauVao.moTaNgan.trim().slice(0, 400)
        : null
      : (hienTai.mo_ta_ngan as string | null);

  const anhBia =
    dauVao.anhBia !== undefined ? dauVao.anhBia?.trim() || null : (hienTai.anh_bia as string | null);

  const trangThai: TrangThaiBaiViet =
    dauVao.trangThai && ['nhap', 'dang', 'an'].includes(dauVao.trangThai)
      ? dauVao.trangThai
      : (hienTai.trang_thai as TrangThaiBaiViet);

  const tacGia =
    dauVao.tacGia !== undefined
      ? dauVao.tacGia.trim() || 'Ban Biên Tập Nếp Hiên'
      : String(hienTai.tac_gia ?? 'Ban Biên Tập Nếp Hiên');

  const noiBat = dauVao.noiBat !== undefined ? Boolean(dauVao.noiBat) : Boolean(hienTai.noi_bat);

  let noiDungHtml = String(hienTai.noi_dung_html ?? '');
  let mucLuc = chuanHoaMucLuc(hienTai.muc_luc);
  let canhBao = { theBiLoai: 0, thuocTinhBiLoai: 0 };

  if (dauVao.noiDungHtml !== undefined) {
    const ketQuaSach = lamSachHtml(dauVao.noiDungHtml);
    const rut = rutMucLuc(ketQuaSach.html);
    noiDungHtml = rut.html;
    mucLuc = rut.mucLuc;
    canhBao = {
      theBiLoai: ketQuaSach.theBiLoai,
      thuocTinhBiLoai: ketQuaSach.thuocTinhBiLoai,
    };
  }

  await sql`
    UPDATE bai_viet
    SET tieu_de = ${tieuDe},
        slug = ${slug},
        danh_muc_id = ${danhMucId},
        mo_ta_ngan = ${moTaNgan},
        anh_bia = ${anhBia},
        noi_dung_html = ${noiDungHtml},
        muc_luc = ${sql.json(mucLuc as never)},
        trang_thai = ${trangThai},
        ngay_dang = CASE
          WHEN ${trangThai} = 'dang' THEN COALESCE(ngay_dang, now())
          ELSE ngay_dang
        END,
        tac_gia = ${tacGia},
        noi_bat = ${noiBat},
        ngay_cap_nhat = now()
    WHERE id = ${id}
  `;

  await ghiNhatKy('bai_viet.sua', id, { tieuDe, slug, trangThai }, tacNhan);
  const baiViet = await layChiTietBaiVietAdmin(id);

  return { baiViet, canhBao };
}

export async function doiTrangThaiBaiViet(
  id: number,
  trangThai: TrangThaiBaiViet,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<ChiTietBaiVietDto> {
  if (!['nhap', 'dang', 'an'].includes(trangThai)) {
    throw new LoiNghiepVu('Trạng thái không hợp lệ.', 400);
  }
  const [hienTai] = await sql`
    SELECT id, tieu_de, trang_thai, xoa_luc FROM bai_viet WHERE id = ${id} LIMIT 1
  `;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy bài viết.', 404);
  }
  if (hienTai.xoa_luc) {
    throw new LoiNghiepVu('Không thể đổi trạng thái bài viết đang trong thùng rác.', 409);
  }

  await sql`
    UPDATE bai_viet
    SET trang_thai = ${trangThai},
        ngay_dang = CASE
          WHEN ${trangThai} = 'dang' THEN COALESCE(ngay_dang, now())
          ELSE ngay_dang
        END,
        ngay_cap_nhat = now()
    WHERE id = ${id}
  `;

  await ghiNhatKy(
    'bai_viet.doi_trang_thai',
    id,
    {
      tieuDe: String(hienTai.tieu_de),
      tu: String(hienTai.trang_thai),
      sang: trangThai,
    },
    tacNhan,
  );

  return layChiTietBaiVietAdmin(id);
}

export async function xoaMemBaiViet(
  id: number,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<void> {
  const [hienTai] = await sql`SELECT id, tieu_de, xoa_luc FROM bai_viet WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy bài viết.', 404);
  }
  if (!hienTai.xoa_luc) {
    await sql`
      UPDATE bai_viet
      SET xoa_luc = now(),
          ngay_cap_nhat = now()
      WHERE id = ${id}
    `;
    await ghiNhatKy('bai_viet.xoa', id, { tieuDe: String(hienTai.tieu_de) }, tacNhan);
  }
}

export async function khoiPhucBaiViet(
  id: number,
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<ChiTietBaiVietDto> {
  const [hienTai] = await sql`SELECT id, tieu_de, xoa_luc FROM bai_viet WHERE id = ${id} LIMIT 1`;
  if (!hienTai) {
    throw new LoiNghiepVu('Không tìm thấy bài viết.', 404);
  }
  if (!hienTai.xoa_luc) {
    throw new LoiNghiepVu('Bài viết không nằm trong thùng rác.', 409);
  }

  await sql`
    UPDATE bai_viet
    SET xoa_luc = NULL,
        trang_thai = 'nhap',
        ngay_cap_nhat = now()
    WHERE id = ${id}
  `;

  await ghiNhatKy('bai_viet.khoi_phuc', id, { tieuDe: String(hienTai.tieu_de) }, tacNhan);
  return layChiTietBaiVietAdmin(id);
}

export async function layNhatKyBaiViet(thamSo?: {
  nhom?: string;
  tuKhoa?: string;
  gioiHan?: number;
}): Promise<NhatKyBaiVietDto[]> {
  const gioiHan = Math.min(100, Math.max(1, thamSo?.gioiHan ?? 50));
  const nhom = (thamSo?.nhom ?? '').trim();
  const mauNhom = nhom ? `${nhom}.%` : null;
  const tuKhoa = (thamSo?.tuKhoa ?? '').trim();
  const mauTim = tuKhoa ? `%${tuKhoa}%` : null;

  const rows = await sql`
    SELECT
      id,
      hanh_dong,
      doi_tuong_id,
      nguoi_thuc_hien_id,
      tai_khoan_thuc_hien,
      vai_tro_thuc_hien,
      chi_tiet,
      ngay_tao
    FROM nhat_ky_bai_viet
    WHERE
      (${mauNhom}::text IS NULL OR hanh_dong LIKE ${mauNhom})
      AND (
        ${mauTim}::text IS NULL
        OR hanh_dong ILIKE ${mauTim}
        OR COALESCE(tai_khoan_thuc_hien, '') ILIKE ${mauTim}
        OR chi_tiet::text ILIKE ${mauTim}
      )
    ORDER BY ngay_tao DESC, id DESC
    LIMIT ${gioiHan}
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    hanhDong: String(r.hanh_dong),
    doiTuongId: r.doi_tuong_id ? Number(r.doi_tuong_id) : null,
    nguoiThucHienId: r.nguoi_thuc_hien_id ? Number(r.nguoi_thuc_hien_id) : null,
    taiKhoanThucHien: r.tai_khoan_thuc_hien ? String(r.tai_khoan_thuc_hien) : null,
    vaiTroThucHien:
      r.vai_tro_thuc_hien === 'super_admin'
        ? 'super_admin'
        : r.vai_tro_thuc_hien === 'admin'
          ? 'admin'
          : null,
    chiTiet:
      typeof r.chi_tiet === 'object' && r.chi_tiet !== null
        ? (r.chi_tiet as Record<string, unknown>)
        : {},
    ngayTao: isoHoacNull(r.ngay_tao) ?? new Date().toISOString(),
  }));
}

// ============================================================================
// BÀI VIẾT — MẶT TIỀN CÔNG KHAI (STOREFRONT)
// ============================================================================

export async function layDanhSachBaiVietCongKhai(thamSo: {
  danhMuc?: string;
  tuKhoa?: string;
  trang?: number;
  kichThuoc?: number;
}): Promise<{
  items: TomTatBaiVietDto[];
  baiNoiBat: TomTatBaiVietDto | null;
  danhMuc: DanhMucBaiVietDto[];
  tong: number;
  trang: number;
  kichThuoc: number;
}> {
  const trang = Math.max(1, Number(thamSo.trang) || 1);
  const kichThuoc = Math.min(24, Math.max(1, Number(thamSo.kichThuoc) || 9));
  const offset = (trang - 1) * kichThuoc;
  const slugDanhMuc = (thamSo.danhMuc ?? '').trim().toLowerCase() || null;
  const tuKhoa = (thamSo.tuKhoa ?? '').trim();
  const mauTim = tuKhoa ? `%${tuKhoa}%` : null;

  const danhMuc = await layDanhSachDanhMucCongKhai();

  const rows = await sql`
    SELECT
      bv.id,
      bv.tieu_de,
      bv.slug,
      bv.danh_muc_id,
      dm.ten AS ten_danh_muc,
      dm.slug AS slug_danh_muc,
      dm.hien AS danh_muc_hien,
      bv.mo_ta_ngan,
      bv.anh_bia,
      bv.trang_thai,
      bv.ngay_dang,
      bv.tao_boi_ai,
      bv.tac_gia,
      bv.noi_bat,
      bv.luot_xem,
      bv.ngay_tao,
      bv.ngay_cap_nhat,
      bv.xoa_luc
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.trang_thai = 'dang'
      AND bv.xoa_luc IS NULL
      AND dm.hien = true
      AND (${slugDanhMuc}::text IS NULL OR dm.slug = ${slugDanhMuc})
      AND (${mauTim}::text IS NULL OR bv.tieu_de ILIKE ${mauTim} OR bv.mo_ta_ngan ILIKE ${mauTim})
    ORDER BY bv.noi_bat DESC, bv.ngay_dang DESC NULLS LAST, bv.id DESC
    LIMIT ${kichThuoc}
    OFFSET ${offset}
  `;

  const [dem] = await sql`
    SELECT COUNT(*)::int AS tong
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.trang_thai = 'dang'
      AND bv.xoa_luc IS NULL
      AND dm.hien = true
      AND (${slugDanhMuc}::text IS NULL OR dm.slug = ${slugDanhMuc})
      AND (${mauTim}::text IS NULL OR bv.tieu_de ILIKE ${mauTim} OR bv.mo_ta_ngan ILIKE ${mauTim})
  `;

  const items = rows.map(mapTomTat);
  const baiNoiBat = items.find((b) => b.noiBat) ?? items[0] ?? null;

  return {
    items,
    baiNoiBat,
    danhMuc,
    tong: Number(dem?.tong ?? 0),
    trang,
    kichThuoc,
  };
}

export async function layChiTietBaiVietCongKhai(slug: string): Promise<{
  baiViet: ChiTietBaiVietDto;
  lienQuan: TomTatBaiVietDto[];
} | null> {
  const s = (slug ?? '').trim().toLowerCase();
  if (!s) return null;

  const [row] = await sql`
    SELECT
      bv.*,
      dm.ten AS ten_danh_muc,
      dm.slug AS slug_danh_muc,
      dm.hien AS danh_muc_hien
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.slug = ${s}
      AND bv.trang_thai = 'dang'
      AND bv.xoa_luc IS NULL
      AND dm.hien = true
    LIMIT 1
  `;

  if (!row) return null;

  sql`UPDATE bai_viet SET luot_xem = luot_xem + 1 WHERE id = ${row.id}`.catch(() => {});

  const baiViet = mapChiTiet(row);

  const rowsLienQuan = await sql`
    SELECT
      bv.id,
      bv.tieu_de,
      bv.slug,
      bv.danh_muc_id,
      dm.ten AS ten_danh_muc,
      dm.slug AS slug_danh_muc,
      dm.hien AS danh_muc_hien,
      bv.mo_ta_ngan,
      bv.anh_bia,
      bv.trang_thai,
      bv.ngay_dang,
      bv.tao_boi_ai,
      bv.tac_gia,
      bv.noi_bat,
      bv.luot_xem,
      bv.ngay_tao,
      bv.ngay_cap_nhat,
      bv.xoa_luc
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.trang_thai = 'dang'
      AND bv.xoa_luc IS NULL
      AND dm.hien = true
      AND bv.id <> ${baiViet.id}
      AND bv.danh_muc_id = ${baiViet.danhMucId}
    ORDER BY bv.ngay_dang DESC NULLS LAST, bv.id DESC
    LIMIT 3
  `;

  return {
    baiViet,
    lienQuan: rowsLienQuan.map(mapTomTat),
  };
}

export async function layBaiVietSitemap(): Promise<
  Array<{ slug: string; ngayCapNhat: string }>
> {
  const rows = await sql`
    SELECT bv.slug, COALESCE(bv.ngay_cap_nhat, bv.ngay_dang, bv.ngay_tao) AS cap_nhat
    FROM bai_viet bv
    INNER JOIN danh_muc_bai_viet dm ON dm.id = bv.danh_muc_id
    WHERE bv.trang_thai = 'dang'
      AND bv.xoa_luc IS NULL
      AND dm.hien = true
    ORDER BY bv.ngay_dang DESC NULLS LAST
    LIMIT 5000
  `;
  return rows.map((r) => ({
    slug: String(r.slug),
    ngayCapNhat: isoHoacNull(r.cap_nhat) ?? new Date().toISOString(),
  }));
}

// ============================================================================
// ẢNH BÀI VIẾT (LƯU TRONG NEON POSTGRESQL)
// ============================================================================

export async function luuAnhBaiViet(
  dauVao: {
    tenFile: string;
    mimeType: string;
    duLieu: Buffer;
  },
  tacNhan?: ThongTinPhienAdmin | null,
): Promise<{ url: string; tenFile: string }> {
  const [moi] = await sql`
    INSERT INTO anh_bai_viet (ten_file, mime_type, kich_thuoc, du_lieu)
    VALUES (${dauVao.tenFile}, ${dauVao.mimeType}, ${dauVao.duLieu.length}, ${dauVao.duLieu})
    RETURNING id
  `;
  await ghiNhatKy(
    'anh_bai_viet.tai_len',
    Number(moi.id),
    { tenFile: dauVao.tenFile, kichThuoc: dauVao.duLieu.length },
    tacNhan,
  );
  return {
    url: `/anh/${dauVao.tenFile}`,
    tenFile: dauVao.tenFile,
  };
}

export async function layAnhBaiViet(
  tenFile: string,
): Promise<{ mimeType: string; duLieu: Buffer } | null> {
  const [row] = await sql`
    SELECT mime_type, du_lieu FROM anh_bai_viet WHERE ten_file = ${tenFile} LIMIT 1
  `;
  if (!row) return null;
  return {
    mimeType: String(row.mime_type),
    duLieu: Buffer.from(row.du_lieu as Uint8Array),
  };
}
