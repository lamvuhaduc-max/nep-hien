import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Báo Giá — Nếp Hiên Nội Thất',
  description: 'Bảng giá dịch vụ thiết kế và thi công nội thất minh bạch từ Nếp Hiên. Không phát sinh chi phí ngoài thỏa thuận.',
};

const PACKAGES = [
  {
    name: 'Tư Vấn & Thiết Kế',
    price: 'Từ 150.000đ/m²',
    highlight: false,
    desc: 'Phương án thiết kế 2D/3D hoàn chỉnh, bảng màu và vật liệu chi tiết. Phù hợp khi bạn đã có đội thi công riêng.',
    includes: [
      'Khảo sát thực tế miễn phí',
      'Bản vẽ thiết kế 2D mặt bằng',
      'Phối cảnh 3D toàn phòng',
      'Bảng màu & vật liệu chi tiết',
      'Dự toán chi phí vật liệu',
      '3 lần chỉnh sửa thiết kế',
    ],
    cta: 'Nhận báo giá',
  },
  {
    name: 'Trọn Gói Design & Build',
    price: 'Từ 4.500.000đ/m²',
    highlight: true,
    desc: 'Dịch vụ toàn diện từ ý tưởng đến bàn giao. Bạn chỉ cần dọn vào ở — Nếp Hiên lo toàn bộ còn lại.',
    includes: [
      'Toàn bộ dịch vụ thiết kế',
      'Thi công nội thất trọn gói',
      'Vật liệu từ đối tác uy tín',
      'Giám sát công trình 24/7',
      'Bàn giao hoàn thiện, vệ sinh',
      'Bảo hành 24 tháng',
    ],
    cta: 'Nhận báo giá',
  },
  {
    name: 'Cải Tạo Thông Minh',
    price: 'Từ 2.800.000đ/m²',
    highlight: false,
    desc: 'Làm mới không gian hiện có với ngân sách tối ưu. Giữ lại kết cấu chính, cải thiện thẩm mỹ và công năng.',
    includes: [
      'Đánh giá hiện trạng chi tiết',
      'Phương án cải tạo tối ưu chi phí',
      'Thiết kế bố cục mới',
      'Sơn & hoàn thiện bề mặt',
      'Nội thất & phụ kiện thay thế',
      'Bảo hành 12 tháng',
    ],
    cta: 'Nhận báo giá',
  },
];

const FAQS = [
  { q: 'Chi phí có phát sinh so với báo giá ban đầu không?', a: 'Không. Nếp Hiên cam kết dự toán minh bạch từ đầu. Mọi thay đổi (nếu có, do khách hàng yêu cầu) đều được thông báo và xác nhận trước khi thực hiện.' },
  { q: 'Thời gian hoàn thiện một dự án là bao lâu?', a: 'Tùy quy mô: căn hộ 80-120m² thường 45-60 ngày; biệt thự hoặc văn phòng lớn hơn 90-120 ngày. Tiến độ cụ thể được lập kế hoạch chi tiết trước khi khởi công.' },
  { q: 'Có thể xem mẫu vật liệu trước khi quyết định không?', a: 'Có. Nếp Hiên có showroom vật liệu và bộ mẫu để tham khảo. Đội thiết kế cũng có thể đến tận nhà với mẫu vật liệu để bạn xem trong không gian thực tế.' },
  { q: 'Báo giá thiết kế có được tính vào chi phí trọn gói không?', a: 'Khi ký hợp đồng thi công trọn gói, phí thiết kế sẽ được khấu trừ hoàn toàn vào tổng giá trị hợp đồng.' },
];

export default function BaoGiaPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="baogia-hero">
          <div className="wrap text-center">
            <p className="kicker">Bảng giá dịch vụ</p>
            <h1 className="heading-xl" style={{ marginTop: 16 }}>
              Minh bạch từ <em>con số đầu tiên</em>
            </h1>
            <p className="section-desc" style={{ marginTop: 20, maxWidth: 600, margin: '20px auto 0' }}>
              Không phí ẩn, không phát sinh ngoài thỏa thuận. Giá niêm yết rõ ràng —
              báo giá chi tiết trong vòng 24 giờ sau khi khảo sát.
            </p>
          </div>
        </section>

        {/* Packages */}
        <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg)' }}>
          <div className="wrap">
            <div className="pricing-grid">
              {PACKAGES.map(pkg => (
                <div key={pkg.name} className={`pricing-card ${pkg.highlight ? 'pricing-highlight' : ''}`}>
                  {pkg.highlight && <span className="pricing-badge">Phổ biến nhất</span>}
                  <h3 className="pricing-name">{pkg.name}</h3>
                  <p className="pricing-price">{pkg.price}</p>
                  <p className="pricing-desc">{pkg.desc}</p>
                  <ul className="pricing-list">
                    {pkg.includes.map(item => (
                      <li key={item}><span className="pricing-check">✓</span> {item}</li>
                    ))}
                  </ul>
                  <Link href="/#contact-form" className={`btn ${pkg.highlight ? 'btn-gold' : 'btn-outline'}`}
                    style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                    {pkg.cta} →
                  </Link>
                </div>
              ))}
            </div>
            <p className="pricing-note">
              * Giá tham khảo cho khu vực TP.HCM. Báo giá chính xác sau khảo sát thực tế miễn phí.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ padding: 'var(--section-py) 0', background: 'var(--bg-alt)' }}>
          <div className="wrap">
            <div className="section-header text-center">
              <p className="kicker">Câu hỏi thường gặp</p>
              <h2 className="heading-lg" style={{ marginTop: 12 }}>Bạn muốn <em>biết thêm?</em></h2>
            </div>
            <div className="faq-list">
              {FAQS.map(faq => (
                <div key={faq.q} className="faq-item">
                  <h3 className="faq-q">{faq.q}</h3>
                  <p className="faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="page-cta-section">
          <div className="wrap text-center">
            <h2 className="heading-lg">Nhận báo giá <em>miễn phí</em> ngay hôm nay</h2>
            <p className="section-desc" style={{ marginTop: 16 }}>
              Điền form bên dưới — Nếp Hiên sẽ liên hệ trong vòng 24 giờ với báo giá chi tiết.
            </p>
            <Link href="/#contact-form" className="btn btn-gold" style={{ marginTop: 32, display: 'inline-flex' }}>
              Nhận báo giá miễn phí →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
