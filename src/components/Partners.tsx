'use client';

import Image from 'next/image';

const PARTNERS = [
  { name: 'An Cường',  logo: '/partners/ancuong.svg',      w: 200, color: true  },
  { name: 'KES',       logo: '/partners/kes.svg',           w: 100, color: false },
  { name: 'Häfele',   logo: '/partners/hafele.svg',        w: 140, color: false },
  { name: 'Blum',     logo: '/partners/blum.svg',           w: 120, color: false },
  { name: 'Hettich',  logo: '/partners/hettich.svg',       w: 150, color: true  },
  { name: 'TOTO',     logo: '/partners/toto-real.svg',     w: 120, color: false },
  { name: 'Kohler',   logo: '/partners/kohler.svg',        w: 150, color: false },
  { name: 'Dulux',    logo: '/partners/dulux.svg',         w: 130, color: false },
  { name: 'Nippon',   logo: '/partners/nippon.svg',        w: 160, color: false },
  { name: 'Grass',    logo: '/partners/grass.svg',         w: 130, color: false },
];

export default function Partners() {
  const list = [...PARTNERS, ...PARTNERS];

  return (
    <section className="partners-section" aria-label="Đối tác tin cậy">
      <div className="partners-header">
        <span className="partners-divider-line" aria-hidden="true" />
        <p className="partners-label">Đối tác tin cậy</p>
        <span className="partners-divider-line" aria-hidden="true" />
      </div>

      <div className="partners-track-wrap" aria-hidden="true">
        <div className="partners-track">
          {list.map((p, i) => (
            <div key={i} className="partner-logo-wrap">
              <Image
                src={p.logo}
                alt={p.name}
                width={p.w}
                height={56}
                style={{
                  height: '40px',
                  width: 'auto',
                  objectFit: 'contain',
                  // color logos: hiển thị màu gốc
                  // white-on-transparent logos: invert để thành cream
                  filter: p.color ? 'none' : 'brightness(0) invert(1)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
