'use client';

import Link from 'next/link';
import {
  ExternalLink,
  FilePlus2,
  FileText,
  FolderKanban,
  Globe,
  History,
  LogOut,
  type LucideIcon,
  MessageSquareText,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { ThongTinPhienAdmin } from '@/lib/auth-admin';

export type TabQuanTri = 'bai_viet' | 'danh_muc' | 'tu_van' | 'tai_khoan' | 'nhat_ky';

interface AdminSidebarProps {
  /** Tab hiện tại nếu đang ở trang /admin/articles, hoặc 'soan_thao' nếu đang ở trang tạo/sửa bài */
  mucDangChon: TabQuanTri | 'soan_thao';
  /** Callback khi người dùng bấm chọn tab ngay trên trang /admin/articles */
  onChonTab?: (tab: TabQuanTri) => void;
  nguoiDung?: ThongTinPhienAdmin | null;
  soBaiViet?: number;
  soDanhMuc?: number;
  soTuVan?: number;
  soTaiKhoan?: number;
}

export function AdminSidebar({
  mucDangChon,
  onChonTab,
  nguoiDung,
  soBaiViet,
  soDanhMuc,
  soTuVan,
  soTaiKhoan,
}: AdminSidebarProps) {
  async function xuLyDangXuat() {
    await fetch('/api/v1/admin/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  function renderMucMenu(
    tab: TabQuanTri,
    nhan: string,
    Icon: LucideIcon,
    soLuong?: number,
  ) {
    const dangActive = mucDangChon === tab;
    const href = tab === 'bai_viet' ? '/admin/articles' : `/admin/articles?tab=${tab}`;

    if (onChonTab) {
      return (
        <button
          key={tab}
          type="button"
          onClick={() => onChonTab(tab)}
          className={`nh-sidebar-link ${dangActive ? 'is-active' : ''}`}
        >
          <span className="nh-sidebar-link-main">
            <Icon size={17} strokeWidth={1.9} />
            <span>{nhan}</span>
          </span>
          {typeof soLuong === 'number' && (
            <span className="nh-sidebar-count">{soLuong}</span>
          )}
        </button>
      );
    }

    return (
      <Link
        key={tab}
        href={href}
        className={`nh-sidebar-link ${dangActive ? 'is-active' : ''}`}
      >
        <span className="nh-sidebar-link-main">
          <Icon size={17} strokeWidth={1.9} />
          <span>{nhan}</span>
        </span>
        {typeof soLuong === 'number' && (
          <span className="nh-sidebar-count">{soLuong}</span>
        )}
      </Link>
    );
  }

  return (
    <aside className="nh-admin-sidebar" aria-label="Menu quản trị Nếp Hiên">
      <div className="nh-sidebar-top">
        {/* Thương hiệu */}
        <div className="nh-sidebar-brand">
          <Link href="/admin/articles" className="nh-sidebar-logo">
            NẾP HIÊN
          </Link>
          <span className="nh-sidebar-subtitle">Studio CMS · Neon DB</span>
        </div>

        {/* Nút CTA tạo bài viết mới */}
        <div style={{ padding: '0 1.1rem', marginBottom: '1.25rem' }}>
          <Link
            href="/admin/articles/moi"
            className={`nh-sidebar-cta ${mucDangChon === 'soan_thao' ? 'is-active' : ''}`}
          >
            <FilePlus2 size={17} strokeWidth={2} />
            <span>Viết bài mới</span>
          </Link>
        </div>

        {/* Nhóm điều hướng chính */}
        <nav className="nh-sidebar-nav">
          <div className="nh-sidebar-section-label">Quản lý nội dung</div>
          {renderMucMenu('bai_viet', 'Danh sách bài viết', FileText, soBaiViet)}
          {renderMucMenu('danh_muc', 'Quản lý danh mục', FolderKanban, soDanhMuc)}
          {renderMucMenu('tu_van', 'Yêu cầu tư vấn', MessageSquareText, soTuVan)}

          <div className="nh-sidebar-section-label" style={{ marginTop: '1.15rem' }}>
            Hệ thống &amp; Bảo mật
          </div>
          {renderMucMenu('tai_khoan', 'Quản trị tài khoản', Users, soTaiKhoan)}
          {renderMucMenu('nhat_ky', 'Nhật ký hệ thống', History)}

          <div className="nh-sidebar-section-label" style={{ marginTop: '1.15rem' }}>
            Liên kết nhanh
          </div>
          <Link href="/bai-viet" className="nh-sidebar-link">
            <span className="nh-sidebar-link-main">
              <ExternalLink size={16} strokeWidth={1.8} />
              <span>Trang bài viết công khai</span>
            </span>
          </Link>
          <Link href="/" className="nh-sidebar-link">
            <span className="nh-sidebar-link-main">
              <Globe size={16} strokeWidth={1.8} />
              <span>Trang chủ Nếp Hiên</span>
            </span>
          </Link>
        </nav>
      </div>

      {/* Chân Sidebar: Thông tin người dùng & Đăng xuất */}
      <div className="nh-sidebar-footer">
        {nguoiDung && (
          <div
            className="nh-sidebar-user"
            onClick={() => {
              if (onChonTab) {
                onChonTab('tai_khoan');
              } else {
                window.location.href = '/admin/articles?tab=tai_khoan';
              }
            }}
            title="Bấm để mở Quản trị Tài khoản"
          >
            <div className="nh-sidebar-avatar">
              <ShieldCheck size={16} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="nh-sidebar-user-name">{nguoiDung.hoTen}</div>
              <div className="nh-sidebar-user-email">{nguoiDung.taiKhoan}</div>
            </div>
            <span
              className="nh-sidebar-role-badge"
              style={{
                background: nguoiDung.vaiTro === 'super_admin' ? '#c9a96e' : '#c0562c',
                color: nguoiDung.vaiTro === 'super_admin' ? '#221610' : '#ffffff',
              }}
            >
              {nguoiDung.vaiTro === 'super_admin' ? 'SUPER' : 'ADMIN'}
            </span>
          </div>
        )}

        <button type="button" onClick={xuLyDangXuat} className="nh-sidebar-logout">
          <LogOut size={16} strokeWidth={1.9} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
