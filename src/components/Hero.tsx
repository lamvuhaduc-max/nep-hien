import Image from 'next/image';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

// ảnh hero: phòng khách + bàn ăn sang trọng (p2 - góc rộng nhất, tông vàng đồng)
const HERO_IMG = '/images/p2/z7896373362819_7cbc02e87da77ba1e47d2ae74d9cd197.jpg';

export default function Hero() {
  return (
    <section className="hero" id="home" aria-label="Giới thiệu">

      {/* 1 — Ảnh nền thật */}
      <div className="hero-photo" aria-hidden="true">
        <Image
          src={HERO_IMG}
          alt="Nội thất Nếp Hiên – phòng khách sang trọng"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          priority
          quality={90}
        />
      </div>

      {/* 2 — Gradient overlay tối hoá ảnh cho text dễ đọc */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* 3 — Three.js particles nổi trên ảnh */}
      <div className="hero-canvas-wrap" aria-hidden="true">
        <ThreeScene />
      </div>

      {/* 4 — Nội dung */}
      <div className="wrap hero-content">
        <p className="kicker hero-anim" style={{ animationDelay: '0.1s' }}>
          Nội thất cao cấp · TP. Hồ Chí Minh
        </p>
        <h1 className="heading-xl" style={{ marginTop: 20 }}>
          <span className="hero-line hero-anim" style={{ animationDelay: '0.3s' }}>Không gian sống</span><br />
          <em className="hero-line hero-anim" style={{ animationDelay: '0.5s' }}>phản chiếu</em><br />
          <span className="hero-line hero-anim" style={{ animationDelay: '0.7s' }}>con người bạn</span>
        </h1>
        <p className="hero-desc hero-anim" style={{ animationDelay: '0.9s' }}>
          Nếp Hiên kiến tạo những không gian vừa đẹp vừa sống — nơi thẩm mỹ
          và công năng hoà quyện, nơi mỗi góc nhỏ đều kể một câu chuyện.
        </p>
        <div className="hero-ctas hero-anim" style={{ animationDelay: '1.1s' }}>
          <a href="#contact-form" className="btn btn-gold">Bắt đầu dự án →</a>
          <a href="#projects"     className="btn btn-ghost">Xem công trình</a>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span className="scroll-line" />
        <span className="scroll-text">Khám phá</span>
      </div>
    </section>
  );
}
