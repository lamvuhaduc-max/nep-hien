'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { ThongTinPhienAdmin } from '@/lib/auth-admin';
import {
  DanhMucBaiVietDto,
  NhatKyBaiVietDto,
  TaiKhoanQuanTriDto,
  ThongKeBaiVietDto,
  TomTatBaiVietDto,
  TrangThaiBaiViet,
} from '@/lib/content/bai-viet-service';
import { TabDanhMuc } from './_TabDanhMuc';
import { TabTaiKhoan } from './_TabTaiKhoan';
import { TabTuVan } from './_TabTuVan';
import { AdminSidebar, TabQuanTri } from './_AdminSidebar';
import { docNhapCucBo, khoaNhapCucBo, xoaNhapCucBo } from './_nhap-cuc-bo';

type BoLocTab = 'tat_ca' | 'dang' | 'nhap' | 'an' | 'thung_rac';

function dinhDangNgay(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

const NHAN_HANH_DONG: Record<string, { nhan: string; mau: string; nen: string }> = {
  'bai_viet.tao': { nhan: 'Tạo bài viết mới', mau: '#137333', nen: '#e6f4ea' },
  'bai_viet.sua': { nhan: 'Cập nhật bài viết', mau: '#1a0dab', nen: '#e8f0fe' },
  'bai_viet.doi_trang_thai': { nhan: 'Đổi trạng thái bài viết', mau: '#b06000', nen: '#fef7e0' },
  'bai_viet.xoa': { nhan: 'Xóa bài vào thùng rác', mau: '#c5221f', nen: '#fce8e6' },
  'bai_viet.khoi_phuc': { nhan: 'Khôi phục bài viết', mau: '#137333', nen: '#e6f4ea' },
  'danh_muc_bai_viet.tao': { nhan: 'Thêm danh mục', mau: '#137333', nen: '#e6f4ea' },
  'danh_muc_bai_viet.sua': { nhan: 'Cập nhật danh mục', mau: '#1a0dab', nen: '#e8f0fe' },
  'danh_muc_bai_viet.xoa': { nhan: 'Xóa danh mục', mau: '#c5221f', nen: '#fce8e6' },
  'yeu_cau_tu_van.tiep_nhan': { nhan: 'Tiếp nhận yêu cầu tư vấn', mau: '#b33c14', nen: '#fdebe4' },
  'yeu_cau_tu_van.cap_nhat': { nhan: 'Cập nhật hồ sơ tư vấn', mau: '#1a0dab', nen: '#e8f0fe' },
  'yeu_cau_tu_van.xoa': { nhan: 'Xóa yêu cầu tư vấn', mau: '#c5221f', nen: '#fce8e6' },
  'tai_khoan.tao': { nhan: 'Tạo tài khoản quản trị', mau: '#137333', nen: '#e6f4ea' },
  'tai_khoan.sua': { nhan: 'Sửa thông tin tài khoản', mau: '#1a0dab', nen: '#e8f0fe' },
  'tai_khoan.doi_vai_tro': { nhan: 'Thay đổi vai trò (Role)', mau: '#b06000', nen: '#fef7e0' },
  'tai_khoan.khoa_mo': { nhan: 'Khóa / Mở khóa tài khoản', mau: '#b06000', nen: '#fef7e0' },
  'tai_khoan.doi_mat_khau': { nhan: 'Đổi mật khẩu tài khoản', mau: '#1a0dab', nen: '#e8f0fe' },
  'tai_khoan.xoa': { nhan: 'Xóa tài khoản quản trị', mau: '#c5221f', nen: '#fce8e6' },
  'he_thong.dang_nhap': { nhan: 'Đăng nhập thành công', mau: '#137333', nen: '#e6f4ea' },
  'he_thong.dang_xuat': { nhan: 'Đăng xuất hệ thống', mau: '#5f6368', nen: '#f1f3f4' },
  'he_thong.dang_nhap_that_bai': { nhan: 'Đăng nhập thất bại', mau: '#c5221f', nen: '#fce8e6' },
  'anh_bai_viet.tai_len': { nhan: 'Tải ảnh lên máy chủ', mau: '#1a0dab', nen: '#e8f0fe' },
};

export function QuanLyBaiViet() {
  const [tabChinh, setTabChinh] = useState<TabQuanTri>('bai_viet');
  const [boLocTab, setBoLocTab] = useState<BoLocTab>('tat_ca');

  const [nguoiDungHienTai, setNguoiDungHienTai] = useState<ThongTinPhienAdmin | null>(null);

  const [tuKhoa, setTuKhoa] = useState('');
  const [danhMucId, setDanhMucId] = useState<string>('');
  const [tuNgay, setTuNgay] = useState('');
  const [denNgay, setDenNgay] = useState('');
  const [sapXep, setSapXep] = useState<'cap_nhat' | 'ngay_dang' | 'tieu_de'>('cap_nhat');
  const [trang, setTrang] = useState(1);

  const [danhSach, setDanhSach] = useState<TomTatBaiVietDto[]>([]);
  const [danhMuc, setDanhMuc] = useState<DanhMucBaiVietDto[]>([]);
  const [soTuVan, setSoTuVan] = useState<number>(0);
  const [taiKhoanList, setTaiKhoanList] = useState<TaiKhoanQuanTriDto[]>([]);
  const [nhatKy, setNhatKy] = useState<NhatKyBaiVietDto[]>([]);
  const [nhomNhatKy, setNhomNhatKy] = useState<string>('');
  const [tuKhoaNhatKy, setTuKhoaNhatKy] = useState<string>('');

  const [tong, setTong] = useState(0);
  const [kichThuoc] = useState(10);
  const [thongKe, setThongKe] = useState<ThongKeBaiVietDto>({
    tatCa: 0,
    dang: 0,
    nhap: 0,
    an: 0,
    thungRac: 0,
  });
  const [dangTai, setDangTai] = useState(true);
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null);

  const taiPhienHienTai = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setNguoiDungHienTai(data);
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  const taiDanhMuc = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/article-categories', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setDanhMuc(Array.isArray(data) ? data : []);
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  const taiThongKeTuVan = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/consultations?kichThuoc=1', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data?.thongKe && typeof data.thongKe.tatCa === 'number') {
          setSoTuVan(data.thongKe.tatCa);
        }
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  const taiTaiKhoan = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/accounts', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setTaiKhoanList(Array.isArray(data) ? data : []);
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  const taiBaiViet = useCallback(async () => {
    setDangTai(true);
    try {
      const khoaMoi = khoaNhapCucBo('moi');
      const nhapChuaLuu = docNhapCucBo(khoaMoi);
      if (nhapChuaLuu) {
        xoaNhapCucBo(khoaMoi);
        const tieuDeTuDong =
          nhapChuaLuu.tieuDe.trim() ||
          `Bản nháp bài viết (${new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          })} ${new Date().toLocaleDateString('vi-VN')})`;
        await fetch('/api/v1/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tieuDe: tieuDeTuDong,
            slug:
              nhapChuaLuu.slugTuSua && nhapChuaLuu.slug.trim()
                ? nhapChuaLuu.slug.trim()
                : undefined,
            danhMucId: Number(nhapChuaLuu.danhMucId) || 1,
            moTaNgan: nhapChuaLuu.moTaNgan.trim() || null,
            anhBia: nhapChuaLuu.anhBia.trim() || null,
            noiDungHtml: nhapChuaLuu.noiDungHtml,
            trangThai: 'nhap',
            tacGia: nhapChuaLuu.tacGia.trim() || 'Ban Biên Tập Nếp Hiên',
            noiBat: nhapChuaLuu.noiBat,
          }),
        }).catch(() => {});
      }

      const params = new URLSearchParams();
      if (tuKhoa.trim()) params.set('tuKhoa', tuKhoa.trim());
      if (danhMucId) params.set('danhMucId', danhMucId);
      if (boLocTab === 'thung_rac') {
        params.set('daXoa', 'true');
      } else if (boLocTab !== 'tat_ca') {
        params.set('trangThai', boLocTab);
      }
      if (tuNgay) params.set('tuNgay', tuNgay);
      if (denNgay) params.set('denNgay', denNgay);
      params.set('sapXep', sapXep);
      params.set('trang', String(trang));
      params.set('kichThuoc', String(kichThuoc));

      const res = await fetch(`/api/v1/admin/articles?${params.toString()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setDanhSach(data.items ?? []);
        setTong(data.tong ?? 0);
        if (data.thongKe) setThongKe(data.thongKe);
      }
    } finally {
      setDangTai(false);
    }
  }, [tuKhoa, danhMucId, boLocTab, tuNgay, denNgay, sapXep, trang, kichThuoc]);

  const taiNhatKy = useCallback(async () => {
    try {
      const sp = new URLSearchParams();
      if (nhomNhatKy) sp.set('nhom', nhomNhatKy);
      if (tuKhoaNhatKy.trim()) sp.set('tuKhoa', tuKhoaNhatKy.trim());
      sp.set('gioiHan', '60');
      const res = await fetch(`/api/v1/admin/article-logs?${sp.toString()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setNhatKy(Array.isArray(data) ? data : []);
      }
    } catch {
      // Bỏ qua
    }
  }, [nhomNhatKy, tuKhoaNhatKy]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get('tab');
      if (
        t === 'bai_viet' ||
        t === 'danh_muc' ||
        t === 'tu_van' ||
        t === 'tai_khoan' ||
        t === 'nhat_ky'
      ) {
        setTabChinh(t);
      }
    }
    taiPhienHienTai();
    taiDanhMuc();
    taiThongKeTuVan();
    taiTaiKhoan();
  }, [taiPhienHienTai, taiDanhMuc, taiThongKeTuVan, taiTaiKhoan]);

  useEffect(() => {
    taiBaiViet();
  }, [taiBaiViet]);

  useEffect(() => {
    if (tabChinh === 'nhat_ky') {
      taiNhatKy();
    }
  }, [tabChinh, taiNhatKy]);

  async function doiTrangThaiNhanh(bv: TomTatBaiVietDto, trangThaiMoi: TrangThaiBaiViet) {
    setThongBao(null);
    const res = await fetch(`/api/v1/admin/articles/${bv.id}/trang-thai`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trangThai: trangThaiMoi }),
    });
    const data = await res.json();
    if (!res.ok) {
      setThongBao({ loai: 'loi', chu: data.message || 'Không thể đổi trạng thái.' });
    } else {
      const nhan =
        trangThaiMoi === 'dang'
          ? 'Đã đăng công khai'
          : trangThaiMoi === 'an'
            ? 'Đã tạm ẩn'
            : 'Đã chuyển về bản nháp';
      setThongBao({ loai: 'ok', chu: `${nhan}: "${bv.tieuDe}".` });
      taiBaiViet();
    }
  }

  async function xoaVaoThungRac(bv: TomTatBaiVietDto) {
    setThongBao(null);
    const res = await fetch(`/api/v1/admin/articles/${bv.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setThongBao({
        loai: 'ok',
        chu: `Đã chuyển bài viết "${bv.tieuDe}" vào thùng rác.`,
      });
      taiBaiViet();
      taiDanhMuc();
    } else {
      const data = await res.json().catch(() => ({}));
      setThongBao({ loai: 'loi', chu: data.message || 'Không thể xóa bài viết.' });
    }
  }

  async function khoiPhucTuThungRac(bv: TomTatBaiVietDto) {
    setThongBao(null);
    const res = await fetch(`/api/v1/admin/articles/${bv.id}/khoi-phuc`, {
      method: 'POST',
    });
    if (res.ok) {
      setThongBao({
        loai: 'ok',
        chu: `Đã khôi phục "${bv.tieuDe}" về trạng thái Bản nháp.`,
      });
      taiBaiViet();
      taiDanhMuc();
    } else {
      const data = await res.json().catch(() => ({}));
      setThongBao({ loai: 'loi', chu: data.message || 'Không thể khôi phục bài viết.' });
    }
  }

  const tongTrang = Math.max(1, Math.ceil(tong / kichThuoc));

  const tieuDePhanHe: Record<TabQuanTri, { tieuDe: string; moTa: string }> = {
    bai_viet: {
      tieuDe: 'Danh sách Bài viết',
      moTa: 'Quản lý toàn bộ bài viết, lọc theo trạng thái, chuyên mục và xuất bản chuẩn SEO trên nephien.com.',
    },
    danh_muc: {
      tieuDe: 'Quản lý Danh mục Bài viết',
      moTa: 'Tổ chức các chuyên mục nội dung, đường dẫn tĩnh (slug) và thứ tự hiển thị ngoài trang công khai.',
    },
    tu_van: {
      tieuDe: 'Yêu cầu Tư vấn Khách hàng',
      moTa: 'Tiếp nhận, phân công Kiến trúc sư và theo dõi tiến độ tư vấn từ Form Trang chủ (#contact-form) và QR Ưu đãi (/uu-dai).',
    },
    tai_khoan: {
      tieuDe: 'Quản trị Tài khoản & Phân quyền',
      moTa: 'Quản lý tài khoản đăng nhập hệ thống với 2 cấp quyền: Super Admin (toàn quyền) và Admin (biên tập).',
    },
    nhat_ky: {
      tieuDe: 'Nhật ký Hoạt động Hệ thống',
      moTa: 'Kiểm toán tự động mọi thao tác bài viết, danh mục, yêu cầu tư vấn, quản trị tài khoản và lịch sử đăng nhập.',
    },
  };

  return (
    <div className="nh-admin-shell">
      <AdminSidebar
        mucDangChon={tabChinh}
        onChonTab={(tab) => {
          setTabChinh(tab);
          if (typeof window !== 'undefined') {
            const url = tab === 'bai_viet' ? '/admin/articles' : `/admin/articles?tab=${tab}`;
            window.history.replaceState(null, '', url);
          }
        }}
        nguoiDung={nguoiDungHienTai}
        soBaiViet={thongKe.tatCa}
        soDanhMuc={danhMuc.length}
        soTuVan={soTuVan}
        soTaiKhoan={taiKhoanList.length}
      />

      <div className="nh-admin-main">
        <header className="nh-admin-page-header">
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                fontWeight: 500,
                margin: '0 0 0.2rem',
              }}
            >
              {tieuDePhanHe[tabChinh].tieuDe}
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#6b5e52', margin: 0 }}>
              {tieuDePhanHe[tabChinh].moTa}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Link href="/admin/articles/moi" className="nh-btn nh-btn-primary">
              + Viết bài mới
            </Link>
          </div>
        </header>

        <main className="nh-admin-container">

        {thongBao && (
          <div
            role="status"
            style={{
              padding: '0.85rem 1.15rem',
              marginBottom: '1.25rem',
              fontSize: '0.86rem',
              fontWeight: 500,
              background: thongBao.loai === 'ok' ? '#e6f4ea' : '#fce8e6',
              color: thongBao.loai === 'ok' ? '#137333' : '#c5221f',
              border: `1px solid ${thongBao.loai === 'ok' ? '#b7e1cd' : '#f6aea9'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{thongBao.chu}</span>
            <button
              type="button"
              onClick={() => setThongBao(null)}
              style={{ background: 'none', border: 'none', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {tabChinh === 'danh_muc' ? (
          <TabDanhMuc
            danhMuc={danhMuc}
            onDaThayDoi={() => {
              taiDanhMuc();
              taiBaiViet();
            }}
          />
        ) : tabChinh === 'tu_van' ? (
          <TabTuVan
            onCapNhatThongKe={(tk) => {
              setSoTuVan(tk.tatCa);
            }}
          />
        ) : tabChinh === 'tai_khoan' ? (
          <TabTaiKhoan
            taiKhoanList={taiKhoanList}
            nguoiDungHienTai={nguoiDungHienTai}
            onDaThayDoi={() => {
              taiTaiKhoan();
              taiNhatKy();
            }}
          />
        ) : tabChinh === 'nhat_ky' ? (
          <div className="nh-card" style={{ padding: '1.35rem' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.1rem',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    margin: '0 0 0.25rem',
                  }}
                >
                  Nhật ký hoạt động toàn hệ thống ({nhatKy.length})
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#6b5e52', margin: 0 }}>
                  Ghi nhận tự động mọi thao tác bài viết, danh mục, yêu cầu tư vấn, quản trị tài khoản và đăng nhập.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  aria-label="Lọc nhóm nhật ký"
                  className="nh-select"
                  style={{ width: 'auto', minWidth: 190 }}
                  value={nhomNhatKy}
                  onChange={(e) => setNhomNhatKy(e.target.value)}
                >
                  <option value="">Tất cả phân hệ</option>
                  <option value="bai_viet">Bài viết</option>
                  <option value="danh_muc_bai_viet">Danh mục</option>
                  <option value="yeu_cau_tu_van">Yêu cầu tư vấn</option>
                  <option value="tai_khoan">Tài khoản &amp; Phân quyền</option>
                  <option value="he_thong">Đăng nhập / Đăng xuất</option>
                </select>

                <input
                  type="search"
                  className="nh-input"
                  style={{ width: 240 }}
                  placeholder="Tìm theo tài khoản, nội dung..."
                  value={tuKhoaNhatKy}
                  onChange={(e) => setTuKhoaNhatKy(e.target.value)}
                />
              </div>
            </div>

            <table className="nh-table" data-testid="audit-log-table">
              <thead>
                <tr>
                  <th style={{ width: 155 }}>Thời gian</th>
                  <th style={{ width: 230 }}>Người thực hiện &amp; Vai trò</th>
                  <th style={{ width: 210 }}>Hành động</th>
                  <th style={{ width: 90 }}>ID Đích</th>
                  <th>Chi tiết ghi nhận</th>
                </tr>
              </thead>
              <tbody>
                {nhatKy.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#6b5e52' }}>
                      Không có bản ghi nhật ký nào khớp bộ lọc.
                    </td>
                  </tr>
                ) : (
                  nhatKy.map((nk) => {
                    const nhan = NHAN_HANH_DONG[nk.hanhDong] ?? {
                      nhan: nk.hanhDong,
                      mau: '#3b3129',
                      nen: '#f1ece1',
                    };
                    return (
                      <tr key={nk.id}>
                        <td style={{ fontSize: '0.8rem', color: '#6b5e52' }}>
                          {new Date(nk.ngayTao).toLocaleString('vi-VN')}
                        </td>
                        <td>
                          {nk.taiKhoanThucHien ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <strong style={{ fontSize: '0.82rem' }}>{nk.taiKhoanThucHien}</strong>
                              {nk.vaiTroThucHien && (
                                <span
                                  style={{
                                    padding: '0.1rem 0.4rem',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    background:
                                      nk.vaiTroThucHien === 'super_admin' ? '#221610' : '#e6f4ea',
                                    color:
                                      nk.vaiTroThucHien === 'super_admin' ? '#c9a96e' : '#137333',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {nk.vaiTroThucHien === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#6b5e52', fontSize: '0.8rem' }}>Hệ thống</span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.22rem 0.55rem',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              background: nhan.nen,
                              color: nhan.mau,
                            }}
                          >
                            {nhan.nhan}
                          </span>
                          <div style={{ fontSize: '0.68rem', color: '#6b5e52', marginTop: 2 }}>
                            <code>{nk.hanhDong}</code>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{nk.doiTuongId ? `#${nk.doiTuongId}` : '—'}</td>
                        <td style={{ fontSize: '0.8rem', color: '#3b3129' }}>
                          <code>{JSON.stringify(nk.chiTiet)}</code>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* 5 Thẻ Thống Kê / Chuyển nhanh Tab Trạng thái */}
            <div className="nh-stat-grid">
              <button
                type="button"
                onClick={() => {
                  setBoLocTab('tat_ca');
                  setTrang(1);
                }}
                className={`nh-stat-card ${boLocTab === 'tat_ca' ? 'is-active' : ''}`}
              >
                <div className="nh-stat-label">Tất cả bài viết</div>
                <div className="nh-stat-value">{thongKe.tatCa}</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoLocTab('dang');
                  setTrang(1);
                }}
                className={`nh-stat-card ${boLocTab === 'dang' ? 'is-active' : ''}`}
              >
                <div className="nh-stat-label">Đã xuất bản</div>
                <div className="nh-stat-value" style={{ color: '#137333' }}>
                  {thongKe.dang}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoLocTab('nhap');
                  setTrang(1);
                }}
                className={`nh-stat-card ${boLocTab === 'nhap' ? 'is-active' : ''}`}
              >
                <div className="nh-stat-label">Bản nháp</div>
                <div className="nh-stat-value" style={{ color: '#b06000' }}>
                  {thongKe.nhap}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoLocTab('an');
                  setTrang(1);
                }}
                className={`nh-stat-card ${boLocTab === 'an' ? 'is-active' : ''}`}
              >
                <div className="nh-stat-label">Đang tạm ẩn</div>
                <div className="nh-stat-value" style={{ color: '#5f6368' }}>
                  {thongKe.an}
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBoLocTab('thung_rac');
                  setTrang(1);
                }}
                className={`nh-stat-card ${boLocTab === 'thung_rac' ? 'is-active' : ''}`}
              >
                <div className="nh-stat-label">Thùng rác</div>
                <div className="nh-stat-value" style={{ color: '#c5221f' }}>
                  {thongKe.thungRac}
                </div>
              </button>
            </div>

            {/* Thanh Bộ lọc tìm kiếm đa chiều */}
            <div
              className="nh-card"
              style={{
                padding: '1.1rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1.6fr 1fr 0.9fr 0.9fr 1fr auto',
                gap: '0.75rem',
                alignItems: 'end',
              }}
            >
              <div>
                <label
                  htmlFor="loc-tukhoa"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Tìm theo tiêu đề / slug
                </label>
                <input
                  id="loc-tukhoa"
                  type="search"
                  className="nh-input"
                  placeholder="Nhập từ khóa tiêu đề hoặc đường dẫn..."
                  value={tuKhoa}
                  onChange={(e) => {
                    setTuKhoa(e.target.value);
                    setTrang(1);
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="loc-danhmuc"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Danh mục
                </label>
                <select
                  id="loc-danhmuc"
                  className="nh-select"
                  value={danhMucId}
                  onChange={(e) => {
                    setDanhMucId(e.target.value);
                    setTrang(1);
                  }}
                >
                  <option value="">Tất cả danh mục</option>
                  {danhMuc.map((dm) => (
                    <option key={dm.id} value={dm.id}>
                      {dm.ten} {!dm.hien ? '(Đang ẩn)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="loc-tungay"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Từ ngày
                </label>
                <input
                  id="loc-tungay"
                  type="date"
                  className="nh-input"
                  value={tuNgay}
                  onChange={(e) => {
                    setTuNgay(e.target.value);
                    setTrang(1);
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="loc-denngay"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Đến ngày
                </label>
                <input
                  id="loc-denngay"
                  type="date"
                  className="nh-input"
                  value={denNgay}
                  onChange={(e) => {
                    setDenNgay(e.target.value);
                    setTrang(1);
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="loc-sapxep"
                  style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
                >
                  Sắp xếp theo
                </label>
                <select
                  id="loc-sapxep"
                  className="nh-select"
                  value={sapXep}
                  onChange={(e) =>
                    setSapXep(e.target.value as 'cap_nhat' | 'ngay_dang' | 'tieu_de')
                  }
                >
                  <option value="cap_nhat">Mới cập nhật gần nhất</option>
                  <option value="ngay_dang">Ngày xuất bản mới nhất</option>
                  <option value="tieu_de">Tiêu đề (A → Z)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setTuKhoa('');
                  setDanhMucId('');
                  setTuNgay('');
                  setDenNgay('');
                  setSapXep('cap_nhat');
                  setBoLocTab('tat_ca');
                  setTrang(1);
                }}
                className="nh-btn"
              >
                Đặt lại
              </button>
            </div>

            {/* Bảng Danh sách Bài viết */}
            <div className="nh-card" style={{ overflowX: 'auto' }}>
              <table className="nh-table">
                <thead>
                  <tr>
                    <th style={{ width: 84 }}>Ảnh bìa</th>
                    <th>Tiêu đề &amp; Đường dẫn</th>
                    <th style={{ width: 170 }}>Danh mục</th>
                    <th style={{ width: 135 }}>Trạng thái</th>
                    <th style={{ width: 120 }}>Ngày đăng</th>
                    <th style={{ width: 95 }}>Lượt đọc</th>
                    <th style={{ width: 250, textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dangTai ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#6b5e52' }}>
                        Đang tải danh sách bài viết từ Neon PostgreSQL...
                      </td>
                    </tr>
                  ) : danhSach.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ margin: '0 0 0.9rem', color: '#6b5e52' }}>
                          Không tìm thấy bài viết nào khớp với bộ lọc hiện tại.
                        </p>
                        <Link href="/admin/articles/moi" className="nh-btn nh-btn-primary">
                          + Viết bài mới ngay
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    danhSach.map((bv) => (
                      <tr key={bv.id}>
                        <td>
                          {bv.anhBia ? (
                            <img
                              src={bv.anhBia}
                              alt={bv.tieuDe}
                              style={{
                                width: 68,
                                height: 46,
                                objectFit: 'cover',
                                border: '1px solid rgba(28,22,18,0.15)',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 68,
                                height: 46,
                                background: '#eae3d5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.68rem',
                                color: '#6b5e52',
                              }}
                            >
                              Chưa có
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Link
                              href={`/admin/articles/${bv.id}`}
                              style={{
                                fontWeight: 600,
                                fontSize: '0.94rem',
                                color: '#1c1612',
                              }}
                            >
                              {bv.tieuDe}
                            </Link>
                            {bv.noiBat && (
                              <span
                                style={{
                                  fontSize: '0.66rem',
                                  padding: '0.12rem 0.45rem',
                                  background: '#221610',
                                  color: '#c9a96e',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.08em',
                                }}
                              >
                                Nổi bật
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: '#6b5e52', marginTop: 3 }}>
                            <code>/bai-viet/{bv.slug}</code> · Tác giả: {bv.tacGia}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{bv.tenDanhMuc}</span>
                          {!bv.danhMucHien && (
                            <div style={{ fontSize: '0.7rem', color: '#c5221f' }}>
                              (Danh mục đang ẩn)
                            </div>
                          )}
                        </td>
                        <td>
                          {bv.xoaLuc ? (
                            <span className="nh-status-badge nh-status-xoa">Trong thùng rác</span>
                          ) : bv.trangThai === 'dang' ? (
                            <span className="nh-status-badge nh-status-dang">Đã đăng</span>
                          ) : bv.trangThai === 'nhap' ? (
                            <span className="nh-status-badge nh-status-nhap">Bản nháp</span>
                          ) : (
                            <span className="nh-status-badge nh-status-an">Đang ẩn</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#5a4e43' }}>
                          {dinhDangNgay(bv.ngayDang)}
                        </td>
                        <td style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                          {bv.luotXem.toLocaleString('vi-VN')}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {bv.xoaLuc ? (
                            <button
                              type="button"
                              onClick={() => khoiPhucTuThungRac(bv)}
                              className="nh-btn nh-btn-primary"
                              style={{ padding: '0.36rem 0.75rem', fontSize: '0.76rem' }}
                            >
                              Khôi phục về nháp
                            </button>
                          ) : (
                            <div
                              style={{
                                display: 'inline-flex',
                                flexWrap: 'wrap',
                                gap: 6,
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Link
                                href={`/admin/articles/${bv.id}`}
                                className="nh-btn"
                                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                              >
                                Sửa
                              </Link>
                              {bv.trangThai !== 'dang' ? (
                                <button
                                  type="button"
                                  onClick={() => doiTrangThaiNhanh(bv, 'dang')}
                                  className="nh-btn nh-btn-primary"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  Đăng
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => doiTrangThaiNhanh(bv, 'an')}
                                  className="nh-btn"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  Ẩn
                                </button>
                              )}
                              {bv.trangThai === 'dang' && bv.danhMucHien && (
                                <Link
                                  href={`/bai-viet/${bv.slug}`}
                                  target="_blank"
                                  className="nh-btn"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                  title="Xem bài viết trên mặt tiền"
                                >
                                  Xem ↗
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() => xoaVaoThungRac(bv)}
                                className="nh-btn"
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  fontSize: '0.75rem',
                                  color: '#c5221f',
                                }}
                              >
                                Xóa
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Phân trang */}
              {tongTrang > 1 && (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderTop: '1px solid rgba(28,22,18,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                  }}
                >
                  <span>
                    Hiển thị trang <strong>{trang}</strong> / {tongTrang} (Tổng {tong} bài viết)
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      type="button"
                      disabled={trang <= 1}
                      onClick={() => setTrang((p) => Math.max(1, p - 1))}
                      className="nh-btn"
                    >
                      ← Trang trước
                    </button>
                    <button
                      type="button"
                      disabled={trang >= tongTrang}
                      onClick={() => setTrang((p) => Math.min(tongTrang, p + 1))}
                      className="nh-btn"
                    >
                      Trang sau →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        </main>
      </div>
    </div>
  );
}
