'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Project } from '@/data/projects';

export default function ProjectGallery({ project }: { project: Project }) {
  const imgs   = project.images;
  const [lb, setLb] = useState<number | null>(null);

  const close = useCallback(() => setLb(null), []);
  const prev  = useCallback(() => setLb(i => i === null ? null : (i - 1 + imgs.length) % imgs.length), [imgs.length]);
  const next  = useCallback(() => setLb(i => i === null ? null : (i + 1) % imgs.length), [imgs.length]);

  useEffect(() => {
    if (lb === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lb, close, prev, next]);

  return (
    <>
      {/* Gallery grid */}
      <section className="proj-gallery-section">
        <div className="wrap">
          <div className="proj-gallery-grid">
            {imgs.map((img, idx) => (
              <button
                key={img.src}
                className="gallery-item"
                onClick={() => setLb(idx)}
                aria-label={`Xem ảnh ${idx + 1}: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  loading={idx < 4 ? 'eager' : 'lazy'}
                />
                <span className="gallery-zoom" aria-hidden="true">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lb !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={imgs[lb].alt}
          onClick={close}
        >
          <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
            <button className="lb-close" onClick={close} aria-label="Đóng">✕</button>
            <Image
              src={imgs[lb].src}
              alt={imgs[lb].alt}
              fill
              style={{ objectFit: 'contain' }}
              sizes="90vw"
              priority
            />
            <button className="lb-prev" onClick={prev} aria-label="Ảnh trước">‹</button>
            <button className="lb-next" onClick={next} aria-label="Ảnh tiếp theo">›</button>
            <p className="lb-counter">{lb + 1} / {imgs.length}</p>
          </div>
        </div>
      )}
    </>
  );
}
