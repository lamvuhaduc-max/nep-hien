/* =========================================
   HEADER — scroll effect
   ========================================= */
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* =========================================
   MOBILE NAV
   ========================================= */
const navToggle = document.getElementById('nav-toggle');
const siteNav   = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close on any link click
siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});
// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && siteNav.classList.contains('open')) closeNav();
});

function closeNav() {
  siteNav.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* =========================================
   SCROLL REVEAL
   ========================================= */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll(
  '.service-card, .project-card, .stat, .about-text, .about-visual, .section-header'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  revealObserver.observe(el);
});

/* =========================================
   FORM VALIDATION HELPERS
   ========================================= */

// Vietnamese mobile: 10 digits starting with 0 + valid prefix (3/5/7/8/9)
// Also accepts +84 / 84 country code prefix
const PHONE_RE = /^(\+?84|0)[35789]\d{8}$/;

function validateName(val) {
  if (!val.trim())           return 'Vui lòng nhập tên của bạn.';
  if (val.trim().length < 2) return 'Tên phải có ít nhất 2 ký tự.';
  return '';
}

function validatePhone(val) {
  const cleaned = val.replace(/[\s.\-()]/g, '');
  if (!cleaned)              return 'Vui lòng nhập số điện thoại.';
  if (!PHONE_RE.test(cleaned)) return 'Số điện thoại không hợp lệ. VD: 0901 234 567';
  return '';
}

function setFieldError(fieldId, message) {
  const wrap = document.getElementById(`field-${fieldId}`);
  const errEl = document.getElementById(`${fieldId}-error`);
  if (!wrap || !errEl) return;
  wrap.classList.toggle('has-error', !!message);
  errEl.textContent = message || '';
}

/* =========================================
   FORM SUBMISSION (Formspree)
   ========================================= */
const form       = document.getElementById('contact-form-el');
const successEl  = document.getElementById('form-success');
const submitBtn  = document.getElementById('btn-submit');

if (form) {
  const nameInput  = form.querySelector('#name');
  const phoneInput = form.querySelector('#phone');

  // Validate on blur (after user leaves field)
  nameInput.addEventListener('blur',  e => setFieldError('name',  validateName(e.target.value)));
  phoneInput.addEventListener('blur', e => setFieldError('phone', validatePhone(e.target.value)));

  // Clear error on input
  nameInput.addEventListener('input',  e => { if (e.target.value.trim()) setFieldError('name',  ''); });
  phoneInput.addEventListener('input', e => { if (e.target.value.trim()) setFieldError('phone', ''); });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nameErr  = validateName(nameInput.value);
    const phoneErr = validatePhone(phoneInput.value);

    setFieldError('name',  nameErr);
    setFieldError('phone', phoneErr);

    if (nameErr || phoneErr) {
      (nameErr ? nameInput : phoneInput).focus();
      return;
    }

    // Confirm Formspree is configured
    if (form.action.includes('YOUR_FORM_ID')) {
      alert('⚠️ Chưa cấu hình Formspree.\n\nXem hướng dẫn trong file index.html (phần CONTACT FORM).');
      return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        form.hidden    = true;
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Lỗi máy chủ (${res.status})`);
      }
    } catch (err) {
      const msg = err.message || 'Không thể gửi. Vui lòng kiểm tra kết nối và thử lại.';
      showToast(`❌ ${msg}`);
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* =========================================
   TOAST (fallback thay alert)
   ========================================= */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%)',
      background: '#2a1a1a', color: '#f0ebe3',
      border: '1px solid #c95858', borderRadius: '4px',
      padding: '14px 24px', fontSize: '14px',
      zIndex: '9999', maxWidth: '90vw', textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,.5)',
      transition: 'opacity .3s'
    });
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 5000);
}
