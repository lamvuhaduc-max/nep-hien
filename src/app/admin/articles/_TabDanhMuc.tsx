'use client';

import { useState } from 'react';
import { DanhMucBaiVietDto } from '@/lib/content/bai-viet-service';
import { taoSlug } from '@/lib/content/muc-luc';

interface Props {
  danhMuc: DanhMucBaiVietDto[];
  onDaThayDoi: () => void;
}

export function TabDanhMuc({ danhMuc, onDaThayDoi }: Props) {
  const [tenMoi, setTenMoi] = useState('');
  const [slugMoi, setSlugMoi] = useState('');
  const [moTaMoi, setMoTaMoi] = useState('');
  const [thuTuMoi, setThuTuMoi] = useState<number>(danhMuc.length + 1);
  const [dangTao, setDangTao] = useState(false);

  const [dangSuaId, setDangSuaId] = useState<number | null>(null);
  const [tenSua, setTenSua] = useState('');
  const [slugSua, setSlugSua] = useState('');
  const [moTaSua, setMoTaSua] = useState('');
  const [thuTuSua, setThuTuSua] = useState<number>(0);

  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(null);

  async function xuLyTaoDanhMuc(e: React.FormEvent) {
    e.preventDefault();
    if (!tenMoi.trim()) return;
    setDangTao(true);
    setThongBao(null);
    try {
      const res = await fetch('/api/v1/admin/article-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten: tenMoi.trim(),
          slug: slugMoi.trim() || undefined,
          moTa: moTaMoi.trim() || null,
          thuTu: Number(thuTuMoi) || 0,
          hien: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể tạo danh mục.' });
      } else {
        setTenMoi('');
        setSlugMoi('');
        setMoTaMoi('');
        setThuTuMoi(danhMuc.length + 2);
        setThongBao({ loai: 'ok', chu: `Đã thêm danh mục "${data.ten}".` });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi tạo danh mục.' });
    } finally {
      setDangTao(false);
    }
  }

  function batDauSua(dm: DanhMucBaiVietDto) {
    setDangSuaId(dm.id);
    setTenSua(dm.ten);
    setSlugSua(dm.slug);
    setMoTaSua(dm.moTa ?? '');
    setThuTuSua(dm.thuTu);
    setThongBao(null);
  }

  async function luuSuaDanhMuc(id: number) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/article-categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ten: tenSua.trim(),
          slug: slugSua.trim(),
          moTa: moTaSua.trim() || null,
          thuTu: Number(thuTuSua) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể cập nhật danh mục.' });
      } else {
        setDangSuaId(null);
        setThongBao({ loai: 'ok', chu: `Đã cập nhật danh mục "${data.ten}".` });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi cập nhật danh mục.' });
    }
  }

  async function doiHienThi(dm: DanhMucBaiVietDto) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/article-categories/${dm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hien: !dm.hien }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể đổi hiển thị.' });
      } else {
        setThongBao({
          loai: 'ok',
          chu: data.hien
            ? `Đã bật hiển thị công khai danh mục "${data.ten}".`
            : `Đã ẩn danh mục "${data.ten}" khỏi trang công khai.`,
        });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi đổi trạng thái danh mục.' });
    }
  }

  async function xuLyXoaDanhMuc(dm: DanhMucBaiVietDto) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/article-categories/${dm.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể xóa danh mục.' });
      } else {
        setThongBao({ loai: 'ok', chu: `Đã xóa danh mục "${dm.ten}".` });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi xóa danh mục.' });
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '380px minmax(0, 1fr)', gap: '1.5rem' }}>
      {/* Cột trái: Form thêm danh mục mới */}
      <form onSubmit={xuLyTaoDanhMuc} className="nh-card" style={{ padding: '1.35rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            margin: '0 0 0.35rem',
          }}
        >
          Thêm danh mục mới
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#6b5e52', margin: '0 0 1.1rem' }}>
          Phân loại bài viết theo chủ đề kiến trúc, nội thất hoặc chính sách.
        </p>

        <div style={{ marginBottom: '0.85rem' }}>
          <label
            htmlFor="dm-ten-moi"
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}
          >
            Tên danh mục *
          </label>
          <input
            id="dm-ten-moi"
            type="text"
            required
            className="nh-input"
            placeholder="VD: Kiến trúc Xanh & Vi khí hậu"
            value={tenMoi}
            onChange={(e) => {
              setTenMoi(e.target.value);
              setSlugMoi(taoSlug(e.target.value));
            }}
          />
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <label
            htmlFor="dm-slug-moi"
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}
          >
            Đường dẫn tĩnh (slug)
          </label>
          <input
            id="dm-slug-moi"
            type="text"
            className="nh-input"
            placeholder="kien-truc-xanh-va-vi-khi-hau"
            value={slugMoi}
            onChange={(e) => setSlugMoi(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <label
            htmlFor="dm-mota-moi"
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}
          >
            Mô tả chuyên mục
          </label>
          <textarea
            id="dm-mota-moi"
            rows={3}
            className="nh-textarea"
            placeholder="Giới thiệu ngắn về nội dung chuyên mục..."
            value={moTaMoi}
            onChange={(e) => setMoTaMoi(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1.1rem' }}>
          <label
            htmlFor="dm-thutu-moi"
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}
          >
            Thứ tự hiển thị
          </label>
          <input
            id="dm-thutu-moi"
            type="number"
            className="nh-input"
            value={thuTuMoi}
            onChange={(e) => setThuTuMoi(Number(e.target.value) || 0)}
          />
        </div>

        <button type="submit" disabled={dangTao} className="nh-btn nh-btn-primary" style={{ width: '100%' }}>
          {dangTao ? 'Đang lưu...' : '+ Thêm danh mục'}
        </button>
      </form>

      {/* Cột phải: Bảng danh mục hiện có */}
      <div className="nh-card" style={{ padding: '1.35rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: 0 }}>
            Danh sách danh mục ({danhMuc.length})
          </h3>
        </div>

        {thongBao && (
          <div
            role="status"
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.84rem',
              background: thongBao.loai === 'ok' ? '#e6f4ea' : '#fce8e6',
              color: thongBao.loai === 'ok' ? '#137333' : '#c5221f',
              border: `1px solid ${thongBao.loai === 'ok' ? '#b7e1cd' : '#f6aea9'}`,
            }}
          >
            {thongBao.chu}
          </div>
        )}

        <table className="nh-table">
          <thead>
            <tr>
              <th style={{ width: 65 }}>Thứ tự</th>
              <th>Tên danh mục & Đường dẫn</th>
              <th>Mô tả</th>
              <th style={{ width: 95 }}>Số bài</th>
              <th style={{ width: 120 }}>Trạng thái</th>
              <th style={{ width: 170, textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {danhMuc.map((dm) => {
              const dangSua = dangSuaId === dm.id;
              return (
                <tr key={dm.id}>
                  <td>
                    {dangSua ? (
                      <input
                        type="number"
                        className="nh-input"
                        style={{ width: 60, padding: '0.35rem' }}
                        value={thuTuSua}
                        onChange={(e) => setThuTuSua(Number(e.target.value) || 0)}
                      />
                    ) : (
                      <strong>#{dm.thuTu}</strong>
                    )}
                  </td>
                  <td>
                    {dangSua ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <input
                          type="text"
                          className="nh-input"
                          value={tenSua}
                          onChange={(e) => setTenSua(e.target.value)}
                        />
                        <input
                          type="text"
                          className="nh-input"
                          value={slugSua}
                          onChange={(e) => setSlugSua(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: 600, color: '#1c1612' }}>{dm.ten}</div>
                        <div style={{ fontSize: '0.76rem', color: '#6b5e52' }}>/bai-viet?danhMuc={dm.slug}</div>
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#5a4e43' }}>
                    {dangSua ? (
                      <textarea
                        rows={2}
                        className="nh-textarea"
                        value={moTaSua}
                        onChange={(e) => setMoTaSua(e.target.value)}
                      />
                    ) : (
                      dm.moTa || '—'
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{dm.soBaiViet ?? 0} bài</span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => doiHienThi(dm)}
                      className={`nh-status-badge ${dm.hien ? 'nh-status-dang' : 'nh-status-an'}`}
                      title="Bấm để bật/tắt hiển thị công khai"
                    >
                      {dm.hien ? 'Đang hiện' : 'Đang ẩn'}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {dangSua ? (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => luuSuaDanhMuc(dm.id)}
                          className="nh-btn nh-btn-primary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                        >
                          Lưu
                        </button>
                        <button
                          type="button"
                          onClick={() => setDangSuaId(null)}
                          className="nh-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => batDauSua(dm)}
                          className="nh-btn"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => xuLyXoaDanhMuc(dm)}
                          className="nh-btn"
                          style={{
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.76rem',
                            color: '#c5221f',
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
