'use client';

import { useEffect, useRef, useState } from 'react';

type Stat = { target: number; suffix: string; label: string; prefix?: string };

const STATS: Stat[] = [
  { target: 8,   suffix: '+', label: 'Năm kinh nghiệm' },
  { target: 200, suffix: '+', label: 'Công trình hoàn thành' },
  { target: 98,  suffix: '%', label: 'Khách hàng hài lòng' },
];

function Counter({ target, suffix, duration = 1800 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <div className="stats-bar" aria-label="Thống kê">
      <div className="wrap stats-inner">
        {STATS.map((s, i) => (
          <>
            <div key={s.label} className="stat">
              <strong><Counter target={s.target} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </div>
            {i < STATS.length - 1 && <div className="stat-divider" aria-hidden="true" />}
          </>
        ))}
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat">
          <strong>TP.HCM</strong>
          <span>An Khánh, Quận 2</span>
        </div>
      </div>
    </div>
  );
}
