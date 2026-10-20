'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  NguonYeuCauTuVan,
  ThongKeYeuCauTuVanDto,
  TrangThaiYeuCauTuVan,
  YeuCauTuVanDto,
} from '@/lib/content/bai-viet-service';

interface TabTuVanProps {
  onCapNhatThongKe?: (thongKe: ThongKeYeuCauTuVanDto) => void;
}

const NHAN_TRANG_THAI: Record<
  TrangThaiYeuCauTuVan,
  { nhan: string; mau: string; nen: string; vien: string }
> = {
  moi: {
    nhan: 'Mới tiếp nhận',
    mau: '#b33c14',
    nen: '#fdebe4',
    vien: '#f5c2b0',
  },
  dang_lien_he: {
    nhan: 'Đang liên hệ',
    mau: '#1a0dab',
    nen: '#e8f0fe',
    vien: '#bdd4fb',
  },
  da_hen_lich: {
    nhan: 'Đã hẹn lịch KTS',
    mau: '#945200',
    nen: '#fef7e0',
    vien: '#f5dc95',
  },
  hoan_thanh: {
    nhan: 'Đã tư vấn xong',
    mau: '#137333',
    nen: '#e6f4ea',
    vien: '#b7e1cd',
  },
  huy: {
    nhan: 'Không phù hợp / Hủy',
    mau: '#5f6368',
    nen: '#f1f3f4',
    vien: '#dadce0',
  },
};

const NHAN_NGUON: Record<NguonYeuCauTuVan, { nhan: string; mau: string; nen: string }> = {
  form_trang_chu: {
    nhan: 'Form Trang chủ',
    mau: '#3b3129',
    nen: '#efe8dc',
  },
  form_qr_uu_dai: {
    nhan: 'QR Ưu đãi 10%',
    mau: '#7a4b00',
    nen: '#fdf0d5',
  },
  khac: {
    nhan: 'Kênh khác',
    mau: '#5f6368',
    nen: '#f1f3f4',
  },
};

function dinhDangThoiGian(iso: string): string {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

export function TabTuVan({ onCapNhatThongKe }: TabTuVanProps) {
  const [danhSach, setDanhSach] = useState<YeuCauTuVanDto[]>([]);
  const [thongKe, setThongKe] = useState<ThongKeYeuCauTuVanDto>({
    tatCa: 0,
    moi: 0,
    dangLienHe: 0,
    daHenLich: 0,
    hoanThanh: 0,
    huy: 0,
  });
  const [tong, setTong] = useState(0);
  const [trang, setTrang] = useState(1);
  const [kichThuoc] = useState(15);

  const [boLocTrangThai, setBoLocTrangThai] = useState<TrangThaiYeuCauTuVan | 'tat_ca'>('tat_ca');
  const [boLocNguon, setBoLocNguon] = useState<string>('');
  const [tuKhoa, setTuKhoa] = useState('');
  const [dangTai, setDangTai] = useState(true);
  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null);

  // Chi tiết / Ghi chú modal
  const [mucDangSua, setMucDangSua] = useState<YeuCauTuVanDto | null>(null);
  const [trangThaiSua, setTrangThaiSua] = useState<TrangThaiYeuCauTuVan>('moi');
  const [nguoiPhuTrachSua, setNguoiPhuTrachSua] = useState('');
  const [ghiChuSua, setGhiChuSua] = useState('');
  const [dangLuu, setDangLuu] = useState(false);

  const taiDanhSach = useCallback(async () => {
    setDangTai(true);
    try {
      const sp = new URLSearchParams();
      if (tuKhoa.trim()) sp.set('tuKhoa', tuKhoa.trim());
      if (boLocTrangThai !== 'tat_ca') sp.set('trangThai', boLocTrangThai);
      if (boLocNguon) sp.set('nguon', boLocNguon);
      sp.set('trang', String(trang));
      sp.set('kichThuoc', String(kichThuoc));

      const res = await fetch(`/api/v1/admin/consultations?${sp.toString()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setDanhSach(Array.isArray(data.items) ? data.items : []);
        setTong(Number(data.tong ?? 0));
        if (data.thongKe) {
          setThongKe(data.thongKe);
          onCapNhatThongKe?.(data.thongKe);
        }
      }
    } finally {
      setDangTai(false);
    }
  }, [tuKhoa, boLocTrangThai, boLocNguon, trang, kichThuoc, onCapNhatThongKe]);

  useEffect(() => {
    taiDanhSach();
  }, [taiDanhSach]);

  async function doiTrangThaiNhanh(muc: YeuCauTuVanDto, trangThaiMoi: TrangThaiYeuCauTuVan) {
    setThongBao(null);
    const res = await fetch(`/api/v1/admin/consultations/${muc.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trangThai: trangThaiMoi }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setThongBao({ loai: 'loi', chu: data.message || 'Không thể cập nhật trạng thái.' });
    } else {
      setThongBao({
        loai: 'ok',
        chu: `Đã chuyển yêu cầu của "${muc.hoTen}" sang trạng thái "${NHAN_TRANG_THAI[trangThaiMoi].nhan}".`,
      });
      taiDanhSach();
    }
  }

  function moChiTiet(muc: YeuCauTuVanDto) {
    setMucDangSua(muc);
    setTrangThaiSua(muc.trangThai);
    setNguoiPhuTrachSua(muc.nguoiPhuTrach);
    setGhiChuSua(muc.ghiChuNoiBo);
  }

  async function luuChiTiet(e: React.FormEvent) {
    e.preventDefault();
    if (!mucDangSua) return;
    setDangLuu(true);
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/consultations/${mucDangSua.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trangThai: trangThaiSua,
          nguoiPhuTrach: nguoiPhuTrachSua,
          ghiChuNoiBo: ghiChuSua,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể lưu ghi chú tư vấn.' });
      } else {
        setThongBao({
          loai: 'ok',
          chu: `Đã cập nhật hồ sơ tư vấn của khách hàng "${mucDangSua.hoTen}".`,
        });
        setMucDangSua(null);
        taiDanhSach();
      }
    } finally {
      setDangLuu(false);
    }
  }

  async function xoaYeuCau(muc: YeuCauTuVanDto) {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(
        `Bạn có chắc muốn xóa vĩnh viễn yêu cầu tư vấn của "${muc.hoTen}" (${muc.soDienThoai})?`,
      )
    ) {
      return;
    }
    setThongBao(null);
    const res = await fetch(`/api/v1/admin/consultations/${muc.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setThongBao({
        loai: 'ok',
        chu: `Đã xóa yêu cầu tư vấn của "${muc.hoTen}".`,
      });
      if (mucDangSua?.id === muc.id) setMucDangSua(null);
      taiDanhSach();
    } else {
      const data = await res.json().catch(() => ({}));
      setThongBao({ loai: 'loi', chu: data.message || 'Không thể xóa yêu cầu tư vấn.' });
    }
  }

  const tongTrang = Math.max(1, Math.ceil(tong / kichThuoc));

  return (
    <div>
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
            style={{ background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 5 Thẻ Thống Kê Trạng Thái Yêu Cầu Tư Vấn */}
      <div className="nh-stat-grid">
        <button
          type="button"
          onClick={() => {
            setBoLocTrangThai('tat_ca');
            setTrang(1);
          }}
          className={`nh-stat-card ${boLocTrangThai === 'tat_ca' ? 'is-active' : ''}`}
        >
          <div className="nh-stat-label">Tất cả yêu cầu</div>
          <div className="nh-stat-value">{thongKe.tatCa}</div>
        </button>

        <button
          type="button"
          onClick={() => {
            setBoLocTrangThai('moi');
            setTrang(1);
          }}
          className={`nh-stat-card ${boLocTrangThai === 'moi' ? 'is-active' : ''}`}
        >
          <div className="nh-stat-label">Mới tiếp nhận</div>
          <div className="nh-stat-value" style={{ color: '#c0562c' }}>
            {thongKe.moi}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setBoLocTrangThai('dang_lien_he');
            setTrang(1);
          }}
          className={`nh-stat-card ${boLocTrangThai === 'dang_lien_he' ? 'is-active' : ''}`}
        >
          <div className="nh-stat-label">Đang liên hệ</div>
          <div className="nh-stat-value" style={{ color: '#1a0dab' }}>
            {thongKe.dangLienHe}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setBoLocTrangThai('da_hen_lich');
            setTrang(1);
          }}
          className={`nh-stat-card ${boLocTrangThai === 'da_hen_lich' ? 'is-active' : ''}`}
        >
          <div className="nh-stat-label">Đã hẹn lịch KTS</div>
          <div className="nh-stat-value" style={{ color: '#b06000' }}>
            {thongKe.daHenLich}
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setBoLocTrangThai('hoan_thanh');
            setTrang(1);
          }}
          className={`nh-stat-card ${boLocTrangThai === 'hoan_thanh' ? 'is-active' : ''}`}
        >
          <div className="nh-stat-label">Đã tư vấn xong</div>
          <div className="nh-stat-value" style={{ color: '#137333' }}>
            {thongKe.hoanThanh}
          </div>
        </button>
      </div>

      {/* Thanh Bộ lọc Tìm kiếm & Nguồn */}
      <div
        className="nh-card"
        style={{
          padding: '1.1rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'grid',
          gridTemplateColumns: '1.8fr 1fr 1fr auto',
          gap: '0.75rem',
          alignItems: 'end',
        }}
      >
        <div>
          <label
            htmlFor="loc-tuvan-tukhoa"
            style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
          >
            Tìm theo tên khách hàng, số điện thoại, dịch vụ hoặc lời nhắn
          </label>
          <input
            id="loc-tuvan-tukhoa"
            type="search"
            className="nh-input"
            placeholder="VD: 0901..., Nguyễn Văn A, Thiết kế nội thất, Thảo Điền..."
            value={tuKhoa}
            onChange={(e) => {
              setTuKhoa(e.target.value);
              setTrang(1);
            }}
          />
        </div>

        <div>
          <label
            htmlFor="loc-tuvan-nguon"
            style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
          >
            Nguồn đăng ký
          </label>
          <select
            id="loc-tuvan-nguon"
            className="nh-select"
            value={boLocNguon}
            onChange={(e) => {
              setBoLocNguon(e.target.value);
              setTrang(1);
            }}
          >
            <option value="">Tất cả nguồn</option>
            <option value="form_trang_chu">Form Trang chủ (#contact-form)</option>
            <option value="form_qr_uu_dai">Form QR Ưu đãi (/uu-dai)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="loc-tuvan-trangthai"
            style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}
          >
            Trạng thái xử lý
          </label>
          <select
            id="loc-tuvan-trangthai"
            className="nh-select"
            value={boLocTrangThai}
            onChange={(e) => {
              setBoLocTrangThai(e.target.value as TrangThaiYeuCauTuVan | 'tat_ca');
              setTrang(1);
            }}
          >
            <option value="tat_ca">Tất cả trạng thái</option>
            <option value="moi">Mới tiếp nhận ({thongKe.moi})</option>
            <option value="dang_lien_he">Đang liên hệ ({thongKe.dangLienHe})</option>
            <option value="da_hen_lich">Đã hẹn lịch KTS ({thongKe.daHenLich})</option>
            <option value="hoan_thanh">Đã tư vấn xong ({thongKe.hoanThanh})</option>
            <option value="huy">Không phù hợp / Hủy ({thongKe.huy})</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="nh-btn nh-btn-ghost"
            onClick={() => {
              setTuKhoa('');
              setBoLocNguon('');
              setBoLocTrangThai('tat_ca');
              setTrang(1);
            }}
          >
            Đặt lại
          </button>
          <button type="button" className="nh-btn" onClick={() => taiDanhSach()}>
            Làm mới
          </button>
        </div>
      </div>

      {/* Khung cập nhật chi tiết / Ghi chú nội bộ khi đang chọn 1 yêu cầu */}
      {mucDangSua && (
        <form
          onSubmit={luuChiTiet}
          className="nh-card"
          style={{
            padding: '1.25rem 1.35rem',
            marginBottom: '1.25rem',
            borderLeft: '4px solid #c0562c',
            background: '#fdfbf7',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#c0562c',
                }}
              >
                Hồ sơ tư vấn #{mucDangSua.id} · {NHAN_NGUON[mucDangSua.nguon].nhan}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.3rem',
                  margin: '0.2rem 0',
                }}
              >
                {mucDangSua.hoTen} —{' '}
                <a
                  href={`tel:${mucDangSua.soDienThoai}`}
                  style={{ color: '#c0562c', textDecoration: 'none' }}
                >
                  {mucDangSua.soDienThoai}
                </a>
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#6b5e52' }}>
                Gửi lúc: {dinhDangThoiGian(mucDangSua.ngayTao)}
                {mucDangSua.email ? ` · Email: ${mucDangSua.email}` : ''}
                {mucDangSua.maUuDai ? ` · Mã ưu đãi: ${mucDangSua.maUuDai}` : ''}
              </div>
            </div>
            <button
              type="button"
              className="nh-btn nh-btn-ghost"
              onClick={() => setMucDangSua(null)}
            >
              Đóng ✕
            </button>
          </div>

          <div
            style={{
              padding: '0.85rem 1rem',
              background: '#f5efe4',
              marginBottom: '1rem',
              fontSize: '0.86rem',
              lineHeight: 1.55,
            }}
          >
            <div>
              <strong>Dịch vụ / Nhu cầu:</strong> {mucDangSua.dichVu || 'Chưa chọn cụ thể'} ·{' '}
              <strong>Diện tích / Mã căn:</strong> {mucDangSua.dienTich || 'Chưa cung cấp'}
            </div>
            <div style={{ marginTop: 6 }}>
              <strong>Ý tưởng / Lời nhắn của khách hàng:</strong>{' '}
              {mucDangSua.loiNhan || <em>(Khách không để lại lời nhắn thêm)</em>}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.9rem',
              marginBottom: '0.9rem',
            }}
          >
            <div>
              <label
                htmlFor="sua-trang-thai-tv"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}
              >
                Trạng thái xử lý
              </label>
              <select
                id="sua-trang-thai-tv"
                className="nh-select"
                value={trangThaiSua}
                onChange={(e) => setTrangThaiSua(e.target.value as TrangThaiYeuCauTuVan)}
              >
                <option value="moi">Mới tiếp nhận</option>
                <option value="dang_lien_he">Đang liên hệ</option>
                <option value="da_hen_lich">Đã hẹn lịch KTS</option>
                <option value="hoan_thanh">Đã tư vấn xong</option>
                <option value="huy">Không phù hợp / Hủy</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sua-nguoi-phu-trach-tv"
                style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}
              >
                Kiến trúc sư / Tư vấn viên phụ trách
              </label>
              <input
                id="sua-nguoi-phu-trach-tv"
                type="text"
                className="nh-input"
                placeholder="VD: KTS. Lâm Vũ, KTS. Minh Hiên..."
                value={nguoiPhuTrachSua}
                onChange={(e) => setNguoiPhuTrachSua(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="sua-ghi-chu-tv"
              style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 4 }}
            >
              Ghi chú nội bộ (Lịch hẹn khảo sát, ngân sách dự kiến, gu thẩm mỹ của khách...)
            </label>
            <textarea
              id="sua-ghi-chu-tv"
              className="nh-textarea"
              rows={3}
              placeholder="Ghi lại kết quả cuộc gọi, lịch hẹn gặp mặt hoặc yêu cầu kỹ thuật..."
              value={ghiChuSua}
              onChange={(e) => setGhiChuSua(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button
              type="button"
              className="nh-btn nh-btn-ghost"
              onClick={() => setMucDangSua(null)}
            >
              Hủy
            </button>
            <button type="submit" className="nh-btn nh-btn-primary" disabled={dangLuu}>
              {dangLuu ? 'Đang lưu...' : 'Lưu cập nhật tư vấn'}
            </button>
          </div>
        </form>
      )}

      {/* Bảng Danh sách Yêu cầu tư vấn */}
      <div className="nh-card" style={{ overflowX: 'auto' }}>
        <table className="nh-table" data-testid="consultations-table">
          <thead>
            <tr>
              <th style={{ width: 220 }}>Khách hàng &amp; Liên hệ</th>
              <th style={{ width: 150 }}>Nguồn &amp; Ưu đãi</th>
              <th style={{ width: 210 }}>Dịch vụ &amp; Không gian</th>
              <th>Ý tưởng / Lời nhắn &amp; Ghi chú KTS</th>
              <th style={{ width: 185 }}>Trạng thái &amp; Phụ trách</th>
              <th style={{ width: 155, textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {dangTai ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#6b5e52' }}>
                  Đang tải danh sách yêu cầu tư vấn từ Neon PostgreSQL...
                </td>
              </tr>
            ) : danhSach.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: '#6b5e52' }}>
                  Chưa có yêu cầu tư vấn nào khớp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              danhSach.map((muc) => {
                const tt = NHAN_TRANG_THAI[muc.trangThai];
                const ng = NHAN_NGUON[muc.nguon];
                return (
                  <tr
                    key={muc.id}
                    style={{
                      background: muc.trangThai === 'moi' ? 'rgba(192, 86, 44, 0.035)' : undefined,
                    }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <strong style={{ fontSize: '0.92rem', color: '#221610' }}>
                          {muc.hoTen}
                        </strong>
                        {muc.trangThai === 'moi' && (
                          <span
                            style={{
                              padding: '0.1rem 0.42rem',
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              background: '#c0562c',
                              color: '#fff',
                              textTransform: 'uppercase',
                            }}
                          >
                            MỚI
                          </span>
                        )}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <a
                          href={`tel:${muc.soDienThoai}`}
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            color: '#c0562c',
                            textDecoration: 'none',
                          }}
                        >
                          📞 {muc.soDienThoai}
                        </a>
                      </div>
                      {muc.email && (
                        <div style={{ fontSize: '0.76rem', color: '#6b5e52', marginTop: 2 }}>
                          ✉ {muc.email}
                        </div>
                      )}
                      <div style={{ fontSize: '0.73rem', color: '#8c7e70', marginTop: 4 }}>
                        {dinhDangThoiGian(muc.ngayTao)}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          fontSize: '0.73rem',
                          fontWeight: 600,
                          background: ng.nen,
                          color: ng.mau,
                        }}
                      >
                        {ng.nhan}
                      </span>
                      {muc.maUuDai && (
                        <div
                          style={{
                            marginTop: 5,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#945200',
                          }}
                        >
                          🏷 {muc.maUuDai}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', color: '#221610' }}>
                        {muc.dichVu || 'Tư vấn chung'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6b5e52', marginTop: 3 }}>
                        📐 {muc.dienTich || 'Chưa rõ diện tích'}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          fontSize: '0.83rem',
                          color: '#2c221b',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {muc.loiNhan || (
                          <span style={{ color: '#8c7e70', fontStyle: 'italic' }}>
                            Không có lời nhắn thêm
                          </span>
                        )}
                      </div>
                      {muc.ghiChuNoiBo && (
                        <div
                          style={{
                            marginTop: 6,
                            padding: '0.35rem 0.6rem',
                            background: '#f6f1e7',
                            borderLeft: '3px solid #c9a96e',
                            fontSize: '0.76rem',
                            color: '#4a3d33',
                          }}
                        >
                          <strong>Ghi chú KTS:</strong> {muc.ghiChuNoiBo}
                        </div>
                      )}
                    </td>

                    <td>
                      <select
                        aria-label={`Đổi trạng thái tư vấn của ${muc.hoTen}`}
                        className="nh-select"
                        style={{
                          padding: '0.35rem 0.55rem',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          background: tt.nen,
                          color: tt.mau,
                          borderColor: tt.vien,
                        }}
                        value={muc.trangThai}
                        onChange={(e) =>
                          doiTrangThaiNhanh(muc, e.target.value as TrangThaiYeuCauTuVan)
                        }
                      >
                        <option value="moi">Mới tiếp nhận</option>
                        <option value="dang_lien_he">Đang liên hệ</option>
                        <option value="da_hen_lich">Đã hẹn lịch KTS</option>
                        <option value="hoan_thanh">Đã tư vấn xong</option>
                        <option value="huy">Không phù hợp / Hủy</option>
                      </select>
                      <div style={{ fontSize: '0.74rem', color: '#6b5e52', marginTop: 5 }}>
                        👤 {muc.nguoiPhuTrach ? muc.nguoiPhuTrach : 'Chưa phân công KTS'}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '0.4rem',
                          justifyContent: 'flex-end',
                          flexWrap: 'wrap',
                        }}
                      >
                        <button
                          type="button"
                          className="nh-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                          onClick={() => moChiTiet(muc)}
                        >
                          Chi tiết / Ghi chú
                        </button>
                        <button
                          type="button"
                          className="nh-btn nh-btn-danger"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.76rem' }}
                          onClick={() => xoaYeuCau(muc)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        {tongTrang > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.9rem 1.25rem',
              borderTop: '1px solid var(--nh-border)',
              fontSize: '0.82rem',
            }}
          >
            <span>
              Hiển thị trang <strong>{trang}</strong> / {tongTrang} (Tổng {tong} yêu cầu)
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button
                type="button"
                className="nh-btn nh-btn-ghost"
                disabled={trang <= 1}
                onClick={() => setTrang((p) => Math.max(1, p - 1))}
              >
                ← Trang trước
              </button>
              <button
                type="button"
                className="nh-btn nh-btn-ghost"
                disabled={trang >= tongTrang}
                onClick={() => setTrang((p) => Math.min(tongTrang, p + 1))}
              >
                Trang sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
