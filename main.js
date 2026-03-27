/* ═══════════════════════════════════════════════
   VENYAH WATERPROOFING SOLUTIONS — main.js
═══════════════════════════════════════════════ */

/* ── Smooth-scroll helper ── */
function goTo(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
const navbar   = document.getElementById('navbar');
const navQuote = document.getElementById('nav-quote');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
  if (navQuote) navQuote.style.display = scrollY > 60 ? 'block' : 'none';

  document.querySelectorAll('section[id]').forEach(sec => {
    const a = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!a) return;
    const inView = scrollY >= sec.offsetTop - 130 && scrollY < sec.offsetTop + sec.offsetHeight;
    a.classList.toggle('active', inView);
  });
});

/* ═══════════════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════════════ */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob-menu');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  mob.classList.toggle('open');
});

function closeMob() {
  ham.classList.remove('open');
  mob.classList.remove('open');
}

/* ═══════════════════════════════════════════════
   CAROUSEL ENGINE
═══════════════════════════════════════════════ */
function Carousel(trackId, prevId, nextId, dotsId) {
  const track  = document.getElementById(trackId);
  const cards  = [...track.children];
  const dotsEl = document.getElementById(dotsId);
  let idx = 0;

  const vis = () => window.innerWidth < 640 ? 1 : window.innerWidth < 1000 ? 2 : 3;
  const cw  = () => cards[0].offsetWidth + 24;
  const max = () => Math.max(0, cards.length - vis());

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 0; i <= max(); i++) {
      const d = document.createElement('button');
      d.className = 'dot' + (i === idx ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.onclick = () => go(i);
      dotsEl.appendChild(d);
    }
  }

  function syncDots() {
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
  }

  function go(n) {
    idx = Math.max(0, Math.min(n, max()));
    track.style.transform = `translateX(-${idx * cw()}px)`;
    syncDots();
  }

  document.getElementById(prevId).onclick = () => go(idx - 1);
  document.getElementById(nextId).onclick = () => go(idx + 1);

  // Auto-play every 5 s; pause on hover
  let timer = setInterval(() => go(idx >= max() ? 0 : idx + 1), 5000);
  const section = track.closest('section');
  section.addEventListener('mouseenter', () => clearInterval(timer));
  section.addEventListener('mouseleave', () => {
    clearInterval(timer);
    timer = setInterval(() => go(idx >= max() ? 0 : idx + 1), 5000);
  });

  // Touch / drag
  let startX = 0, dragging = false;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; }, { passive: true });
  track.addEventListener('touchend',   e => {
    if (!dragging) return; dragging = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -40) go(idx + 1); else if (dx > 40) go(idx - 1);
  }, { passive: true });
  track.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; });
  window.addEventListener('mouseup',  e => {
    if (!dragging) return; dragging = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) dx < 0 ? go(idx + 1) : go(idx - 1);
  });

  window.addEventListener('resize', () => { buildDots(); go(0); });
  buildDots();
}

Carousel('proj-track',  'pp', 'pn', 'proj-dots');
Carousel('testi-track', 'tp', 'tn', 'testi-dots');

/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ═══════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════ */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const msg = document.getElementById('smsg');

  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    msg.style.display    = 'block';
    btn.textContent      = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg,#2e9e6b,#1a7a50)';
    e.target.reset();

    setTimeout(() => {
      msg.style.display    = 'none';
      btn.textContent      = 'Submit Request →';
      btn.style.background = '';
      btn.disabled         = false;
    }, 5000);
  }, 1200);
}
