import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu — Nếp Hiên Nội Thất',
  description: 'Hơn 8 năm kiến tạo không gian sống tại TP.HCM. Đội ngũ thiết kế tận tâm, minh bạch từ tư vấn đến bàn giao.',
};

export default function GioiThieuPage() {
  return (
    <>
      <Header />
      <main className="catalogue-page">

        {/* ── SECTION 1: INTRODUCTION ── */}
        <section className="cat-intro">
          <div className="cat-intro-inner">
            {/* Left: title + text */}
            <div className="cat-intro-text">
              <h1 className="cat-title">Giới<br />Thiệu</h1>
              <p className="cat-body">
                Nếp Hiên ra đời từ niềm tin đơn giản: một ngôi nhà đẹp không
                chỉ cần thẩm mỹ — nó cần kể được câu chuyện của người sống trong đó.
              </p>
              <p className="cat-body" style={{ marginTop: 16 }}>
                Hơn 8 năm qua, chúng tôi đồng hành cùng hơn 200 gia đình tại
                TP.HCM kiến tạo không gian vừa đẹp vừa sống — nơi thẩm mỹ và
                công năng hoà quyện, nơi mỗi góc nhỏ đều có lý do tồn tại.
              </p>
              <p className="cat-label" style={{ marginTop: 40 }}>Nếp Hiên · Since 2016</p>
            </div>

            {/* Right: staggered images */}
            <div className="cat-intro-images">
              <div className="cat-img-top">
                <Image
                  src="/images/p2/z7896373362819_7cbc02e87da77ba1e47d2ae74d9cd197.jpg"
                  alt="Không gian phòng khách Nếp Hiên"
                  fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
                  priority
                />
              </div>
              <div className="cat-img-bottom">
                <Image
                  src="/images/p1/z7935782332380_3df01d1dc7ee8b4234b9217dbd8e4086.jpg"
                  alt="Chi tiết nội thất Nếp Hiên"
                  fill style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: KHÔNG GIAN SỐNG ── */}
        <section className="cat-section">
          <div className="cat-section-inner">
            {/* Image left */}
            <div className="cat-section-img">
              <Image
                src="/images/p2/z7896373239436_a6453c1ea75694dd3551590316c11802.jpg"
                alt="Không gian phòng khách sang trọng"
                fill style={{ objectFit: 'cover' }}
              />
            </div>
            {/* Text right */}
            <div className="cat-section-text">
              <h2 className="cat-title-sm">Không Gian<br />Sống</h2>
              <p className="cat-body">
                Mỗi phòng khách là trung tâm của ngôi nhà — nơi gia đình quây
                quần, nơi đón tiếp khách quý. Nếp Hiên thiết kế không gian sống
                tối ưu cả về thẩm mỹ lẫn công năng, phù hợp với lối sống và
                cá tính riêng của từng gia chủ.
              </p>
              <div className="cat-highlights">
                <p className="cat-highlights-title">Điểm nổi bật:</p>
                <ul>
                  <li>Bố cục tối ưu ánh sáng tự nhiên</li>
                  <li>Sofa, bàn trà từ vật liệu cao cấp</li>
                  <li>Tone màu trung tính ấm, dễ phối đồ</li>
                  <li>Tích hợp không gian lưu trữ thông minh</li>
                </ul>
              </div>
              <Link href="/du-an/can-ho-hien-dai" className="cat-link">
                Xem dự án Căn Hộ Hiện Đại →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: PHÒNG NGỦ ── */}
        <section className="cat-section cat-section-alt">
          <div className="cat-section-inner reverse">
            {/* Text left */}
            <div className="cat-section-text">
              <h2 className="cat-title-sm">Phòng<br />Ngủ</h2>
              <p className="cat-body">
                Phòng ngủ là thánh địa riêng tư nhất trong ngôi nhà. Chúng tôi
                thiết kế từng chi tiết — từ nhiệt độ màu ánh đèn, chiều cao đầu
                giường đến hệ tủ âm tường — để tạo nên không gian nghỉ ngơi
                hoàn hảo theo đúng nghĩa.
              </p>
              <div className="cat-highlights">
                <p className="cat-highlights-title">Điểm nổi bật:</p>
                <ul>
                  <li>Giường King & Queen gỗ sồi, gỗ óc chó</li>
                  <li>Hệ tủ âm tường tối đa diện tích</li>
                  <li>Đèn ngủ âm trần, đèn đầu giường tinh tế</li>
                  <li>Bảng đầu giường bọc da hoặc vải linen</li>
                </ul>
              </div>
              <Link href="/du-an/chung-cu-indochine" className="cat-link">
                Xem dự án Chung Cư Indochine →
              </Link>
            </div>
            {/* Image right */}
            <div className="cat-section-img">
              <Image
                src="/images/p2/z7896373239443_4006c298acf9452090583f551ee66e75.jpg"
                alt="Phòng ngủ cao cấp Nếp Hiên"
                fill style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 4: VĂN PHÒNG ── */}
        <section className="cat-section">
          <div className="cat-section-inner">
            <div className="cat-section-img">
              <Image
                src="/images/p3/z7896845533158_7fae4a5fa5bb45a0de03b4a65c192eab.jpg"
                alt="Văn phòng Wabi-Sabi"
                fill style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="cat-section-text">
              <h2 className="cat-title-sm">Văn Phòng<br />& Thương Mại</h2>
              <p className="cat-body">
                Không gian làm việc tác động trực tiếp đến hiệu suất và văn hoá
                doanh nghiệp. Nếp Hiên thiết kế văn phòng theo triết lý
                Wabi-Sabi — môi trường thư thái, sáng tạo và truyền cảm hứng
                cho cả đội ngũ.
              </p>
              <div className="cat-highlights">
                <p className="cat-highlights-title">Điểm nổi bật:</p>
                <ul>
                  <li>Bố cục tối ưu giao tiếp và tập trung</li>
                  <li>Vật liệu tự nhiên: gỗ, đất nung, linen</li>
                  <li>Cây xanh nội thất tạo không khí trong lành</li>
                  <li>Phòng họp riêng, khu pantry ấm cúng</li>
                </ul>
              </div>
              <Link href="/du-an/van-phong-wabi-sabi" className="cat-link">
                Xem dự án Văn Phòng Wabi-Sabi →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: STATS ── */}
        <section className="cat-stats">
          <div className="cat-stats-inner">
            {[
              { num: '8+',   label: 'Năm kinh nghiệm', desc: 'Tích lũy từ hàng trăm công trình thực tế' },
              { num: '200+', label: 'Công trình', desc: 'Căn hộ, biệt thự, văn phòng đã hoàn thiện' },
              { num: '98%',  label: 'Hài lòng', desc: 'Khách hàng đánh giá 5 sao sau bàn giao' },
              { num: '24T',  label: 'Bảo hành', desc: 'Cam kết toàn bộ hạng mục thi công' },
            ].map(s => (
              <div key={s.label} className="cat-stat">
                <span className="cat-stat-num">{s.num}</span>
                <span className="cat-stat-label">{s.label}</span>
                <span className="cat-stat-desc">{s.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: CTA ── */}
        <section className="cat-cta">
          <div className="cat-cta-img">
            <Image
              src="/images/p1/z7935782332344_8e8cf0dee2431dd94b0b146b9b958826.jpg"
              alt="Nếp Hiên – không gian sống"
              fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
            />
            <div className="cat-cta-overlay" />
          </div>
          <div className="cat-cta-content">
            <p className="kicker" style={{ color: 'var(--brass-lt)' }}>Bắt đầu hành trình</p>
            <h2 className="heading-lg" style={{ color: 'var(--cream)', marginTop: 12 }}>
              Ngôi nhà của bạn<br /><em>xứng đáng được đẹp hơn</em>
            </h2>
            <p style={{ color: 'rgba(245,239,224,.7)', marginTop: 20, maxWidth: 480, lineHeight: 1.8 }}>
              Tư vấn miễn phí — không ràng buộc. Chỉ cần chia sẻ ý tưởng,
              Nếp Hiên sẽ giúp bạn hình dung không gian trong vòng 48 giờ.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
              <Link href="/#contact-form" className="btn btn-gold">Đăng ký tư vấn →</Link>
              <Link href="/du-an" className="btn btn-ghost">Xem công trình</Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
