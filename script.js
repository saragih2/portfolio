// ============================================================
//  Portofolio Christian Febri Frayoga Saragih — interaksi
// ============================================================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Logout ----
const _sbClient = (typeof supabase !== 'undefined')
  ? supabase.createClient(
      "https://whmgibfyrbhfleasstho.supabase.co",
      "sb_publishable_idWV2GBljc8ieek7uslVKQ_J9HWZcO3"
    )
  : null;

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (_sbClient) await _sbClient.auth.signOut();
    location.href = 'login.html';
  });
}

// ---- Navbar scroll state + scroll progress bar ----
const nav = document.getElementById('nav');
const progress = document.getElementById('scrollProgress');
const onScroll = () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  if (progress) {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Mobile menu ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    })
  );
}

// ---- Reveal on scroll (with stagger inside each section) ----
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  // give siblings sharing a parent a staggered delay
  const groups = new Map();
  reveals.forEach(r => {
    const p = r.parentElement;
    if (!groups.has(p)) groups.set(p, 0);
    const i = groups.get(p);
    r.style.setProperty('--d', (i * 0.09) + 's');
    groups.set(p, i + 1);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));
} else {
  reveals.forEach(r => r.classList.add('in'));
}

// ---- Typing effect on role line ----
const roleLine = document.getElementById('roleLine');
if (roleLine) {
  const full = roleLine.dataset.typed || '';
  const out = roleLine.querySelector('.type-text');
  if (reduceMotion) {
    out.textContent = full;
  } else {
    let i = 0;
    const tick = () => {
      out.textContent = full.slice(0, i);
      if (i++ <= full.length) setTimeout(tick, 32);
    };
    setTimeout(tick, 900); // start after hero text fades in
  }
}

// ---- Count-up numbers ----
const counters = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  if (reduceMotion) { el.textContent = target.toFixed(decimals); return; }
  const dur = 1400;
  const start = performance.now();
  const step = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = target.toFixed(decimals);
  };
  requestAnimationFrame(step);
};
if ('IntersectionObserver' in window && counters.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cio.observe(c));
} else {
  counters.forEach(animateCount);
}

// ---- Active nav indicator (scroll-spy) ----
const sectionIds = ['about', 'skills', 'projects', 'experience', 'contact'];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const linkFor = (id) => document.querySelector(`.nav-links a[href="#${id}"]`);
if ('IntersectionObserver' in window && sections.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const link = linkFor(e.target.id);
      if (!link) return;
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a.active').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));
}

// ---- Project card tilt (pointer parallax) ----
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.proj-card').forEach(card => {
    const MAX = 7; // degrees
    card.addEventListener('pointermove', (ev) => {
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;
      const py = (ev.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateY(-8px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// ---- Blur-fill backdrop for project images (no more awkward crops) ----
document.querySelectorAll('.detail-banner img, .proj-thumb img').forEach(img => {
  const apply = () => {
    const src = img.currentSrc || img.getAttribute('src');
    if (!src || !img.parentElement) return;
    if (img.parentElement.querySelector('.banner-bg')) return;
    const bg = document.createElement('div');
    bg.className = 'banner-bg';
    bg.style.backgroundImage = `url("${src}")`;
    img.parentElement.insertBefore(bg, img);
  };
  if (img.naturalWidth > 0) apply();        // already loaded
  img.addEventListener('load', apply, { once: true }); // or load later (lazy)
});

// ---- Timeline sequential light-up ----
const tlItems = document.querySelectorAll('.tl-item');
if ('IntersectionObserver' in window && tlItems.length) {
  const tio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('lit'); tio.unobserve(e.target); }
    });
  }, { threshold: 0.45 });
  tlItems.forEach(t => tio.observe(t));
} else {
  tlItems.forEach(t => t.classList.add('lit'));
}

// ---- Certificate lightbox ----
const lb = document.getElementById('lightbox');
if (lb) {
  const lbImg = lb.querySelector('img');
  const lbCap = lb.querySelector('.lb-cap');
  const openLb = (src, cap) => {
    lbImg.src = src; lbCap.textContent = cap || '';
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeLb = () => {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.removeAttribute('src'); }, 200);
  };
  document.querySelectorAll('[data-cert]').forEach(c => {
    const go = () => openLb(c.dataset.cert, c.dataset.certTitle);
    c.addEventListener('click', go);
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
  lb.addEventListener('click', closeLb);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

// ---- Magnetic buttons in hero ----
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.hero-btns .btn').forEach(btn => {
    const STR = 0.35;
    btn.addEventListener('pointermove', (ev) => {
      const r = btn.getBoundingClientRect();
      const x = ev.clientX - r.left - r.width / 2;
      const y = ev.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * STR}px, ${y * STR}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}
