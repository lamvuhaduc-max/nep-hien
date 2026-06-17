'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type DropItem = { label: string; href: string };
type NavItem  = { label: string; href: string; dropdown?: DropItem[] };

const NAV: NavItem[] = [
  { label: 'Giới Thiệu', href: '#about' },
  {
    label: 'Dịch Vụ',
    href: '#services',
    dropdown: [
      { label: 'Thiết kế nội thất',   href: '#services' },
      { label: 'Thi công trọn gói',   href: '#services' },
      { label: 'Cải tạo không gian',  href: '#services' },
    ],
  },
  {
    label: 'Dự Án',
    href: '#projects',
    dropdown: [
      { label: 'Căn hộ hiện đại',     href: '#projects' },
      { label: 'Chung cư Indochine',   href: '#projects' },
      { label: 'Văn phòng tối giản',  href: '#projects' },
      { label: 'Xem tất cả →',        href: '#projects' },
    ],
  },
  { label: 'Phong Cách', href: '#projects' },
  { label: 'Báo Giá',    href: '#contact-form' },
  { label: 'Cẩm Nang',  href: '#about' },
  { label: 'Liên Hệ',   href: '#about' },
];

export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [navOpen,     setNavOpen]     = useState(false);
  const [openDrop,    setOpenDrop]    = useState<string | null>(null);
  const [topBarHide,  setTopBarHide]  = useState(false);
  const lastScrollY  = useRef(0);
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      setTopBarHide(y > 40);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setNavOpen(false); setOpenDrop(null); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const closeAll = useCallback(() => {
    setNavOpen(false);
    setOpenDrop(null);
  }, []);

  const toggleDrop = (label: string) =>
    setOpenDrop(prev => (prev === label ? null : label));

  const openDropDelayed = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDrop(label);
  };

  const closeDropDelayed = () => {
    closeTimer.current = setTimeout(() => setOpenDrop(null), 180);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="site-header">

      {/* ── TOP BAR ── */}
      <div className={`top-bar${topBarHide ? ' top-bar--hide' : ''}`}>
        <div className="wrap top-bar-inner">
          <span className="top-tagline">
            ✦ Thiết kế · Thi công · Kiến tạo không gian sống — Since 2016
          </span>
          <div className="top-contacts">
            <a href="tel:+84901234567" aria-label="Gọi điện">☎ 0901 234 567</a>
            <a href="mailto:hello@nephien.vn" aria-label="Gửi email">✉ Email</a>
            <a href="#" aria-label="Zalo">Zalo</a>
            <a href="#" aria-label="Facebook">Facebook</a>
            <a href="#" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR ── */}
      <div className="nav-bar">
        <div className="wrap header-inner">

          {/* Logo */}
          <Link href="/" className="logo-wrap" aria-label="Nếp Hiên – Trang chủ" onClick={closeAll}>
            <Image
              src="/logo.svg"
              alt="Nếp Hiên"
              width={130}
              height={38}
              className="logo-img"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="site-nav" id="site-nav" aria-label="Menu chính">
            <ul>
              {NAV.map(item => (
                <li
                  key={item.label}
                  className={item.dropdown ? 'has-dropdown' : ''}
                  onMouseEnter={() => item.dropdown && openDropDelayed(item.label)}
                  onMouseLeave={() => item.dropdown && closeDropDelayed()}
                >
                  <a
                    href={item.href}
                    onClick={item.dropdown
                      ? (e) => { e.preventDefault(); toggleDrop(item.label); }
                      : closeAll}
                    aria-haspopup={!!item.dropdown}
                    aria-expanded={openDrop === item.label}
                  >
                    {item.label}
                    {item.dropdown && (
                      <span className={`drop-arrow${openDrop === item.label ? ' open' : ''}`} aria-hidden="true">▾</span>
                    )}
                  </a>

                  {item.dropdown && (
                    <ul
                      className={`dropdown${openDrop === item.label ? ' open' : ''}`}
                      role="menu"
                      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
                      onMouseLeave={closeDropDelayed}
                    >
                      {item.dropdown.map(d => (
                        <li key={d.label} role="none">
                          <a href={d.href} role="menuitem" onClick={closeAll}>{d.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA + hamburger */}
          <div className="header-right">
            <a href="#contact-form" className="btn btn-cta" onClick={closeAll}>
              Đăng Ký Tư Vấn
            </a>
            <button
              className={`nav-toggle${navOpen ? ' active' : ''}`}
              onClick={() => setNavOpen(o => !o)}
              aria-label={navOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={navOpen}
              aria-controls="mobile-nav"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE NAV ── */}
      <nav
        id="mobile-nav"
        className={`mobile-nav${navOpen ? ' open' : ''}`}
        aria-label="Menu mobile"
        aria-hidden={!navOpen}
      >
        <ul>
          {NAV.map(item => (
            <li key={item.label} className={item.dropdown ? 'mob-has-drop' : ''}>
              {item.dropdown ? (
                <>
                  <button
                    className={`mob-drop-toggle${openDrop === item.label ? ' open' : ''}`}
                    onClick={() => toggleDrop(item.label)}
                    aria-expanded={openDrop === item.label}
                  >
                    {item.label} <span className="drop-arrow" aria-hidden="true">▾</span>
                  </button>
                  <ul className={`mob-dropdown${openDrop === item.label ? ' open' : ''}`}>
                    {item.dropdown.map(d => (
                      <li key={d.label}>
                        <a href={d.href} onClick={closeAll}>{d.label}</a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <a href={item.href} onClick={closeAll}>{item.label}</a>
              )}
            </li>
          ))}
          <li>
            <a href="#contact-form" className="mob-cta" onClick={closeAll}>
              Đăng Ký Tư Vấn
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
