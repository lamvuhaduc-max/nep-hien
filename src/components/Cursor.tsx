'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot  = dotRef.current!;
    const ring = ringRef.current!;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf: number;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
    };

    const tick = () => {
      rx += (mx - rx) * 0.10;
      ry += (my - ry) * 0.10;
      ring.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`;
      raf = requestAnimationFrame(tick);
    };

    const grow   = () => ring.classList.add('cursor-grow');
    const shrink = () => ring.classList.remove('cursor-grow');

    const bindHover = () => {
      document.querySelectorAll('a, button, [role="button"], .gallery-item, .proj-card')
        .forEach(el => {
          el.addEventListener('mouseenter', grow);
          el.addEventListener('mouseleave', shrink);
        });
    };

    document.body.classList.add('has-cursor');
    window.addEventListener('mousemove', onMove);
    tick();
    bindHover();

    // Re-bind when DOM changes (lazy loaded content)
    const observer = new MutationObserver(bindHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      observer.disconnect();
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
