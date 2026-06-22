'use client';

import Image from 'next/image';

const PARTNERS = [
  { name: 'An Cường',  logo: '/partners/ancuong.svg',  w: 160 },
  { name: 'KES',       logo: '/partners/kes.svg',       w: 100 },
  { name: 'Häfele',   logo: '/partners/hafele.svg',    w: 140 },
  { name: 'Blum',     logo: '/partners/blum.svg',      w: 120 },
  { name: 'Hettich',  logo: '/partners/hettich.svg',   w: 150 },
  { name: 'TOTO',     logo: '/partners/toto.svg',      w: 120 },
  { name: 'Kohler',   logo: '/partners/kohler.svg',    w: 150 },
  { name: 'Dulux',    logo: '/partners/dulux.svg',     w: 130 },
  { name: 'Nippon',   logo: '/partners/nippon.svg',    w: 160 },
  { name: 'Grass',    logo: '/partners/grass.svg',     w: 130 },
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
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
