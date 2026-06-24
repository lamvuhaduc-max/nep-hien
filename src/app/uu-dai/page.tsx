'use client';

import { useState, FormEvent } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function UuDaiPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors]   = useState<Record<string, string>>({});

  function validate(data: FormData) {
    const e: Record<string, string> = {};
    if (!String(data.get('owner_name')).trim())  e.owner_name  = 'Vui lòng nhập tên chủ nhà';
    if (!String(data.get('phone')).trim())        e.phone       = 'Vui lòng nhập số điện thoại';
    if (!String(data.get('nhu_cau')).trim())      e.nhu_cau     = 'Vui lòng chọn nhu cầu';
    return e;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('https://formspree.io/f/mdavqbdv', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) setSuccess(true);
      else throw new Error();
    } catch {
      setErrors({ submit: 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi 0901 234 567' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header isDark={false} />
      <main className="qr-page">

        {/* Banner ưu đãi */}
        <section className="qr-hero">
          <div className="qr-hero-badge">QR ƯU ĐÃI</div>
          <h1 className="qr-hero-title">
            Nhận ngay <em>ưu đãi đặc biệt</em><br />từ Nếp Hiên
          </h1>
          <p className="qr-hero-sub">
            Điền thông tin bên dưới — nhận tư vấn miễn phí + ưu đãi <strong>10% phí thiết kế</strong>
          </p>
          <div className="qr-offer-tags">
            <span>✓ Khảo sát miễn phí</span>
            <span>✓ Tư vấn 1-1 với KTS</span>
            <span>✓ Giảm 10% phí thiết kế</span>
            <span>✓ Ưu tiên sắp xếp lịch</span>
          </div>
        </section>

        {/* Form */}
        <section className="qr-form-section">
          <div className="qr-form-wrap">
            {success ? (
              <div className="qr-success">
                <div className="qr-success-icon">🎉</div>
                <h2>Đăng ký thành công!</h2>
                <p>
                  Chúng tôi đã nhận thông tin của bạn. Team Nếp Hiên sẽ liên hệ
                  trong vòng <strong>2 giờ</strong> để xác nhận ưu đãi và hẹn lịch tư vấn.
                </p>
                <div className="qr-success-code">
                  Mã ưu đãi của bạn: <strong>NEPHIEN-QR-2026</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="qr-form" noValidate>
                <h2 className="qr-form-title">Thông tin đăng ký ưu đãi</h2>

                {/* Tên chủ nhà */}
                <div className={`cf-field${errors.owner_name ? ' error' : ''}`}>
                  <label htmlFor="owner_name">Tên chủ nhà *</label>
                  <input
                    type="text" id="owner_name" name="owner_name"
                    placeholder="VD: Nguyễn Văn A"
                    autoComplete="name"
                    onChange={() => setErrors(p => ({ ...p, owner_name: '' }))}
                  />
                  {errors.owner_name && <span className="cf-error">{errors.owner_name}</span>}
                </div>

                {/* Email + SĐT */}
                <div className="cf-row">
                  <div className="cf-field">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email" id="email" name="email"
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div className={`cf-field${errors.phone ? ' error' : ''}`}>
                    <label htmlFor="qr_phone">Số điện thoại *</label>
                    <input
                      type="tel" id="qr_phone" name="phone"
                      placeholder="0901 234 567"
                      inputMode="numeric"
                      onChange={() => setErrors(p => ({ ...p, phone: '' }))}
                    />
                    {errors.phone && <span className="cf-error">{errors.phone}</span>}
                  </div>
                </div>

                {/* Mã căn */}
                <div className="cf-field">
                  <label htmlFor="ma_can">Mã căn / Địa chỉ căn hộ</label>
                  <input
                    type="text" id="ma_can" name="ma_can"
                    placeholder="VD: A1-08, Block A tầng 8, hoặc 14 Đường 41..."
                  />
                </div>

                {/* Nhu cầu */}
                <div className={`cf-field${errors.nhu_cau ? ' error' : ''}`}>
                  <label>Nhu cầu của anh/chị *</label>
                  <div className="qr-radio-group">
                    {[
                      { value: 'Để ở',      label: '🏠 Để ở',       desc: 'Thiết kế & thi công để sinh sống' },
                      { value: 'Cho thuê',  label: '🔑 Cho thuê',   desc: 'Nội thất tối ưu giá thuê' },
                      { value: 'Bán lại',   label: '💰 Bán lại',    desc: 'Tăng giá trị căn hộ' },
                    ].map(opt => (
                      <label key={opt.value} className="qr-radio-card">
                        <input
                          type="radio" name="nhu_cau" value={opt.value}
                          onChange={() => setErrors(p => ({ ...p, nhu_cau: '' }))}
                        />
                        <span className="qr-radio-inner">
                          <span className="qr-radio-label">{opt.label}</span>
                          <span className="qr-radio-desc">{opt.desc}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.nhu_cau && <span className="cf-error">{errors.nhu_cau}</span>}
                </div>

                {/* Ghi chú */}
                <div className="cf-field">
                  <label htmlFor="note">Ghi chú thêm <span className="cf-optional">(không bắt buộc)</span></label>
                  <textarea
                    id="note" name="note" rows={3}
                    placeholder="Phong cách yêu thích, diện tích, ngân sách dự kiến..."
                  />
                </div>

                {/* Hidden field đánh dấu nguồn QR */}
                <input type="hidden" name="source" value="QR Code - Ưu đãi 2026" />

                {errors.submit && (
                  <p className="cf-error" style={{ marginBottom: 12 }}>{errors.submit}</p>
                )}

                <button
                  type="submit"
                  className="btn btn-gold qr-submit"
                  disabled={loading}
                >
                  {loading ? 'Đang gửi…' : 'Nhận ưu đãi ngay →'}
                </button>

                <p className="cf-privacy" style={{ textAlign: 'center', marginTop: 12 }}>
                  🔒 Thông tin được bảo mật tuyệt đối
                </p>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
