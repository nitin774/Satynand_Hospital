/* global AOS */

function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    once: true,
    duration: 700,
    easing: 'ease-out-cubic',
    offset: 80,
  });

  // If images/fonts shift layout after load, refresh positions.
  window.addEventListener('load', () => {
    try {
      AOS.refreshHard();
    } catch {
      try {
        AOS.refresh();
      } catch {
        // ignore
      }
    }
  });
}

function initSmoothAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initMobileMenu() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    if (open) nav.removeAttribute('hidden');
    else nav.setAttribute('hidden', '');
  };

  setOpen(false);

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  nav.addEventListener('click', (e) => {
    const link = e.target instanceof Element ? e.target.closest('a') : null;
    if (!link) return;
    setOpen(false);
  });
}

function initHeaderEffects() {
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 6);
    if (toTop) {
      if (y > 700) toTop.removeAttribute('hidden');
      else toTop.setAttribute('hidden', '');
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav__link[data-nav]'));
  if (navLinks.length === 0) return;

  const sections = navLinks
    .map((a) => {
      const id = a.getAttribute('data-nav');
      const el = id ? document.getElementById(id) : null;
      return el ? { id, el } : null;
    })
    .filter(Boolean);

  if (sections.length === 0) return;

  const setActive = (id) => {
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('data-nav') === id));
  };

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
      if (visible && visible.target && visible.target.id) setActive(visible.target.id);
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: [0.05, 0.2, 0.4, 0.6] }
  );

  sections.forEach((s) => io.observe(s.el));
}

function initDoctorModal() {
  const dialog = document.getElementById('doctorModal');
  const closeBtn = document.getElementById('doctorModalClose');
  const nameEl = document.getElementById('doctorModalName');
  const metaEl = document.getElementById('doctorModalMeta');
  const roleEl = document.getElementById('doctorModalRole');
  const linkEl = document.getElementById('doctorModalLink');
  const imgEl = document.getElementById('doctorModalImg');

  if (!dialog || !closeBtn || !nameEl || !metaEl || !roleEl || !linkEl || !imgEl) return;

  const open = (btn) => {
    const name = btn.getAttribute('data-name') || '';
    const role = btn.getAttribute('data-role') || '';
    const degree = btn.getAttribute('data-degree') || '';
    const rating = btn.getAttribute('data-rating') || '';
    const exp = btn.getAttribute('data-exp') || '';
    const link = btn.getAttribute('data-link') || '#';
    const card = btn.closest('.cardDoc');
    const cardImg = card ? card.querySelector('.cardDoc__avatar img') : null;

    nameEl.textContent = name;
    roleEl.textContent = role;
    metaEl.textContent = [degree, rating, exp].filter(Boolean).join(' • ');
    linkEl.setAttribute('href', link);

    if (cardImg && cardImg.getAttribute('src')) {
      imgEl.setAttribute('src', cardImg.getAttribute('src'));
    }

    dialog.showModal();
  };

  document.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('button[data-doctor]') : null;
    if (!btn) return;
    open(btn);
  });

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    // close when clicking backdrop
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inDialog) dialog.close();
  });
}

function initGalleryLightbox() {
  const dialog = document.getElementById('galleryLightbox');
  const img = document.getElementById('lbImg');
  const close = document.getElementById('lbClose');
  const prev = document.getElementById('lbPrev');
  const next = document.getElementById('lbNext');
  const grid = document.getElementById('galleryGrid');

  if (!dialog || !img || !close || !prev || !next || !grid) return;

  const items = Array.from(grid.querySelectorAll('button[data-gallery-src]'));
  if (items.length === 0) return;
  let idx = 0;

  const show = (i) => {
    idx = (i + items.length) % items.length;
    const src = items[idx].getAttribute('data-gallery-src');
    if (src) img.setAttribute('src', src);
  };

  grid.addEventListener('click', (e) => {
    const btn = e.target instanceof Element ? e.target.closest('button[data-gallery-src]') : null;
    if (!btn) return;
    const i = items.indexOf(btn);
    if (i >= 0) show(i);
    dialog.showModal();
  });

  close.addEventListener('click', () => dialog.close());
  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inDialog) dialog.close();
  });

  window.addEventListener('keydown', (e) => {
    if (!dialog.open) return;
    if (e.key === 'Escape') dialog.close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
}

function initCounters() {
  const stats = Array.from(document.querySelectorAll('.stat[data-count]'));
  if (stats.length === 0) return;

  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animate = (el) => {
    const target = Number(el.getAttribute('data-count') || '0');
    const suffix = String(el.getAttribute('data-suffix') || '');
    const out = el.querySelector('.stat__value');
    if (!out) return;

    if (prefersReduced) {
      out.textContent = `${target}${suffix}`;
      return;
    }

    const start = performance.now();
    const duration = 900;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.round(eased * target);
      out.textContent = `${val}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        animate(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.35 }
  );

  stats.forEach((s) => io.observe(s));
}

function initTestimonials() {
  const slider = document.getElementById('tSlider');
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  if (!slider || !prev || !next) return;

  const slides = Array.from(slider.querySelectorAll('.slide'));
  if (slides.length === 0) return;

  let idx = Math.max(
    0,
    slides.findIndex((s) => s.classList.contains('is-active'))
  );
  if (idx < 0) idx = 0;

  const show = (i) => {
    idx = (i + slides.length) % slides.length;
    slides.forEach((s, si) => s.classList.toggle('is-active', si === idx));
  };

  prev.addEventListener('click', () => show(idx - 1));
  next.addEventListener('click', () => show(idx + 1));
}

function initForm() {
  const form = document.getElementById('leadForm');
  const note = document.getElementById('formNote');
  if (!form || !note) return;

  const HOSPITAL_EMAIL = 'satyanandhospitalspn@gmail.com';
  const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${HOSPITAL_EMAIL}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const phone = String(fd.get('phone') || '').trim();
    const message = String(fd.get('message') || '').trim();

    if (!name || !phone) {
      note.textContent = 'Please fill name and phone.';
      note.style.color = '#dc2626';
      return;
    }

    note.textContent = 'Sending your request…';
    note.style.color = 'rgba(15, 23, 42, 0.7)';

    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: fd,
      });

      if (response.ok) {
        note.textContent = `Thanks ${name} — we received your request. We'll contact you soon.`;
        note.style.color = '#16a34a';
        form.reset();
      } else {
        throw new Error('Server responded with an error');
      }
    } catch (err) {
      note.textContent = 'Something went wrong. Please try again or call us directly.';
      note.style.color = '#dc2626';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initSmoothAnchors();
  initMobileMenu();
  initHeaderEffects();
  initScrollSpy();
  initDoctorModal();
  initGalleryLightbox();
  initCounters();
  initTestimonials();
  initForm();
});

