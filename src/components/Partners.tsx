'use client';

const PARTNERS = [
  { name: 'AN CƯỜNG',  sub: 'Gỗ công nghiệp',       color: '#4A9FD4' },
  { name: 'KES',       sub: 'Vật liệu gỗ',            color: '#E8E8E8' },
  { name: 'HÄFELE',   sub: 'Phụ kiện nội thất',      color: '#E8E8E8' },
  { name: 'BLUM',     sub: 'Bản lề & ray trượt',     color: '#E8E8E8' },
  { name: 'HETTICH',  sub: 'Phụ kiện Đức',           color: '#E8E8E8' },
  { name: 'TOTO',     sub: 'Thiết bị phòng tắm',     color: '#E8E8E8' },
  { name: 'KOHLER',   sub: 'Thiết bị cao cấp',        color: '#C9A84C' },
  { name: 'DULUX',    sub: 'Sơn cao cấp',             color: '#E8E8E8' },
  { name: 'NIPPON',   sub: 'Sơn nội thất',            color: '#E8E8E8' },
  { name: 'GRASS',    sub: 'Hệ trượt Áo',             color: '#E8E8E8' },
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
              <div className="partner-text-logo">
                <span className="partner-text-name" style={{ color: p.color }}>
                  {p.name}
                </span>
                <span className="partner-text-sub">{p.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
