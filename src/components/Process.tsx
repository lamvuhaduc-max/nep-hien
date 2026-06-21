const STEPS = [
  {
    num: '01',
    title: 'Tư vấn & Khảo sát',
    desc: 'Lắng nghe nhu cầu, phong cách và ngân sách. Khảo sát thực tế không gian để nắm bắt toàn bộ hiện trạng.',
    icon: '◎',
  },
  {
    num: '02',
    title: 'Thiết kế & Đề xuất',
    desc: 'Xây dựng phương án thiết kế 2D/3D, bảng màu vật liệu và dự toán chi tiết. Chỉnh sửa đến khi bạn ưng ý.',
    icon: '◈',
  },
  {
    num: '03',
    title: 'Thi công & Giám sát',
    desc: 'Đội ngũ tay nghề cao thi công đúng tiến độ. Giám sát chặt chẽ từng hạng mục, báo cáo tiến độ định kỳ.',
    icon: '◐',
  },
  {
    num: '04',
    title: 'Bàn giao & Bảo hành',
    desc: 'Bàn giao công trình hoàn thiện, hướng dẫn sử dụng. Bảo hành 24 tháng toàn bộ hạng mục thi công.',
    icon: '◉',
  },
];

export default function Process() {
  return (
    <section className="process-section" id="process" aria-labelledby="process-heading">
      <div className="wrap">
        <div className="section-header text-center">
          <p className="kicker">Quy trình làm việc</p>
          <h2 id="process-heading" className="heading-lg" style={{ marginTop: 12 }}>
            Từ ý tưởng đến <em>không gian thực</em>
          </h2>
          <p className="section-desc">
            4 bước rõ ràng — minh bạch từ đầu đến cuối, không phát sinh ngoài dự toán.
          </p>
        </div>

        <div className="process-grid">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="process-card">
              <div className="process-num">{step.num}</div>
              {idx < STEPS.length - 1 && (
                <span className="process-connector" aria-hidden="true" />
              )}
              <div className="process-icon" aria-hidden="true">{step.icon}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
