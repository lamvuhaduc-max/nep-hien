import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phong Cách — Nếp Hiên Nội Thất',
  description: 'Khám phá các phong cách thiết kế nội thất từ Modern Minimalist, Indochine đến Wabi-Sabi tại Nếp Hiên.',
};

const STYLES = [
  {
    name: 'Modern Minimalist',
    img: '/images/p1/z7935782332380_3df01d1dc7ee8b4234b9217dbd8e4086.jpg',
    desc: 'Tối giản là đỉnh cao của tinh tế. Không gian thoáng đãng, đường nét gọn gàng, màu trung tính ấm — mọi chi tiết đều có lý do tồn tại.',
    tags: ['Tông màu trung tính', 'Đường nét sạch', 'Ánh sáng tự nhiên', 'Nội thất đa chức năng'],
    slug: 'can-ho-hien-dai',
  },
  {
    name: 'Indochine Hiện Đại',
    img: '/images/p2/z7896373362819_7cbc02e87da77ba1e47d2ae74d9cd197.jpg',
    desc: 'Vẻ đẹp Đông Dương cổ kính hoà quyện với hơi thở đương đại. Gỗ tự nhiên, đồng mạ vàng, hoa văn truyền thống được diễn giải theo ngôn ngữ hiện đại.',
    tags: ['Gỗ óc chó', 'Chi tiết đồng thau', 'Marble trắng', 'Hoa văn Đông Dương'],
    slug: 'chung-cu-indochine',
  },
  {
    name: 'Wabi-Sabi Minimalist',
    img: '/images/p3/z7896845415116_9ff5dc2a63b2833e46db7a1720c7f52b.jpg',
    desc: 'Triết lý Nhật Bản về vẻ đẹp không hoàn hảo, tự nhiên và giản dị. Gỗ thô, đất nung, linen — không gian thở và tĩnh lặng giữa nhịp sống hối hả.',
    tags: ['Vật liệu thô mộc', 'Tông màu đất', 'Ánh sáng khuếch tán', 'Cây xanh nội thất'],
    slug: 'van-phong-wabi-sabi',
  },
  {
    name: 'Scandinavian',
    img: '/images/p1/z7935782332341_4939d3f8181de417e6ebd0baa6016085.jpg',
    desc: 'Chức năng là nền tảng, thẩm mỹ là phần thưởng. Phong cách Bắc Âu mang đến không gian sáng, ấm và tiện dụng — hoàn hảo cho cuộc sống hiện đại.',
    tags: ['Màu trắng & xám', 'Gỗ sáng màu', 'Đơn giản tinh tế', 'Ấm cúng'],
    slug: 'can-ho-hien-dai',
  },
];

export default function PhongCachPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="page-hero">
          <div className="page-hero-img">
            <Image
              src="/images/p3/z7896845533158_7fae4a5fa5bb45a0de03b4a65c192eab.jpg"
              alt="Phong cách thiết kế nội thất"
              fill style={{ objectFit: 'cover', objectPosition: 'center 50%' }}
              priority quality={90}
            />
            <div className="page-hero-overlay" />
          </div>
          <div className="wrap page-hero-content">
            <p className="kicker">Phong cách thiết kế</p>
            <h1 className="heading-xl">Tìm <em>ngôn ngữ</em><br />của không gian bạn</h1>
          </div>
        </section>

        {/* Styles */}
        <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
          <div className="wrap">
            <div className="styles-grid">
              {STYLES.map((s, idx) => (
                <div key={s.name} className={`style-card ${idx % 2 === 1 ? 'reverse' : ''}`}>
                  <div className="style-img">
                    <Image src={s.img} alt={s.name} fill
                      style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                  <div className="style-info">
                    <p className="kicker">{`0${idx + 1}`}</p>
                    <h2 className="style-name">{s.name}</h2>
                    <p className="style-desc">{s.desc}</p>
                    <div className="style-tags">
                      {s.tags.map(t => <span key={t} className="style-tag">{t}</span>)}
                    </div>
                    <Link href={`/du-an/${s.slug}`} className="btn btn-outline" style={{ marginTop: 24 }}>
                      Xem công trình →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta-section">
          <div className="wrap text-center">
            <h2 className="heading-lg">Chưa tìm được <em>phong cách phù hợp</em>?</h2>
            <p className="section-desc" style={{ marginTop: 16 }}>
              Đội ngũ Nếp Hiên sẽ tư vấn và đề xuất phong cách tối ưu cho không gian của bạn.
            </p>
            <Link href="/#contact-form" className="btn btn-gold" style={{ marginTop: 32, display: 'inline-flex' }}>
              Tư vấn phong cách →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
