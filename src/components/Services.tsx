const SERVICES = [
  {
    icon: '✦',
    title: 'Thiết kế nội thất',
    desc: 'Concept độc bản, bản vẽ 3D chi tiết, bảng màu và vật liệu được chọn lọc kỹ lưỡng theo cá tính và phong cách riêng của bạn.',
  },
  {
    icon: '◈',
    title: 'Thi công trọn gói',
    desc: 'Đội ngũ thi công lành nghề, giám sát chặt chẽ từng giai đoạn, bàn giao đúng tiến độ — bạn nhận chìa khoá, chúng tôi lo phần còn lại.',
  },
  {
    icon: '⬡',
    title: 'Cải tạo không gian',
    desc: 'Biến đổi diện mạo ngôi nhà hiện tại với ngân sách hợp lý — cải tạo thông minh, tối ưu công năng, hiệu quả tối đa.',
  },
];

export default function Services() {
  return (
    <section className="services-section" id="services" aria-labelledby="services-heading">
      <div className="wrap">
        <div className="section-header">
          <p className="kicker">Những gì chúng tôi làm</p>
          <h2 id="services-heading" className="heading-lg" style={{ marginTop: 12 }}>
            Dịch vụ <em>toàn diện</em>
          </h2>
          <p className="section-desc">
            Từ ý tưởng đến bàn giao — Nếp Hiên đồng hành cùng bạn xuyên suốt hành trình.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article key={s.title} className="service-card">
              <div className="service-icon" aria-hidden="true">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
