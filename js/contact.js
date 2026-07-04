// ── Contact Form Validation ──
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId + 'Msg');
    if (el) { el.textContent = msg; el.className = 'form-message error'; }
    const input = document.getElementById(fieldId);
    if (input) input.style.borderColor = '#E55';
  }

  function clearError(fieldId) {
    const el = document.getElementById(fieldId + 'Msg');
    if (el) { el.textContent = ''; el.className = 'form-message'; }
    const input = document.getElementById(fieldId);
    if (input) input.style.borderColor = '';
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^\d{7,15}$/.test(phone.replace(/[\s\-\(\)]/g,''));
  }

  // Live validation
  ['name','email','phone','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name)               { showError('name', 'Name is required.'); valid = false; }
    if (!email)              { showError('email', 'Email is required.'); valid = false; }
    else if (!validateEmail(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
    if (!phone)              { showError('phone', 'Phone number is required.'); valid = false; }
    else if (!validatePhone(phone)) { showError('phone', 'Phone number must contain only digits (7–15 digits).'); valid = false; }
    if (!message)            { showError('message', 'Message cannot be empty.'); valid = false; }

    if (valid) {
      const btn = form.querySelector('button[type=submit]');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      setTimeout(() => {
        showToast('Message sent! I\'ll get back to you soon. 🎉');
        form.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 1200);
    }
  });
});
