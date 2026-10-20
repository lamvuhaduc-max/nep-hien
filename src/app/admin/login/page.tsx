'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import '@/app/bai-viet.css';

function FormDangNhapAdmin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin/articles';

  const [taiKhoan, setTaiKhoan] = useState('');
  const [matKhau, setMatKhau] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  async function xuLyDangNhap(e: React.FormEvent) {
    e.preventDefault();
    setDangXuLy(true);
    setLoi(null);
    try {
      const res = await fetch('/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taiKhoan, matKhau }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoi(data.message || 'Đăng nhập không thành công.');
      } else {
        router.push(nextUrl);
        router.refresh();
      }
    } catch {
      setLoi('Không thể kết nối máy chủ.');
    } finally {
      setDangXuLy(false);
    }
  }

  return (
    <div
      className="nh-admin-shell"
      style={{
        minHeight: '100vh',
        background: '#221610',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 1.25rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: '#fcfaf6',
          border: '1px solid rgba(201, 169, 110, 0.35)',
          padding: '2.5rem 2.25rem',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#c0562c',
              fontWeight: 700,
              marginBottom: '0.45rem',
            }}
          >
            Nếp Hiên Studio · CMS
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 500,
              color: '#1c1612',
              margin: '0 0 0.4rem',
            }}
          >
            Đăng nhập Quản trị
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#6b5e52', margin: 0 }}>
            Hệ thống quản lý bài viết, danh mục &amp; chuẩn SEO
          </p>
        </div>

        {loi && (
          <div
            role="alert"
            style={{
              padding: '0.75rem 0.95rem',
              marginBottom: '1.1rem',
              background: '#fce8e6',
              border: '1px solid #f6aea9',
              color: '#c5221f',
              fontSize: '0.82rem',
              fontWeight: 500,
            }}
          >
            {loi}
          </div>
        )}

        <form onSubmit={xuLyDangNhap}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="admin-user"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1c1612',
                marginBottom: 6,
              }}
            >
              Tài khoản / Email quản trị
            </label>
            <input
              id="admin-user"
              type="text"
              required
              autoComplete="username"
              className="nh-input"
              placeholder="admin@nephien.com hoặc admin"
              value={taiKhoan}
              onChange={(e) => setTaiKhoan(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: '1.4rem' }}>
            <label
              htmlFor="admin-pass"
              style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1c1612',
                marginBottom: 6,
              }}
            >
              Mật khẩu
            </label>
            <input
              id="admin-pass"
              type="password"
              required
              autoComplete="current-password"
              className="nh-input"
              placeholder="Nhập mật khẩu quản trị..."
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={dangXuLy}
            className="nh-btn nh-btn-primary"
            style={{ width: '100%', padding: '0.75rem 1.2rem', fontSize: '0.86rem' }}
          >
            {dangXuLy ? 'Đang xác thực...' : 'Đăng nhập vào trang quản trị →'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(28,22,18,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
          }}
        >
          <Link href="/" style={{ color: '#6b5e52' }}>
            ← Về trang chủ Nếp Hiên
          </Link>
          <Link href="/bai-viet" style={{ color: '#c0562c', fontWeight: 600 }}>
            Xem trang Bài viết ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="nh-admin-shell" />}>
      <FormDangNhapAdmin />
    </Suspense>
  );
}
