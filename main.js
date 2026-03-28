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
   CONTACT FORM → WHATSAPP + EMAIL
═══════════════════════════════════════════════ */
const WHATSAPP_NUMBER = '254702548896';          // Your WhatsApp number (no + or spaces)
const RECIPIENT_EMAIL = 'info@venyahwaterproofing.co.ke'; // Your email address

function submitForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const msg  = document.getElementById('smsg');

  // Collect field values
  const firstName    = form.querySelector('#f-firstname').value.trim();
  const lastName     = form.querySelector('#f-lastname').value.trim();
  const phone        = form.querySelector('#f-phone').value.trim();
  const email        = form.querySelector('#f-email').value.trim();
  const propertyType = form.querySelector('#f-property').value;
  const service      = form.querySelector('#f-service').value;
  const details      = form.querySelector('#f-details').value.trim();

  // ── WhatsApp message ──
  const waMessage = [
    `*New Quote Request — Venyah Waterproofing*`,
    ``,
    `*Name:* ${firstName} ${lastName}`,
    `*Phone:* ${phone}`,
    `*Email:* ${email || 'Not provided'}`,
    `*Property Type:* ${propertyType || 'Not specified'}`,
    `*Service Required:* ${service || 'Not specified'}`,
    ``,
    `*Project Details:*`,
    details,
  ].join('\n');

  // ── Email subject & body ──
  const emailSubject = `Quote Request from ${firstName} ${lastName} — Venyah Waterproofing`;
  const emailBody = [
    `New Quote Request`,
    ``,
    `Name: ${firstName} ${lastName}`,
    `Phone: ${phone}`,
    `Email: ${email || 'Not provided'}`,
    `Property Type: ${propertyType || 'Not specified'}`,
    `Service Required: ${service || 'Not specified'}`,
    ``,
    `Project Details:`,
    details,
    ``,
    `---`,
    `Sent from the Venyah Waterproofing website contact form.`,
  ].join('\n');

  btn.innerHTML = 'Sending…';
  btn.disabled  = true;

  setTimeout(() => {
    // 1. Open WhatsApp in new tab
    const encoded = encodeURIComponent(waMessage);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');

    // 2. Open email client (slight delay so browser doesn't block both popups)
    setTimeout(() => {
      const mailLink = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailLink;
    }, 600);

    // Show success
    msg.style.display    = 'block';
    btn.innerHTML        = '✓ WhatsApp & Email opened!';
    btn.style.background = 'linear-gradient(135deg,#25d366,#1aa050)';
    form.reset();

    setTimeout(() => {
      msg.style.display    = 'none';
      btn.innerHTML        = '<span style="margin-right:.3rem;">💬</span> Get Free Quote';
      btn.style.background = '';
      btn.disabled         = false;
    }, 7000);
  }, 800);
}
