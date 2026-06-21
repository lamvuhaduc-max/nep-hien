'use client';

import { useState } from 'react';

const REVIEWS = [
  {
    name: 'Chị Thanh Hà',
    project: 'Căn hộ 95m² – Quận 7',
    rating: 5,
    text: 'Nếp Hiên đã biến căn hộ trống của mình thành ngôi nhà thực sự. Đội ngũ lắng nghe rất kỹ, thiết kế đúng gu, thi công sạch sẽ và đúng tiến độ. Mình đặc biệt ấn tượng với sự tận tâm trong từng chi tiết nhỏ.',
  },
  {
    name: 'Anh Minh Khôi',
    project: 'Văn phòng 180m² – Bình Thạnh',
    rating: 5,
    text: 'Sau khi cải tạo theo phong cách Wabi-Sabi, không gian làm việc trở nên thư thái và sáng tạo hơn hẳn. Nhân viên cũng hào hứng hơn khi đến công ty. Rất hài lòng với kết quả và sẽ tiếp tục hợp tác.',
  },
  {
    name: 'Chị Phương Linh',
    project: 'Chung cư 120m² – Quận 2',
    rating: 5,
    text: 'Mình lo ngại nhất là phần phối màu và ánh sáng nhưng team Nếp Hiên xử lý xuất sắc. Căn hộ bây giờ luôn tràn ngập ánh sáng tự nhiên và cảm giác rộng hơn nhiều so với thực tế.',
  },
  {
    name: 'Anh Trọng Nghĩa',
    project: 'Nhà phố 3 tầng – Bình Dương',
    rating: 5,
    text: 'Giá cả minh bạch từ đầu, không có chi phí phát sinh ngoài dự toán — đây là điều mình đánh giá cao nhất. Công trình hoàn thiện đẹp hơn cả bản vẽ 3D. Cảm ơn đội Nếp Hiên!',
  },
  {
    name: 'Chị Ngọc Bích',
    project: 'Biệt thự 280m² – Nhà Bè',
    rating: 5,
    text: 'Từ khâu tư vấn đến bàn giao đều chuyên nghiệp và chu đáo. Phong cách Indochine hiện đại mà đội thiết kế đề xuất ban đầu mình còn nghi ngờ, nhưng kết quả thuyết phục hoàn toàn.',
  },
];

const STARS = '★★★★★';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setActive(i => (i + 1) % REVIEWS.length);

  const r = REVIEWS[active];

  return (
    <section className="testimonials-section" id="testimonials" aria-labelledby="reviews-heading">
      <div className="wrap">
        <div className="section-header text-center">
          <p className="kicker">Khách hàng nói gì</p>
          <h2 id="reviews-heading" className="heading-lg" style={{ marginTop: 12 }}>
            Hơn 200 gia đình <em>tin tưởng</em> Nếp Hiên
          </h2>
        </div>

        <div className="testi-card">
          <p className="testi-stars" aria-label="5 sao">{STARS}</p>
          <blockquote className="testi-quote">
            <p>"{r.text}"</p>
          </blockquote>
          <div className="testi-author">
            <span className="testi-avatar" aria-hidden="true">
              {r.name.split(' ').pop()?.[0]}
            </span>
            <div>
              <p className="testi-name">{r.name}</p>
              <p className="testi-project">{r.project}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="testi-nav">
          <button className="testi-btn" onClick={prev} aria-label="Đánh giá trước">‹</button>
          <div className="testi-dots">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                className={`testi-dot${i === active ? ' active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Đánh giá ${i + 1}`}
              />
            ))}
          </div>
          <button className="testi-btn" onClick={next} aria-label="Đánh giá tiếp">›</button>
        </div>
      </div>
    </section>
  );
}
