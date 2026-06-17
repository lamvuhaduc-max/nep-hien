import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectGallery from './ProjectGallery';

export function generateStaticParams() {
  return PROJECTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) return {};
  return {
    title: `${project.name} — Nếp Hiên Nội Thất`,
    description: project.desc,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find(p => p.slug === params.slug);
  if (!project) notFound();

  const heroImg = project.images[0];

  return (
    <>
      <Header />
      <main className="proj-detail">

      {/* Hero */}
      <section className="proj-detail-hero">
        <Image
          src={heroImg.src}
          alt={heroImg.alt}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          priority
          quality={90}
        />
        <div className="proj-detail-overlay" />
        <div className="wrap proj-detail-hero-content">
          <Link href="/#projects" className="proj-back">
            ← Quay lại dự án
          </Link>
          <p className="kicker">{project.label}</p>
          <h1 className="heading-xl">{project.name}</h1>
        </div>
      </section>

      {/* Info bar */}
      <section className="proj-info-bar">
        <div className="wrap proj-info-inner">
          <div className="proj-info-item">
            <span className="proj-info-label">Loại công trình</span>
            <span className="proj-info-value">{project.type}</span>
          </div>
          <div className="proj-info-divider" aria-hidden="true" />
          <div className="proj-info-item">
            <span className="proj-info-label">Diện tích</span>
            <span className="proj-info-value">{project.area}</span>
          </div>
          <div className="proj-info-divider" aria-hidden="true" />
          <div className="proj-info-item">
            <span className="proj-info-label">Phong cách</span>
            <span className="proj-info-value">{project.style}</span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="proj-desc-section">
        <div className="wrap proj-desc-inner">
          <p className="proj-desc-text">{project.desc}</p>
          <a href="/#contact-form" className="btn btn-gold">
            Tư vấn dự án tương tự →
          </a>
        </div>
      </section>

      {/* Gallery — client component */}
      <ProjectGallery project={project} />

      {/* Footer nav */}
      <section className="proj-nav-section">
        <div className="wrap proj-nav-inner">
          {(() => {
            const idx   = PROJECTS.findIndex(p => p.slug === params.slug);
            const prev  = PROJECTS[idx - 1];
            const next  = PROJECTS[idx + 1];
            return (
              <>
                {prev ? (
                  <Link href={`/du-an/${prev.slug}`} className="proj-nav-link proj-nav-prev">
                    <span className="proj-nav-dir">← Dự án trước</span>
                    <span className="proj-nav-name">{prev.name}</span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link href={`/du-an/${next.slug}`} className="proj-nav-link proj-nav-next">
                    <span className="proj-nav-dir">Dự án tiếp →</span>
                    <span className="proj-nav-name">{next.name}</span>
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      </section>
    </main>
    <Footer />
    </>
  );
}
