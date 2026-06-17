import Image from 'next/image';

export default function About() {
  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="wrap about-inner">
        {/* Text */}
        <div className="about-text">
          <p className="kicker">Về chúng tôi</p>
          <h2 id="about-heading" className="heading-lg" style={{ marginTop: 16 }}>
            Nếp Hiên —<br /><em>hơn 8 năm kiến tạo</em>
          </h2>
          <p>
            Chúng tôi tin rằng một không gian đẹp không chỉ cần thẩm mỹ — nó cần kể
            được câu chuyện của người sống trong đó. Đội ngũ Nếp Hiên kết hợp kinh
            nghiệm thiết kế dày dặn với sự lắng nghe thực sự để mang đến công trình
            vừa ý, vừa lòng bạn.
          </p>

          <address className="contact-info" aria-label="Thông tin liên hệ Nếp Hiên">
            <div className="contact-item">
              <span className="contact-label">Địa chỉ</span>
              <span>14 Đường 41, An Khánh, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Điện thoại</span>
              <a href="tel:+84901234567">0901 234 567</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:hello@nephien.vn">hello@nephien.vn</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Giờ làm việc</span>
              <span>Thứ 2 – Thứ 7 &nbsp;·&nbsp; 8:00 – 18:00</span>
            </div>
          </address>
        </div>

        {/* Visual — logo on dark background */}
        <div className="about-visual">
          <div className="about-logo-bg">
            <Image
              src="/logo.svg"
              alt="Logo Nếp Hiên"
              width={360}
              height={106}
              style={{ width: '100%', maxWidth: 360, height: 'auto' }}
            />
          </div>
          <div className="about-badge">
            <strong>8+</strong>
            <span>năm<br />kinh nghiệm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
