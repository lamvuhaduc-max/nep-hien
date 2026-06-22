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
          <p style={{ marginTop: 20, lineHeight: 1.85 }}>
            Chúng tôi tin rằng một không gian đẹp không chỉ cần thẩm mỹ — nó cần kể
            được câu chuyện của người sống trong đó. Đội ngũ Nếp Hiên kết hợp kinh
            nghiệm thiết kế dày dặn với sự lắng nghe thực sự để mang đến công trình
            vừa ý, vừa lòng bạn.
          </p>
          <div className="about-badges">
            {[
              { num: '200+', label: 'Công trình' },
              { num: '98%',  label: 'Hài lòng'  },
              { num: '24T',  label: 'Bảo hành'  },
            ].map(b => (
              <div key={b.label} className="about-mini-badge">
                <strong>{b.num}</strong>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual — brand showcase */}
        <div className="about-visual">
          <div className="about-brand-wrap">
            {/* Dark background brand panel */}
            <div className="about-brand-panel">
              <Image
                src="/logo-light.svg"
                alt="Logo Nếp Hiên"
                width={340}
                height={100}
                style={{ width: '100%', maxWidth: 320, height: 'auto' }}
              />
              <div className="about-brand-divider" />
              <p className="about-brand-tagline">
                Nội Thất · Furniture &amp; Interiors
              </p>
              <p className="about-brand-address">
                14 Đường 41, An Khánh, TP.HCM
              </p>
            </div>
            {/* Badge overlay */}
            <div className="about-badge">
              <strong>8+</strong>
              <span>năm<br />kinh nghiệm</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
