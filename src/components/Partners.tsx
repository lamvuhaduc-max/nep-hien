'use client';

const PARTNERS = [
  { name: 'An Cường',  cat: 'Gỗ công nghiệp',       color: '#C8973A' },
  { name: 'KES',       cat: 'Vật liệu gỗ',            color: '#E8E8E8' },
  { name: 'Häfele',   cat: 'Phụ kiện nội thất',      color: '#E8001C' },
  { name: 'Blum',     cat: 'Bản lề & ray trượt',     color: '#009FDF' },
  { name: 'Hettich',  cat: 'Phụ kiện Đức',           color: '#003B8E' },
  { name: 'TOTO',     cat: 'Thiết bị phòng tắm',     color: '#E8E8E8' },
  { name: 'Kohler',   cat: 'Thiết bị cao cấp',        color: '#C9A84C' },
  { name: 'Dulux',    cat: 'Sơn cao cấp',             color: '#E60026' },
  { name: 'Nippon',   cat: 'Sơn nội thất',            color: '#E8E8E8' },
  { name: 'Grass',    cat: 'Hệ trượt Áo',             color: '#5B8C00' },
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
            <div key={i} className="partner-chip">
              <span className="partner-chip-name" style={{ color: p.color }}>
                {p.name}
              </span>
              <span className="partner-chip-cat">{p.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
