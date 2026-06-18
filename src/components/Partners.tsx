'use client';

const PARTNERS = [
  { name: 'An Cường',  cat: 'Gỗ công nghiệp'      },
  { name: 'KES',       cat: 'Vật liệu gỗ'          },
  { name: 'Häfele',    cat: 'Phụ kiện nội thất'    },
  { name: 'Blum',      cat: 'Bản lề & ray trượt'   },
  { name: 'Hettich',   cat: 'Phụ kiện Đức'         },
  { name: 'TOTO',      cat: 'Thiết bị phòng tắm'   },
  { name: 'Kohler',    cat: 'Thiết bị cao cấp'      },
  { name: 'Dulux',     cat: 'Sơn cao cấp'           },
  { name: 'Nippon',    cat: 'Sơn nội thất'          },
  { name: 'Grass',     cat: 'Hệ trượt Áo'           },
];

export default function Partners() {
  // Duplicate for seamless loop
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
              <span className="partner-dot" />
              <span className="partner-chip-name">{p.name}</span>
              <span className="partner-chip-cat">{p.cat}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
