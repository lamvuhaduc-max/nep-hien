export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="logo-name">Nếp Hiên</span>
          <p>Nội Thất · Furniture &amp; Interiors</p>
        </div>

        <nav className="footer-nav" aria-label="Điều hướng footer">
          <ul>
            <li><a href="#services">Dịch vụ</a></li>
            <li><a href="#projects">Dự án</a></li>
            <li><a href="#about">Giới thiệu</a></li>
            <li><a href="#contact-form">Liên hệ</a></li>
          </ul>
        </nav>

        <p className="footer-copy">
          © {year} Nếp Hiên &nbsp;·&nbsp; 14 Đường 41, An Khánh, TP.HCM
          &nbsp;·&nbsp;
          <a href="https://nephien.com" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>nephien.com</a>
        </p>
      </div>
    </footer>
  );
}
