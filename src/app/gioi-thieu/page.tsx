import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu — Nếp Hiên Nội Thất',
  description: 'Hơn 8 năm kiến tạo không gian sống tại TP.HCM. Đội ngũ thiết kế tận tâm, minh bạch từ tư vấn đến bàn giao.',
};

const VALUES = [
  { icon: '◎', title: 'Lắng nghe thật sự', desc: 'Mỗi dự án bắt đầu bằng việc hiểu sâu về con người sống trong đó — không gian phải kể đúng câu chuyện của bạn.' },
  { icon: '◈', title: 'Minh bạch tuyệt đối', desc: 'Dự toán chi tiết từ đầu, không phát sinh ngoài thỏa thuận. Tiến độ báo cáo định kỳ, bạn luôn nắm rõ.' },
  { icon: '◉', title: 'Chất lượng bền vững', desc: 'Vật liệu chọn lọc từ đối tác uy tín. Thi công tỉ mỉ, bàn giao hoàn thiện. Bảo hành 24 tháng toàn bộ công trình.' },
];

const MILESTONES = [
  { year: '2016', event: 'Thành lập Nếp Hiên tại TP.HCM với đội ngũ 5 người' },
  { year: '2018', event: 'Hoàn thành 50 công trình đầu tiên, mở rộng team thiết kế' },
  { year: '2020', event: 'Ra mắt dịch vụ thi công trọn gói, nhận giải thưởng nội thất khu vực' },
  { year: '2022', event: 'Vượt mốc 150 công trình, hợp tác với các thương hiệu vật liệu hàng đầu' },
  { year: '2024', event: 'Hơn 200 gia đình tin tưởng, mở rộng dịch vụ tư vấn online' },
];

export default function GioiThieuPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="page-hero">
          <div className="page-hero-img">
            <Image
              src="/images/p1/z7935782332380_3df01d1dc7ee8b4234b9217dbd8e4086.jpg"
              alt="Nếp Hiên – không gian thiết kế"
              fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              priority quality={90}
            />
            <div className="page-hero-overlay" />
          </div>
          <div className="wrap page-hero-content">
            <p className="kicker">Về chúng tôi</p>
            <h1 className="heading-xl">Nếp Hiên —<br /><em>hơn 8 năm kiến tạo</em></h1>
          </div>
        </section>

        {/* Story */}
        <section className="about-story-section">
          <div className="wrap about-story-inner">
            <div className="about-story-text">
              <p className="kicker">Câu chuyện của chúng tôi</p>
              <h2 className="heading-lg" style={{ marginTop: 12 }}>
                Không gian đẹp <em>kể câu chuyện</em> của người sống trong đó
              </h2>
              <p style={{ marginTop: 24, lineHeight: 1.85 }}>
                Nếp Hiên ra đời năm 2016 từ niềm tin rằng một ngôi nhà đẹp không chỉ
                cần thẩm mỹ — nó cần phản chiếu đúng con người chủ nhân. Chúng tôi
                không thiết kế theo trend, chúng tôi thiết kế theo người.
              </p>
              <p style={{ marginTop: 16, lineHeight: 1.85 }}>
                Sau hơn 8 năm, hơn 200 công trình và hàng trăm gia đình hài lòng,
                triết lý ấy vẫn là kim chỉ nam trong từng dự án. Mỗi góc nhỏ đều
                được cân nhắc kỹ lưỡng — từ chiều cao mặt bàn đến hướng ánh sáng
                buổi sáng chiếu vào phòng ngủ.
              </p>
              <Link href="/#contact-form" className="btn btn-gold" style={{ marginTop: 32, display: 'inline-flex' }}>
                Bắt đầu dự án của bạn →
              </Link>
            </div>
            <div className="about-story-stats">
              {[
                { num: '8+',   label: 'Năm kinh nghiệm' },
                { num: '200+', label: 'Công trình hoàn thành' },
                { num: '98%',  label: 'Khách hàng hài lòng' },
                { num: '24T',  label: 'Bảo hành công trình' },
              ].map(s => (
                <div key={s.label} className="story-stat">
                  <strong>{s.num}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="values-section">
          <div className="wrap">
            <div className="section-header text-center">
              <p className="kicker">Giá trị cốt lõi</p>
              <h2 className="heading-lg" style={{ marginTop: 12 }}>
                Điều làm nên <em>sự khác biệt</em>
              </h2>
            </div>
            <div className="values-grid">
              {VALUES.map(v => (
                <div key={v.title} className="value-card">
                  <span className="value-icon">{v.icon}</span>
                  <h3 className="value-title">{v.title}</h3>
                  <p className="value-desc">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <div className="wrap">
            <div className="section-header text-center">
              <p className="kicker">Hành trình phát triển</p>
              <h2 className="heading-lg" style={{ marginTop: 12 }}>Từng <em>mốc quan trọng</em></h2>
            </div>
            <div className="timeline">
              {MILESTONES.map((m, i) => (
                <div key={m.year} className={`timeline-item ${i % 2 === 0 ? 'left' : 'right'}`}>
                  <div className="timeline-year">{m.year}</div>
                  <div className="timeline-dot" />
                  <div className="timeline-content">{m.event}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta-section">
          <div className="wrap text-center">
            <h2 className="heading-lg">Sẵn sàng bắt đầu <em>dự án của bạn</em>?</h2>
            <p className="section-desc" style={{ marginTop: 16 }}>
              Tư vấn miễn phí — team Nếp Hiên sẽ liên hệ trong vòng 24 giờ.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              <Link href="/#contact-form" className="btn btn-gold">Đăng ký tư vấn →</Link>
              <Link href="/du-an" className="btn btn-outline">Xem công trình</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
