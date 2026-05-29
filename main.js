'use strict';

// ── Mobile Navigation ──────────────────────────────────────────────────────
(function () {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    const spans = toggle.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = open ? '0'  : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  }

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
})();

// ── Nav Scroll Effect ──────────────────────────────────────────────────────
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// ── Active Nav Link ────────────────────────────────────────────────────────
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Scroll Reveal ──────────────────────────────────────────────────────────
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => io.observe(el));
})();

// ── Back to Top ────────────────────────────────────────────────────────────
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── Quote Form Handler ─────────────────────────────────────────────────────
(function () {
  const form    = document.getElementById('quoteForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');
  const btn     = form.querySelector('[type="submit"]');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const fields = form.querySelectorAll('[required]');
    let valid = true;
    fields.forEach(f => {
      f.style.borderColor = '';
      if (!f.value.trim()) { f.style.borderColor = '#b91c1c'; valid = false; }
    });
    if (!valid) return;

    const origText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const data   = new FormData(form);
    const body   = Array.from(data.entries()).map(([k, v]) => `${k}: ${v}`).join('\n');
    const mailto = `mailto:quinton.caleb@gmail.com?subject=Quote+Request+—+Westforge+Supply&body=${encodeURIComponent(body)}`;

    const isLive = !['localhost', '127.0.0.1'].includes(location.hostname);
    const finish = () => {
      btn.textContent = origText;
      btn.disabled = false;
      form.reset();
      if (success) { success.classList.remove('hidden'); success.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };

    if (isLive) {
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
        .then(finish).catch(() => { location.href = mailto; finish(); });
    } else {
      setTimeout(() => { location.href = mailto; finish(); }, 400);
    }
  });
})();

// ── Contact Form Handler ───────────────────────────────────────────────────
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(form);
    const body = Array.from(data.entries()).map(([k, v]) => `${k}: ${v}`).join('\n');
    location.href = `mailto:quinton.caleb@gmail.com?subject=Website+Contact+—+Westforge+Supply&body=${encodeURIComponent(body)}`;
  });
})();
