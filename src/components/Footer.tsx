import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="wrap footer-grid">

        {/* Col 1 — Brand */}
        <div className="footer-brand-col">
          <Image src="/logo-light.svg" alt="Nếp Hiên" width={200} height={58}
            style={{ height: '48px', width: 'auto', marginBottom: 20 }} />
          <p className="footer-tagline">
            Kiến tạo không gian sống vừa đẹp vừa sống —
            nơi thẩm mỹ và công năng hoà quyện.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Zalo" className="footer-social-btn">Zalo</a>
            <a href="#" aria-label="Facebook" className="footer-social-btn">Facebook</a>
            <a href="#" aria-label="Instagram" className="footer-social-btn">Instagram</a>
          </div>
        </div>

        {/* Col 2 — Nav */}
        <div className="footer-col">
          <p className="footer-col-title">Khám phá</p>
          <nav>
            <ul className="footer-links">
              <li><Link href="/gioi-thieu">Giới Thiệu</Link></li>
              <li><Link href="/du-an">Dự Án</Link></li>
              <li><Link href="/phong-cach">Phong Cách</Link></li>
              <li><Link href="/bao-gia">Báo Giá</Link></li>
              <li><Link href="/#services">Dịch Vụ</Link></li>
            </ul>
          </nav>
        </div>

        {/* Col 3 — Contact */}
        <div className="footer-col">
          <p className="footer-col-title">Liên hệ</p>
          <address className="footer-contact">
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📍</span>
              <span>14 Đường 41, An Khánh,<br />TP. Hồ Chí Minh</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📞</span>
              <a href="tel:+84901234567">0901 234 567</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">✉</span>
              <a href="mailto:dvkh247@nephien.com">dvkh247@nephien.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">🌐</span>
              <a href="https://nephien.com" target="_blank" rel="noopener noreferrer">nephien.com</a>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">⏰</span>
              <span>Thứ 2 – Thứ 7 &nbsp;·&nbsp; 8:00 – 18:00</span>
            </div>
          </address>
        </div>

        {/* Col 4 — CTA */}
        <div className="footer-col">
          <p className="footer-col-title">Tư vấn miễn phí</p>
          <p className="footer-cta-text">
            Điền form — chúng tôi gọi lại trong vòng 24 giờ với phương án thiết kế phù hợp.
          </p>
          <Link href="/#contact-form" className="btn btn-gold footer-cta-btn">
            Đăng ký ngay →
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="wrap footer-bottom-inner">
          <p>© {year} Nếp Hiên · 14 Đường 41, An Khánh, TP.HCM</p>
          <p>
            <a href="https://nephien.com" target="_blank" rel="noopener noreferrer">nephien.com</a>
            &nbsp;·&nbsp; Thiết kế bởi Nếp Hiên Team
          </p>
        </div>
      </div>
    </footer>
  );
}
