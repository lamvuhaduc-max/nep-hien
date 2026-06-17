'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      '.service-card, .stat, .section-header, .gallery-item, .about-text, .about-visual, .contact-section .cgrid-form'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 75}ms`;
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
