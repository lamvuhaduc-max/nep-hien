'use client';

import { useState } from 'react';
import { ThongTinPhienAdmin, VaiTroQuanTri } from '@/lib/auth-admin';
import { TaiKhoanQuanTriDto } from '@/lib/content/bai-viet-service';

interface Props {
  taiKhoanList: TaiKhoanQuanTriDto[];
  nguoiDungHienTai: ThongTinPhienAdmin | null;
  onDaThayDoi: () => void;
}

function dinhDangThoiGian(iso: string | null): string {
  if (!iso) return 'Chưa đăng nhập';
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

export function TabTaiKhoan({
  taiKhoanList,
  nguoiDungHienTai,
  onDaThayDoi,
}: Props) {
  const laSuperAdmin = nguoiDungHienTai?.vaiTro === 'super_admin';

  // Form tạo tài khoản mới (dành cho Super Admin)
  const [tkMoi, setTkMoi] = useState('');
  const [hoTenMoi, setHoTenMoi] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [vaiTroMoi, setVaiTroMoi] = useState<VaiTroQuanTri>('admin');
  const [dangTao, setDangTao] = useState(false);

  // Chỉnh sửa dòng
  const [dangSuaId, setDangSuaId] = useState<number | null>(null);
  const [hoTenSua, setHoTenSua] = useState('');
  const [vaiTroSua, setVaiTroSua] = useState<VaiTroQuanTri>('admin');
  const [matKhauCapLai, setMatKhauCapLai] = useState('');

  // Form tự đổi mật khẩu cá nhân
  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauCaNhanMoi, setMatKhauCaNhanMoi] = useState('');
  const [dangDoiMk, setDangDoiMk] = useState(false);

  const [thongBao, setThongBao] = useState<{ loai: 'ok' | 'loi'; chu: string } | null>(
    null,
  );

  async function xuLyTaoTaiKhoan(e: React.FormEvent) {
    e.preventDefault();
    if (!tkMoi.trim() || !hoTenMoi.trim() || !matKhauMoi) return;
    setDangTao(true);
    setThongBao(null);
    try {
      const res = await fetch('/api/v1/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taiKhoan: tkMoi.trim(),
          hoTen: hoTenMoi.trim(),
          matKhau: matKhauMoi,
          vaiTro: vaiTroMoi,
          kichHoat: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể tạo tài khoản.' });
      } else {
        setTkMoi('');
        setHoTenMoi('');
        setMatKhauMoi('');
        setVaiTroMoi('admin');
        setThongBao({
          loai: 'ok',
          chu: `Đã tạo tài khoản "${data.taiKhoan}" với vai trò ${
            data.vaiTro === 'super_admin' ? 'Super Admin' : 'Admin'
          }.`,
        });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối máy chủ.' });
    } finally {
      setDangTao(false);
    }
  }

  function batDauSua(tk: TaiKhoanQuanTriDto) {
    setDangSuaId(tk.id);
    setHoTenSua(tk.hoTen);
    setVaiTroSua(tk.vaiTro);
    setMatKhauCapLai('');
    setThongBao(null);
  }

  async function luuSuaTaiKhoan(id: number) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hoTen: hoTenSua.trim(),
          vaiTro: vaiTroSua,
          matKhauMoi: matKhauCapLai.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể cập nhật tài khoản.' });
      } else {
        setDangSuaId(null);
        setMatKhauCapLai('');
        setThongBao({
          loai: 'ok',
          chu: `Đã cập nhật tài khoản "${data.taiKhoan}".`,
        });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi cập nhật tài khoản.' });
    }
  }

  async function doiTrangThaiKhoa(tk: TaiKhoanQuanTriDto) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/accounts/${tk.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kichHoat: !tk.kichHoat }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể đổi trạng thái.' });
      } else {
        setThongBao({
          loai: 'ok',
          chu: data.kichHoat
            ? `Đã mở khóa tài khoản "${data.taiKhoan}".`
            : `Đã khóa tài khoản "${data.taiKhoan}".`,
        });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối máy chủ.' });
    }
  }

  async function xuLyXoaTaiKhoan(tk: TaiKhoanQuanTriDto) {
    setThongBao(null);
    try {
      const res = await fetch(`/api/v1/admin/accounts/${tk.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể xóa tài khoản.' });
      } else {
        setThongBao({ loai: 'ok', chu: `Đã xóa tài khoản "${tk.taiKhoan}".` });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối khi xóa tài khoản.' });
    }
  }

  async function xuLyDoiMatKhauCaNhan(e: React.FormEvent) {
    e.preventDefault();
    if (!matKhauCu || !matKhauCaNhanMoi) return;
    setDangDoiMk(true);
    setThongBao(null);
    try {
      const res = await fetch('/api/v1/admin/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matKhauHienTai: matKhauCu,
          matKhauMoi: matKhauCaNhanMoi,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBao({ loai: 'loi', chu: data.message || 'Không thể đổi mật khẩu.' });
      } else {
        setMatKhauCu('');
        setMatKhauCaNhanMoi('');
        setThongBao({ loai: 'ok', chu: 'Đã đổi mật khẩu cá nhân thành công!' });
        onDaThayDoi();
      }
    } catch {
      setThongBao({ loai: 'loi', chu: 'Lỗi kết nối máy chủ.' });
    } finally {
      setDangDoiMk(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Ma trận phân quyền Super Admin vs Admin */}
      <div
        className="nh-card"
        style={{
          padding: '1.15rem 1.35rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          background: '#f4efe4',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                padding: '0.18rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: '#221610',
                color: '#c9a96e',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              SUPER ADMIN
            </span>
            <strong style={{ fontSize: '0.86rem' }}>Toàn quyền hệ thống</strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#5a4e43', margin: 0, lineHeight: 1.5 }}>
            Quản lý toàn bộ bài viết, danh mục, tạo/sửa/khóa/xóa tài khoản quản trị, gán quyền{' '}
            <code>super_admin</code> / <code>admin</code>, cấp lại mật khẩu và tra cứu toàn bộ nhật
            ký hoạt động.
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                padding: '0.18rem 0.55rem',
                fontSize: '0.7rem',
                fontWeight: 700,
                background: '#e6f4ea',
                color: '#137333',
                border: '1px solid #b7e1cd',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              ADMIN
            </span>
            <strong style={{ fontSize: '0.86rem' }}>Quản trị nội dung &amp; Biên tập</strong>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#5a4e43', margin: 0, lineHeight: 1.5 }}>
            Tạo, sửa, xuất bản, ẩn, xóa mềm/khôi phục bài viết, quản lý danh mục, soi chuẩn SEO,
            xem nhật ký hoạt động và tự đổi mật khẩu cá nhân.
          </p>
        </div>
      </div>

      {thongBao && (
        <div
          role="status"
          style={{
            padding: '0.85rem 1.15rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            background: thongBao.loai === 'ok' ? '#e6f4ea' : '#fce8e6',
            color: thongBao.loai === 'ok' ? '#137333' : '#c5221f',
            border: `1px solid ${thongBao.loai === 'ok' ? '#b7e1cd' : '#f6aea9'}`,
          }}
        >
          {thongBao.chu}
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '370px minmax(0, 1fr)',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* CỘT TRÁI: TẠO TÀI KHOẢN MỚI + ĐỔI MẬT KHẨU CÁ NHÂN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {laSuperAdmin ? (
            <form
              onSubmit={xuLyTaoTaiKhoan}
              className="nh-card"
              style={{ padding: '1.35rem' }}
              data-testid="create-account-form"
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  margin: '0 0 0.35rem',
                }}
              >
                Tạo tài khoản quản trị mới
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#6b5e52', margin: '0 0 1rem' }}>
                Cấp tài khoản mới cho thành viên quản trị hoặc biên tập viên Nếp Hiên.
              </p>

              <div style={{ marginBottom: '0.8rem' }}>
                <label
                  htmlFor="tk-moi-email"
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}
                >
                  Tài khoản / Email đăng nhập *
                </label>
                <input
                  id="tk-moi-email"
                  type="text"
                  required
                  className="nh-input"
                  placeholder="VD: kts.hoang@nephien.com"
                  value={tkMoi}
                  onChange={(e) => setTkMoi(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label
                  htmlFor="tk-moi-hoten"
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}
                >
                  Họ tên hiển thị *
                </label>
                <input
                  id="tk-moi-hoten"
                  type="text"
                  required
                  className="nh-input"
                  placeholder="VD: KTS. Hoàng Bách"
                  value={hoTenMoi}
                  onChange={(e) => setHoTenMoi(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label
                  htmlFor="tk-moi-vaitro"
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}
                >
                  Vai trò (Role) *
                </label>
                <select
                  id="tk-moi-vaitro"
                  className="nh-select"
                  value={vaiTroMoi}
                  onChange={(e) => setVaiTroMoi(e.target.value as VaiTroQuanTri)}
                >
                  <option value="admin">Admin — Quản trị bài viết &amp; danh mục</option>
                  <option value="super_admin">Super Admin — Toàn quyền hệ thống</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label
                  htmlFor="tk-moi-matkhau"
                  style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: 4 }}
                >
                  Mật khẩu khởi tạo (tối thiểu 6 ký tự) *
                </label>
                <input
                  id="tk-moi-matkhau"
                  type="password"
                  required
                  minLength={6}
                  className="nh-input"
                  placeholder="Nhập mật khẩu..."
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={dangTao}
                className="nh-btn nh-btn-primary"
                style={{ width: '100%' }}
              >
                {dangTao ? 'Đang tạo tài khoản...' : '+ Tạo tài khoản'}
              </button>
            </form>
          ) : (
            <div className="nh-card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.4rem' }}>
                Quyền hạn hiện tại: ADMIN
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#5a4e43', margin: 0, lineHeight: 1.55 }}>
                Tài khoản của bạn có quyền quản lý bài viết và danh mục. Chức năng tạo hoặc phân
                quyền tài khoản khác chỉ dành cho <strong>Super Admin</strong>.
              </p>
            </div>
          )}

          {/* Form tự đổi mật khẩu cá nhân */}
          <form onSubmit={xuLyDoiMatKhauCaNhan} className="nh-card" style={{ padding: '1.35rem' }}>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                margin: '0 0 0.35rem',
              }}
            >
              Đổi mật khẩu của tôi
            </h3>
            <p style={{ fontSize: '0.76rem', color: '#6b5e52', margin: '0 0 0.9rem' }}>
              Đang đăng nhập: <strong>{nguoiDungHienTai?.taiKhoan}</strong>
            </p>

            <div style={{ marginBottom: '0.75rem' }}>
              <label
                htmlFor="mk-hientai"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: 4 }}
              >
                Mật khẩu hiện tại *
              </label>
              <input
                id="mk-hientai"
                type="password"
                required
                className="nh-input"
                value={matKhauCu}
                onChange={(e) => setMatKhauCu(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '0.95rem' }}>
              <label
                htmlFor="mk-moi-canhan"
                style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: 4 }}
              >
                Mật khẩu mới (tối thiểu 6 ký tự) *
              </label>
              <input
                id="mk-moi-canhan"
                type="password"
                required
                minLength={6}
                className="nh-input"
                value={matKhauCaNhanMoi}
                onChange={(e) => setMatKhauCaNhanMoi(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={dangDoiMk}
              className="nh-btn nh-btn-dark"
              style={{ width: '100%' }}
            >
              {dangDoiMk ? 'Đang cập nhật...' : 'Cập nhật mật khẩu cá nhân'}
            </button>
          </form>
        </div>

        {/* CỘT PHẢI: BẢNG DANH SÁCH TÀI KHOẢN QUẢN TRỊ */}
        <div className="nh-card" style={{ padding: '1.35rem', overflowX: 'auto' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '0 0 1rem' }}>
            Danh sách tài khoản quản trị ({taiKhoanList.length})
          </h3>

          <table className="nh-table" data-testid="accounts-table">
            <thead>
              <tr>
                <th>Tài khoản &amp; Họ tên</th>
                <th style={{ width: 145 }}>Vai trò (Role)</th>
                <th style={{ width: 130 }}>Trạng thái</th>
                <th style={{ width: 155 }}>Đăng nhập cuối</th>
                {laSuperAdmin && <th style={{ width: 210, textAlign: 'right' }}>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {taiKhoanList.map((tk) => {
                const dangSua = dangSuaId === tk.id;
                const laChinhMinh = nguoiDungHienTai?.id === tk.id;
                return (
                  <tr key={tk.id}>
                    <td>
                      {dangSua ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <input
                            type="text"
                            className="nh-input"
                            value={hoTenSua}
                            onChange={(e) => setHoTenSua(e.target.value)}
                            placeholder="Họ tên hiển thị"
                          />
                          <input
                            type="password"
                            className="nh-input"
                            value={matKhauCapLai}
                            onChange={(e) => setMatKhauCapLai(e.target.value)}
                            placeholder="Mật khẩu mới (để trống nếu giữ nguyên)"
                          />
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontWeight: 700, color: '#1c1612' }}>
                            {tk.hoTen}{' '}
                            {laChinhMinh && (
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  color: '#c0562c',
                                  fontWeight: 600,
                                }}
                              >
                                (Bạn)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#6b5e52' }}>
                            <code>{tk.taiKhoan}</code>
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {dangSua ? (
                        <select
                          className="nh-select"
                          value={vaiTroSua}
                          onChange={(e) => setVaiTroSua(e.target.value as VaiTroQuanTri)}
                          disabled={laChinhMinh}
                        >
                          <option value="admin">ADMIN</option>
                          <option value="super_admin">SUPER ADMIN</option>
                        </select>
                      ) : tk.vaiTro === 'super_admin' ? (
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.22rem 0.6rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            background: '#221610',
                            color: '#c9a96e',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="nh-status-badge nh-status-dang">ADMIN</span>
                      )}
                    </td>
                    <td>
                      {tk.kichHoat ? (
                        <span className="nh-status-badge nh-status-dang">Đang hoạt động</span>
                      ) : (
                        <span className="nh-status-badge nh-status-xoa">Đã khóa</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#5a4e43' }}>
                      {dinhDangThoiGian(tk.lanDangNhapCuoi)}
                    </td>
                    {laSuperAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        {dangSua ? (
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => luuSuaTaiKhoan(tk.id)}
                              className="nh-btn nh-btn-primary"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Lưu
                            </button>
                            <button
                              type="button"
                              onClick={() => setDangSuaId(null)}
                              className="nh-btn"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: 'inline-flex',
                              flexWrap: 'wrap',
                              gap: 6,
                              justifyContent: 'flex-end',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => batDauSua(tk)}
                              className="nh-btn"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            >
                              Sửa / Cấp MK
                            </button>
                            {!laChinhMinh && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => doiTrangThaiKhoa(tk)}
                                  className="nh-btn"
                                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                                >
                                  {tk.kichHoat ? 'Khóa' : 'Mở khóa'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => xuLyXoaTaiKhoan(tk)}
                                  className="nh-btn"
                                  style={{
                                    padding: '0.35rem 0.65rem',
                                    fontSize: '0.75rem',
                                    color: '#c5221f',
                                  }}
                                >
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
