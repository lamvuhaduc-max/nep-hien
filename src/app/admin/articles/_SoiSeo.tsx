'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  chamSeo,
  MucDatSeo,
  NGUONG_SEO_MAC_DINH,
  NguongSeo,
  TieuChiSeo,
} from '@/lib/seo-bai-viet';

const KHOA_NGUONG_SEO = 'nephien.seo_nguong.v1';

interface Props {
  tieuDe: string;
  slug: string;
  moTaNgan: string;
  anhBia: string;
  noiDungHtml: string;
}

const NHAN_NHOM: Record<TieuChiSeo['nhom'], string> = {
  co_ban: 'Thẻ tiêu đề, mô tả & hiển thị tìm kiếm',
  noi_dung: 'Cấu trúc bài viết & trải nghiệm đọc',
  tu_khoa: 'Tối ưu theo từ khóa chính (tùy chọn)',
};

function MauCham({ muc }: { muc: MucDatSeo }) {
  const bg =
    muc === 'dat'
      ? '#137333'
      : muc === 'can_cai_thien'
        ? '#d97706'
        : muc === 'chua_dat'
          ? '#c5221f'
          : '#9aa0a6';
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: bg,
        marginTop: 5,
        flexShrink: 0,
      }}
    />
  );
}

export function SoiSeo({ tieuDe, slug, moTaNgan, anhBia, noiDungHtml }: Props) {
  const [tuKhoa, setTuKhoa] = useState('');
  const [moChiTiet, setMoChiTiet] = useState(true);
  const [moTuyChinh, setMoTuyChinh] = useState(false);
  const [nguong, setNguong] = useState<NguongSeo>(NGUONG_SEO_MAC_DINH);

  useEffect(() => {
    try {
      const luu = window.localStorage.getItem(KHOA_NGUONG_SEO);
      if (luu) {
        const parsed = JSON.parse(luu) as Partial<NguongSeo>;
        setNguong({ ...NGUONG_SEO_MAC_DINH, ...parsed });
      }
    } catch {
      // Bỏ qua
    }
  }, []);

  function capNhatNguong(patch: Partial<NguongSeo>) {
    setNguong((cu) => {
      const moi = { ...cu, ...patch };
      try {
        window.localStorage.setItem(KHOA_NGUONG_SEO, JSON.stringify(moi));
      } catch {
        // Bỏ qua
      }
      return moi;
    });
  }

  function khoiPhucMacDinh() {
    setNguong(NGUONG_SEO_MAC_DINH);
    try {
      window.localStorage.removeItem(KHOA_NGUONG_SEO);
    } catch {
      // Bỏ qua
    }
  }

  const ketQua = useMemo(
    () =>
      chamSeo(
        {
          tieuDe,
          slug,
          moTaNgan,
          anhBia,
          noiDungHtml,
          tuKhoa,
        },
        nguong,
      ),
    [tieuDe, slug, moTaNgan, anhBia, noiDungHtml, tuKhoa, nguong],
  );

  const nhanTongQuan =
    ketQua.sanSang >= 80
      ? { chu: 'Chuẩn SEO rất tốt', mau: '#137333', nen: '#e6f4ea' }
      : ketQua.sanSang >= 55
        ? { chu: 'Khá tốt — có thể tối ưu thêm', mau: '#b06000', nen: '#fef7e0' }
        : { chu: 'Cần bổ sung thêm thông tin', mau: '#c5221f', nen: '#fce8e6' };

  const tieuDeXemTruoc = (tieuDe.trim() || 'Tiêu đề bài viết sẽ hiển thị tại đây').slice(0, 68);
  const moTaXemTruoc = (
    moTaNgan.trim() ||
    'Mô tả ngắn (meta description) sẽ xuất hiện dưới tiêu đề khi khách hàng tìm kiếm trên Google...'
  ).slice(0, 165);
  const duongDanXemTruoc = `nephien.com › bai-viet › ${slug.trim() || 'duong-dan-bai-viet'}`;

  const nhomDanhSach: Array<TieuChiSeo['nhom']> = ['co_ban', 'noi_dung', 'tu_khoa'];

  return (
    <section
      className="nh-card"
      style={{
        padding: '1.25rem',
        marginTop: '1.25rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
      aria-label="Kiểm tra chuẩn SEO"
      data-testid="soi-seo-panel"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1c1612', margin: 0 }}>
            Soi chuẩn SEO (12 tiêu chí)
          </h3>
          <p style={{ fontSize: '0.76rem', color: '#6b5e52', margin: '0.15rem 0 0' }}>
            {ketQua.soTu} từ · ~{ketQua.soPhutDoc} phút đọc · Đạt {ketQua.soDat}/
            {ketQua.tongTinhDiem} mục
          </p>
        </div>

        <span
          data-testid="soi-seo-score"
          style={{
            padding: '0.28rem 0.65rem',
            fontSize: '0.76rem',
            fontWeight: 700,
            background: nhanTongQuan.nen,
            color: nhanTongQuan.mau,
            borderRadius: 2,
          }}
        >
          {ketQua.sanSang}%
        </span>
      </div>

      {/* Thanh tiến độ */}
      <div
        style={{
          height: 6,
          width: '100%',
          background: '#e6dfd3',
          overflow: 'hidden',
          marginBottom: '0.9rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${ketQua.sanSang}%`,
            background: nhanTongQuan.mau,
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      {/* Xem trước Google SERP */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(28, 22, 18, 0.14)',
          padding: '0.85rem 1rem',
          marginBottom: '0.95rem',
        }}
      >
        <div
          style={{
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#6b5e52',
            marginBottom: '0.3rem',
          }}
        >
          Xem trước trên Google
        </div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#5f6368',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {duongDanXemTruoc}
        </div>
        <div
          style={{
            fontSize: '0.96rem',
            fontWeight: 600,
            color: '#1a0dab',
            lineHeight: 1.35,
            margin: '0.2rem 0',
          }}
        >
          {tieuDeXemTruoc} — Nếp Hiên
        </div>
        <div style={{ fontSize: '0.8rem', color: '#4d5156', lineHeight: 1.45 }}>
          {moTaXemTruoc}
        </div>
      </div>

      {/* Ô từ khóa chính */}
      <div style={{ marginBottom: '0.85rem' }}>
        <label
          htmlFor="nh-seo-tukhoa"
          style={{
            display: 'block',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#1c1612',
            marginBottom: '0.35rem',
          }}
        >
          Từ khóa chính cần soi <span style={{ fontWeight: 400, color: '#6b5e52' }}>(tùy chọn)</span>
        </label>
        <input
          id="nh-seo-tukhoa"
          type="text"
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="VD: thiết kế nội thất đương đại, khoảng hiên..."
          className="nh-input"
        />
      </div>

      {/* Nút đóng/mở chi tiết & tùy chỉnh ngưỡng */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.65rem',
        }}
      >
        <button
          type="button"
          onClick={() => setMoChiTiet((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#c0562c',
          }}
        >
          {moChiTiet ? 'Thu gọn danh sách 12 tiêu chí ▲' : 'Xem chi tiết 12 tiêu chí ▼'}
        </button>
        <button
          type="button"
          onClick={() => setMoTuyChinh((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '0.75rem',
            color: '#6b5e52',
            textDecoration: 'underline',
          }}
        >
          {moTuyChinh ? 'Đóng tùy chỉnh ngưỡng' : 'Tùy chỉnh ngưỡng'}
        </button>
      </div>

      {moTuyChinh && (
        <div
          style={{
            background: '#f4efe4',
            border: '1px solid rgba(28,22,18,0.15)',
            padding: '0.85rem',
            marginBottom: '0.85rem',
            fontSize: '0.78rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <strong>Ngưỡng chấm điểm SEO</strong>
            <button
              type="button"
              onClick={khoiPhucMacDinh}
              style={{
                background: 'none',
                border: 'none',
                color: '#c0562c',
                fontSize: '0.75rem',
                textDecoration: 'underline',
              }}
            >
              Khôi phục mặc định
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <label>
              Số từ tối thiểu
              <input
                type="number"
                className="nh-input"
                value={nguong.soTuMin}
                onChange={(e) => capNhatNguong({ soTuMin: Math.max(50, Number(e.target.value) || 50) })}
              />
            </label>
            <label>
              Số mục H2 tối thiểu
              <input
                type="number"
                className="nh-input"
                value={nguong.soH2Min}
                onChange={(e) => capNhatNguong({ soH2Min: Math.max(0, Number(e.target.value) || 0) })}
              />
            </label>
          </div>
        </div>
      )}

      {moChiTiet && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {nhomDanhSach.map((nhom) => {
            const mucCon = ketQua.tieuChi.filter((t) => t.nhom === nhom);
            return (
              <div
                key={nhom}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(28, 22, 18, 0.12)',
                  padding: '0.75rem 0.85rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#6b5e52',
                    marginBottom: '0.55rem',
                  }}
                >
                  {NHAN_NHOM[nhom]}
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem',
                  }}
                >
                  {mucCon.map((tc) => (
                    <li
                      key={tc.ma}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}
                    >
                      <MauCham muc={tc.muc} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                          }}
                        >
                          <strong style={{ color: '#1c1612' }}>{tc.ten}</strong>
                          <span style={{ color: '#6b5e52', fontSize: '0.74rem' }}>
                            {tc.hienTai}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: '0.15rem 0 0',
                            fontSize: '0.75rem',
                            color: '#5a4e43',
                            lineHeight: 1.4,
                          }}
                        >
                          {tc.goiY}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
