import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PROJECTS } from '@/data/projects';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dự Án — Nếp Hiên Nội Thất',
  description: 'Khám phá các công trình nội thất cao cấp đã hoàn thành của Nếp Hiên tại TP.HCM.',
};

export default function DuAnPage() {
  return (
    <>
      <Header isDark={false} />
      <main>
        {/* Hero */}
        <section className="page-hero">
          <div className="page-hero-img">
            <Image
              src="/images/p2/z7896373362819_7cbc02e87da77ba1e47d2ae74d9cd197.jpg"
              alt="Dự án nội thất Nếp Hiên"
              fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
              priority quality={90}
            />
            <div className="page-hero-overlay" />
          </div>
          <div className="wrap page-hero-content">
            <p className="kicker">Portfolio</p>
            <h1 className="heading-xl">Công trình <em>nổi bật</em></h1>
          </div>
        </section>

        {/* Projects grid */}
        <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
          <div className="wrap">
            <p className="section-desc text-center" style={{ marginBottom: 56 }}>
              {PROJECTS.reduce((acc, p) => acc + p.images.length, 0)} bức ảnh thực tế từ {PROJECTS.length} công trình đã hoàn thành.
            </p>
            <div className="proj-cards">
              {PROJECTS.map((project, idx) => (
                <Link
                  key={project.id}
                  href={`/du-an/${project.slug}`}
                  className="proj-card"
                >
                  <div className="proj-card-img">
                    <Image
                      src={project.images[0].src}
                      alt={project.images[0].alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                    />
                    <div className="proj-card-overlay" />
                    <span className="proj-card-count">{project.images.length} ảnh</span>
                  </div>
                  <div className="proj-card-info">
                    <span className="proj-card-label">{project.label}</span>
                    <h3 className="proj-card-name">{project.name}</h3>
                    <div className="proj-card-meta">
                      <span>{project.type}</span>
                      <span className="proj-card-dot">·</span>
                      <span>{project.area}</span>
                      <span className="proj-card-dot">·</span>
                      <span>{project.style}</span>
                    </div>
                    <span className="proj-card-cta">Xem dự án →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta-section">
          <div className="wrap text-center">
            <h2 className="heading-lg">Bạn muốn <em>công trình tương tự</em>?</h2>
            <p className="section-desc" style={{ marginTop: 16 }}>
              Liên hệ ngay để được tư vấn miễn phí và nhận báo giá chi tiết.
            </p>
            <Link href="/#contact-form" className="btn btn-gold" style={{ marginTop: 32, display: 'inline-flex' }}>
              Đăng ký tư vấn →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
