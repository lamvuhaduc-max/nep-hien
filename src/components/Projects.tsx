import Image from 'next/image';
import Link from 'next/link';
import { PROJECTS } from '@/data/projects';

export default function Projects() {
  return (
    <section className="projects-section" id="projects" aria-labelledby="projects-heading">
      <div className="wrap">
        <div className="section-header text-center">
          <p className="kicker">Portfolio</p>
          <h2 id="projects-heading" className="heading-lg" style={{ marginTop: 12 }}>
            Công trình <em>nổi bật</em>
          </h2>
          <p className="section-desc">
            {PROJECTS.length} dự án đã hoàn thành. Bấm vào để xem toàn bộ hình ảnh thực tế.
          </p>
        </div>

        <div className="proj-cards">
          {PROJECTS.map((project, idx) => (
            <Link
              key={project.id}
              href={`/du-an/${project.slug}`}
              className="proj-card"
              aria-label={`Xem dự án: ${project.name}`}
            >
              {/* Cover image */}
              <div className="proj-card-img">
                <Image
                  src={project.images[0].src}
                  alt={project.images[0].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  style={{ objectFit: 'cover' }}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="proj-card-overlay" aria-hidden="true" />
                <span className="proj-card-count">{project.images.length} ảnh</span>
              </div>

              {/* Info */}
              <div className="proj-card-info">
                <span className="proj-card-label">{project.label}</span>
                <h3 className="proj-card-name">{project.name}</h3>
                <div className="proj-card-meta">
                  <span>{project.type}</span>
                  <span className="proj-card-dot" aria-hidden="true">·</span>
                  <span>{project.area}</span>
                  <span className="proj-card-dot" aria-hidden="true">·</span>
                  <span>{project.style}</span>
                </div>
                <span className="proj-card-cta">Xem dự án →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
