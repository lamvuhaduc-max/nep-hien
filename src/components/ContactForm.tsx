'use client';

import { useState, useRef, FormEvent } from 'react';
import Image from 'next/image';

const PHONE_RE = /^(\+?84|0)[35789]\d{8}$/;

function validateName(v: string) {
  if (!v.trim())           return 'Vui lòng nhập tên của bạn.';
  if (v.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự.';
  return '';
}
function validatePhone(v: string) {
  const c = v.replace(/[\s.\-()]/g, '');
  if (!c)               return 'Vui lòng nhập số điện thoại.';
  if (!PHONE_RE.test(c)) return 'Số không hợp lệ. VD: 0901 234 567';
  return '';
}

export default function ContactForm() {
  const [errors,  setErrors]  = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast,   setToast]   = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 5000);
  }

  const blurName  = (e: React.FocusEvent<HTMLInputElement>) =>
    setErrors(p => ({ ...p, name: validateName(e.target.value) }));
  const blurPhone = (e: React.FocusEvent<HTMLInputElement>) =>
    setErrors(p => ({ ...p, phone: validatePhone(e.target.value) }));
  const clearName  = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.value.trim() && setErrors(p => ({ ...p, name: '' }));
  const clearPhone = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.value.trim() && setErrors(p => ({ ...p, phone: '' }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameVal  = (form.elements.namedItem('name')  as HTMLInputElement).value;
    const phoneVal = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const nameErr  = validateName(nameVal);
    const phoneErr = validatePhone(phoneVal);
    setErrors({ name: nameErr, phone: phoneErr });
    if (nameErr || phoneErr) {
      form.querySelector<HTMLInputElement>(nameErr ? '#cf-name' : '#cf-phone')?.focus();
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData(form);
      const payload = {
        hoTen: String(formData.get('name') ?? '').trim(),
        soDienThoai: String(formData.get('phone') ?? '').trim(),
        dichVu: String(formData.get('service') ?? '').trim(),
        dienTich: String(formData.get('area') ?? '').trim(),
        loiNhan: String(formData.get('message') ?? '').trim(),
        nguon: 'form_trang_chu',
        _gotcha: String(formData.get('_gotcha') ?? ''),
      };

      const res = await fetch('/api/v1/storefront/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Gửi phụ không chặn luồng sang Formspree nếu cấu hình email ngoài
      fetch('https://formspree.io/f/mdavqbdv', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      }).catch(() => {});

      if (res.ok) {
        setSuccess(true);
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { message?: string; error?: string }).message ||
            (data as { error?: string }).error ||
            `Lỗi ${res.status}`,
        );
      }
    } catch (err) {
      const msg =
        err instanceof Error && err.message
          ? err.message
          : 'Không thể gửi. Vui lòng thử lại hoặc gọi trực tiếp 0901 234 567';
      showToast(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="cf-section" id="contact-form" aria-labelledby="cf-heading">

        {/* Left — image + info */}
        <div className="cf-left">
          <div className="cf-bg-img">
            <Image
              src="/images/p1/z7935782332344_8e8cf0dee2431dd94b0b146b9b958826.jpg"
              alt="Nội thất Nếp Hiên"
              fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              quality={70}
            />
            <div className="cf-img-overlay" />
          </div>
          <div className="cf-left-content">
            <p className="kicker" style={{ color: 'var(--brass-lt)' }}>Bắt đầu hành trình</p>
            <h2 id="cf-heading" className="heading-lg" style={{ color: 'var(--cream)', marginTop: 12 }}>
              Tư vấn<br /><em>miễn phí</em>
            </h2>
            <div className="cf-info-list">
              <div className="cf-info-item">
                <span className="cf-info-icon">📍</span>
                <span>14 Đường 41, An Khánh, TP.HCM</span>
              </div>
              <div className="cf-info-item">
                <span className="cf-info-icon">📞</span>
                <a href="tel:+84901234567">0901 234 567</a>
              </div>
              <div className="cf-info-item">
                <span className="cf-info-icon">✉</span>
                <a href="mailto:dvkh247@nephien.com">dvkh247@nephien.com</a>
              </div>
              <div className="cf-info-item">
                <span className="cf-info-icon">⏰</span>
                <span>Thứ 2 – Thứ 7 · 8:00 – 18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="cf-right">
          {success ? (
            <div className="cf-success">
              <div className="cf-success-icon">✓</div>
              <h3>Gửi thành công!</h3>
              <p>Team Nếp Hiên đã nhận được yêu cầu và sẽ gọi lại cho bạn trong vòng <strong>24 giờ</strong>.</p>
              <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="btn btn-gold"
                  style={{ display: 'inline-flex' }}
                >
                  Gửi yêu cầu khác
                </button>
                <a href="#home" className="btn" style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,0.25)', color: 'var(--cream)' }}>
                  Về đầu trang
                </a>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              action="/api/v1/storefront/consultations"
              method="POST"
              noValidate
              onSubmit={handleSubmit}
              className="cf-form"
            >
              <h3 className="cf-form-title">Điền thông tin của bạn</h3>
              <p className="cf-form-sub">Chúng tôi sẽ phản hồi trong vòng 24 giờ</p>

              {/* Honeypot chống bot: người thật không thấy, bot điền vào -> Formspree tự bỏ qua */}
              <input
                type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />

              {/* Row 1: Tên + SĐT */}
              <div className="cf-row">
                <div className={`cf-field${errors.name ? ' error' : ''}`}>
                  <label htmlFor="cf-name">Họ và tên *</label>
                  <input
                    type="text" id="cf-name" name="name"
                    placeholder="Nguyễn Văn A"
                    autoComplete="name"
                    onBlur={blurName} onChange={clearName}
                  />
                  {errors.name && <span className="cf-error">{errors.name}</span>}
                </div>
                <div className={`cf-field${errors.phone ? ' error' : ''}`}>
                  <label htmlFor="cf-phone">Số điện thoại *</label>
                  <input
                    type="tel" id="cf-phone" name="phone"
                    placeholder="0901 234 567"
                    autoComplete="tel" inputMode="numeric"
                    onBlur={blurPhone} onChange={clearPhone}
                  />
                  {errors.phone && <span className="cf-error">{errors.phone}</span>}
                </div>
              </div>

              {/* Dịch vụ */}
              <div className="cf-field">
                <label htmlFor="cf-service">Dịch vụ quan tâm</label>
                <select id="cf-service" name="service">
                  <option value="">— Chọn dịch vụ —</option>
                  <option value="Thiết kế nội thất">Thiết kế nội thất</option>
                  <option value="Thi công trọn gói">Thi công trọn gói</option>
                  <option value="Cải tạo không gian">Cải tạo không gian</option>
                  <option value="Tư vấn chung">Tư vấn chung</option>
                </select>
              </div>

              {/* Diện tích */}
              <div className="cf-field">
                <label htmlFor="cf-area">Diện tích không gian</label>
                <select id="cf-area" name="area">
                  <option value="">— Chọn diện tích —</option>
                  <option value="Dưới 50m²">Dưới 50m²</option>
                  <option value="50 – 100m²">50 – 100m²</option>
                  <option value="100 – 200m²">100 – 200m²</option>
                  <option value="Trên 200m²">Trên 200m²</option>
                </select>
              </div>

              {/* Lời nhắn */}
              <div className="cf-field">
                <label htmlFor="cf-message">Ý tưởng của bạn <span className="cf-optional">(không bắt buộc)</span></label>
                <textarea
                  id="cf-message" name="message" rows={4}
                  placeholder="Chia sẻ thêm về phong cách, ngân sách, hoặc bất kỳ yêu cầu đặc biệt nào..."
                />
              </div>

              <div className="cf-footer-row">
                <p className="cf-privacy">🔒 Thông tin được bảo mật tuyệt đối</p>
                <button
                  type="submit"
                  className={`btn btn-gold cf-submit${loading ? ' loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24" fill="none" width="18" height="18">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="30 70" />
                      </svg>
                      Đang gửi…
                    </>
                  ) : 'Gửi yêu cầu tư vấn →'}
                </button>
              </div>
            </form>
          )}
        </div>

      </section>

      {toast && (
        <div className="toast" role="alert" aria-live="assertive">{toast}</div>
      )}
    </>
  );
}
