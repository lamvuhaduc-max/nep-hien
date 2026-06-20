'use client';

import { useState, useRef, FormEvent } from 'react';

const PHONE_RE = /^(\+?84|0)[35789]\d{8}$/;

function validateName(v: string) {
  if (!v.trim())           return 'Vui lòng nhập tên của bạn.';
  if (v.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự.';
  return '';
}
function validatePhone(v: string) {
  const c = v.replace(/[\s.\-()]/g, '');
  if (!c)                  return 'Vui lòng nhập số điện thoại.';
  if (!PHONE_RE.test(c))   return 'Số điện thoại không hợp lệ. VD: 0901 234 567';
  return '';
}

export default function ContactForm() {
  const [errors,   setErrors]   = useState({ name: '', phone: '' });
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [toast,    setToast]    = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 5000);
  }

  function blurName(e: React.FocusEvent<HTMLInputElement>) {
    setErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
  }
  function blurPhone(e: React.FocusEvent<HTMLInputElement>) {
    setErrors(prev => ({ ...prev, phone: validatePhone(e.target.value) }));
  }
  function inputName(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: '' }));
  }
  function inputPhone(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value.trim()) setErrors(prev => ({ ...prev, phone: '' }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameVal  = (form.elements.namedItem('name')  as HTMLInputElement).value;
    const phoneVal = (form.elements.namedItem('phone') as HTMLInputElement).value;

    const nameErr  = validateName(nameVal);
    const phoneErr = validatePhone(phoneVal);
    setErrors({ name: nameErr, phone: phoneErr });

    if (nameErr || phoneErr) {
      const el = nameErr
        ? form.querySelector<HTMLInputElement>('#name')
        : form.querySelector<HTMLInputElement>('#phone');
      el?.focus();
      return;
    }

    // Demo mode: simulate success after 1.2s
    if (form.action.includes('YOUR_FORM_ID')) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1200));
      setLoading(false);
      setSuccess(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || `Lỗi ${res.status}`);
      }
    } catch (err) {
      showToast(`❌ ${err instanceof Error ? err.message : 'Không thể gửi. Thử lại sau.'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="contact-section" id="contact-form" aria-labelledby="form-heading">
        <div className="contact-glow" aria-hidden="true" />

        <div className="wrap text-center">
          <p className="kicker">Bắt đầu câu chuyện</p>
          <h2 id="form-heading" className="heading-lg" style={{ marginTop: 14 }}>
            Hiện thực hóa <em>không gian</em> của bạn
          </h2>
          <p className="section-desc" style={{ margin: '12px auto 0' }}>
            Điền thông tin bên dưới — team Nếp Hiên sẽ liên hệ trong vòng <strong>24 giờ</strong>.
          </p>
        </div>

        <div className="wrap cgrid-form">
          {success ? (
            <div className="form-success" role="alert">
              <div className="success-icon" aria-hidden="true">✓</div>
              <h3>Gửi thành công!</h3>
              <p>
                Cảm ơn bạn đã liên hệ. Team thiết kế Nếp Hiên sẽ gọi lại trong vòng 24 giờ.
              </p>
              <a href="#home" className="btn btn-gold" style={{ marginTop: 24, display: 'inline-flex' }}>
                Về trang chủ
              </a>
            </div>
          ) : (
            /*
             * Formspree setup:
             * 1. Vào https://formspree.io → tạo tài khoản
             * 2. Tạo form mới → lấy endpoint dạng https://formspree.io/f/xyzabcde
             * 3. Thay YOUR_FORM_ID bên dưới bằng ID thực
             */
            <form
              ref={formRef}
              action="https://formspree.io/f/mdavqbdv"
              method="POST"
              noValidate
              onSubmit={handleSubmit}
              aria-label="Form đăng ký tư vấn nội thất"
            >
              {/* Tên */}
              <div className={`field${errors.name ? ' has-error' : ''}`} id="field-name">
                <label htmlFor="name">
                  Tên của bạn <span className="required" aria-label="bắt buộc">*</span>
                </label>
                <input
                  type="text" id="name" name="name"
                  placeholder="VD: Trần Văn A"
                  required autoComplete="name"
                  aria-describedby="name-error"
                  onBlur={blurName} onChange={inputName}
                />
                <span className="field-error" id="name-error" role="alert" aria-live="polite">
                  {errors.name}
                </span>
              </div>

              {/* Phone */}
              <div className={`field${errors.phone ? ' has-error' : ''}`} id="field-phone">
                <label htmlFor="phone">
                  Số điện thoại <span className="required" aria-label="bắt buộc">*</span>
                </label>
                <input
                  type="tel" id="phone" name="phone"
                  placeholder="Để team gọi lại tư vấn nè"
                  required autoComplete="tel" inputMode="numeric"
                  aria-describedby="phone-error"
                  onBlur={blurPhone} onChange={inputPhone}
                />
                <span className="field-error" id="phone-error" role="alert" aria-live="polite">
                  {errors.phone}
                </span>
              </div>

              {/* Dịch vụ */}
              <div className="field">
                <label htmlFor="service">Bạn quan tâm dịch vụ nào?</label>
                <select id="service" name="service" aria-describedby="service-hint">
                  <option value="">— Chọn dịch vụ —</option>
                  <option value="Thiết kế nội thất">Thiết kế nội thất</option>
                  <option value="Thi công trọn gói">Thi công trọn gói</option>
                  <option value="Cải tạo không gian">Cải tạo không gian</option>
                  <option value="Tư vấn chung">Tư vấn chung</option>
                </select>
                <span className="field-hint" id="service-hint">
                  Không chắc? Chọn "Tư vấn chung" — team sẽ định hướng phù hợp.
                </span>
              </div>

              {/* Lời nhắn */}
              <div className="field">
                <label htmlFor="message">
                  Chia sẻ ý tưởng của bạn{' '}
                  <span className="optional">(không bắt buộc)</span>
                </label>
                <textarea
                  id="message" name="message" rows={4}
                  placeholder="VD: Mình thích tone màu trầm, tối giản, muốn cải tạo phòng khách 30m²..."
                  aria-describedby="message-hint"
                />
                <span className="field-hint" id="message-hint">
                  Càng chi tiết, tư vấn càng sát nhu cầu.
                </span>
              </div>

              <p className="privacy-note">
                🔒 Thông tin của bạn được bảo mật hoàn toàn.
              </p>

              <button
                type="submit"
                className={`btn btn-gold btn-submit${loading ? ' loading' : ''}`}
                disabled={loading}
              >
                <span className="btn-text">Gửi yêu cầu ngay →</span>
                <span className="btn-loading" aria-hidden="true">
                  <svg className="spinner" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="30 70" />
                  </svg>
                  Đang gửi…
                </span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Toast */}
      {toast && (
        <div className="toast" role="alert" aria-live="assertive">
          {toast}
        </div>
      )}
    </>
  );
}
