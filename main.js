/* HRD Landing Page — Interactions */

// ========================
// DARK MODE TOGGLE
// ========================
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const html = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  html.setAttribute('data-theme', theme);
  updateToggleIcon(theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', theme);
      updateToggleIcon(theme);
      toggle.setAttribute('aria-label', '다크 모드로 전환');
    });
  }

  function updateToggleIcon(t) {
    if (!toggle) return;
    toggle.innerHTML = t === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();

// ========================
// MOBILE MENU TOGGLE
// ========================
(function () {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    btn.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
    });
  });
})();

// ========================
// HEADER SCROLL EFFECT
// ========================
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = '';
    }
  }, { passive: true });
})();

// ========================
// SMOOTH SCROLL FOR ANCHORS
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ========================
// CONTACT FORM
// ========================
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('nameError') },
    email: { el: document.getElementById('email'), err: document.getElementById('emailError') },
    program: { el: document.getElementById('program'), err: document.getElementById('programError') },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError') },
    privacy: { el: document.getElementById('privacy'), err: document.getElementById('privacyError') },
  };

  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  function validate() {
    let valid = true;

    // Name
    if (!fields.name.el.value.trim()) {
      showError(fields.name.err, '이름을 입력해 주세요.');
      valid = false;
    } else { clearError(fields.name.err); }

    // Email
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.email.el.value.trim()) {
      showError(fields.email.err, '이메일을 입력해 주세요.');
      valid = false;
    } else if (!emailRe.test(fields.email.el.value)) {
      showError(fields.email.err, '올바른 이메일 형식을 입력해 주세요.');
      valid = false;
    } else { clearError(fields.email.err); }

    // Program
    if (!fields.program.el.value) {
      showError(fields.program.err, '관심 프로그램을 선택해 주세요.');
      valid = false;
    } else { clearError(fields.program.err); }

    // Message
    if (!fields.message.el.value.trim() || fields.message.el.value.trim().length < 10) {
      showError(fields.message.err, '문의 내용을 10자 이상 입력해 주세요.');
      valid = false;
    } else { clearError(fields.message.err); }

    // Privacy
    if (!fields.privacy.el.checked) {
      showError(fields.privacy.err, '개인정보 수집에 동의해 주세요.');
      valid = false;
    } else { clearError(fields.privacy.err); }

    return valid;
  }

  function showError(el, msg) {
    if (el) el.textContent = msg;
  }
  function clearError(el) {
    if (el) el.textContent = '';
  }

  // Real-time validation
  Object.values(fields).forEach(({ el, err }) => {
    if (el && err) {
      el.addEventListener('blur', validate);
    }
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validate()) {
      const firstError = form.querySelector('.form-error:not(:empty)');
      if (firstError) {
        const input = firstError.previousElementSibling;
        if (input) input.focus();
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '전송 중...';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (result.success) {
        form.style.display = 'none';
        success.hidden = false;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = '문의 보내기';
      alert('전송 중 오류가 발생했습니다. 직접 연락 주세요: joa7338@hanmail.net');
    }
  });
})();

// ========================
// SCROLL ANIMATIONS (Intersection Observer)
// ========================
(function () {
  if (!window.IntersectionObserver) return;

  const style = document.createElement('style');
  style.textContent = `
    .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.55s ease, transform 0.55s ease; }
    .fade-in.visible { opacity: 1; transform: none; }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll('.program-card, .pricing-card, .testimonial-card, .about-inner, .section-header');
  targets.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();
