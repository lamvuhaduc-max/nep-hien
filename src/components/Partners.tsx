const PARTNERS = [
  { name: 'An Cường',  sub: 'Gỗ công nghiệp',  icon: '◈' },
  { name: 'KES',       sub: 'Vật liệu gỗ',      icon: '◈' },
  { name: 'Häfele',    sub: 'Phụ kiện nội thất', icon: '◈' },
  { name: 'Blum',      sub: 'Bản lề & ray trượt',icon: '◈' },
  { name: 'Mirolin',   sub: 'Thiết bị phòng tắm',icon: '◈' },
];

export default function Partners() {
  return (
    <section className="partners-section" aria-label="Đối tác">
      <div className="wrap">
        <p className="partners-label">Đối tác tin cậy</p>
        <div className="partners-grid">
          {PARTNERS.map(p => (
            <div key={p.name} className="partner-item">
              <span className="partner-icon" aria-hidden="true">{p.icon}</span>
              <span className="partner-name">{p.name}</span>
              <span className="partner-sub">{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
