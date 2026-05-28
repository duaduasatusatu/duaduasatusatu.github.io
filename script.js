const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));

// Header elevate + active section
const header = qs('.site-header');
const navLinks = qsa('.nav-link[data-section]');

function setActiveSection(id){
  navLinks.forEach(a => {
    const match = a.dataset.section === id;
    a.classList.toggle('is-active', match);
    if (match) a.setAttribute('aria-current','page');
    else a.removeAttribute('aria-current');
  });
}

const sections = qsa('main [id]');

const io = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => (b.intersectionRatio - a.intersectionRatio));

  if (!visible.length) return;
  const id = visible[0].target.id;
  setActiveSection(id);
}, { root: null, threshold: [0.15, 0.3, 0.5] });

sections.forEach(s => io.observe(s));

window.addEventListener('scroll', () => {
  if (header && header.dataset) {
    header.dataset.elevated = window.scrollY > 10 ? 'true' : 'false';
  }
});


// Smooth scroll
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior:'smooth', block:'start' });

    // mobile close
    const nav = qs('.nav');
    const toggle = qs('.nav-toggle');
    if (nav && toggle && nav.dataset.open === 'true'){
      nav.dataset.open = 'false';
      toggle.setAttribute('aria-expanded','false');
    }
  });
});

// Mobile nav toggle
const toggleBtn = qs('.nav-toggle');
const nav = qs('.nav');
if (toggleBtn && nav){
  toggleBtn.addEventListener('click', () => {
    const open = nav.dataset.open === 'true';
    nav.dataset.open = open ? 'false' : 'true';
    toggleBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
}

// Copy to clipboard
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch(_){
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try{ document.execCommand('copy'); return true; }catch(e){ return false; }
    finally{ ta.remove(); }
  }
}

const telegramUsername = 'mfishingirl';
const xUsername = 'leafia.chan';

const btnCopyTelegram = qs('#btnCopyTelegram');
if (btnCopyTelegram){
  btnCopyTelegram.addEventListener('click', async () => {
    const ok = await copyText(`@${telegramUsername}`);
    const prev = btnCopyTelegram.textContent;
    btnCopyTelegram.textContent = ok ? 'Telegram Copied ✓' : 'Copy Gagal';
    setTimeout(() => btnCopyTelegram.textContent = prev, 1400);
  });
}

// Member modal open/close
const memberModal = qs('#memberModal');
const btnOpenMember = qs('#btnOpenMember');

function setModalOpen(open){
  if (!memberModal) return;
  memberModal.hidden = !open;
  if (open){
    memberModal.dataset.open = 'true';
    memberModal.querySelector('[data-close="true"]')?.focus?.();
  } else {
    memberModal.dataset.open = 'false';
  }
}

if (btnOpenMember && memberModal){
  btnOpenMember.addEventListener('click', () => setModalOpen(true));
}

if (memberModal){
  memberModal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.getAttribute && target.getAttribute('data-close') === 'true'){
      setModalOpen(false);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !memberModal.hidden){
      setModalOpen(false);
    }
  });
}

const btnCopyX = qs('#btnCopyX');
if (btnCopyX){
  btnCopyX.addEventListener('click', async () => {
    const ok = await copyText(`@${xUsername}`);
    btnCopyX.textContent = ok ? 'X Copied ✓' : 'Copy Gagal';
    setTimeout(() => btnCopyX.textContent = 'Copy X', 1400);
  });
}

// Contact form -> mailto
const contactForm = qs('#contactForm');
if (contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(contactForm);
    const name = String(form.get('name') || '').trim();
    const message = String(form.get('message') || '').trim();

    if (!message){
      return;
    }

    const to = 'your-email@example.com';
    const subject = encodeURIComponent(`Pesan dari ${name || 'pengunjung'}`);
    const body = encodeURIComponent(message + (name ? `\n\n— ${name}` : ''));

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}

// Login (demo)
const loginForm = qs('#loginForm');
const loginMsg = qs('#loginMsg');
const btnLogout = qs('#btnLogout');

const memberStatus = qs('#memberStatus');
const memberUser = qs('#memberUser');
const memberContent = qs('#memberContent');

const AUTH_KEY = 'member_demo_auth_v1';

function setMemberUI(isAuthed, username=''){
  if (!memberStatus || !memberUser || !memberContent) return;
  if (isAuthed){
    memberStatus.textContent = 'Login';
    memberUser.textContent = username;
    memberContent.style.display = 'block';
  } else {
    memberStatus.textContent = 'Belum login';
    memberUser.textContent = '—';
    memberContent.style.display = 'none';
  }
}

(function initAuth(){
  try{
    const payload = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    if (payload && payload.username){
      setMemberUI(true, payload.username);
    } else {
      setMemberUI(false);
    }
  }catch(_){
    setMemberUI(false);
  }
})();

if (loginForm){
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData(loginForm);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '').trim();

    // Demo credentials (not secure)
    // login if password length >= 4
    if (!username){
      loginMsg.textContent = 'Username wajib diisi.';
      return;
    }
    if (password.length < 4){
      loginMsg.textContent = 'Password minimal 4 karakter (demo).';
      return;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, t: Date.now() }));
    loginMsg.textContent = 'Login berhasil (demo).';
    setMemberUI(true, username);
  });
}

if (btnLogout){
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    if (loginMsg) loginMsg.textContent = 'Logout berhasil.';
    setMemberUI(false);
  });
}

// ─── Testimonial Carousel ───────────────────────
const testimonials = [
  { name: 'Budi K.', amount: 'Rp 2.500.000', text: '🎉 Menang besar pertama kali main! Main di VO777 dan langsung jackpot.' },
  { name: 'Siti M.', amount: 'Rp 1.800.000', text: '✨ Bonus harian di E88 sangat konsisten. Sudah 3 hari berturut-turut menang.' },
  { name: 'Ahmad R.', amount: 'Rp 3.200.000', text: '🐟 Tembak ikan yang bagus di V98, jackpot tertinggi dalam seminggu!' },
  { name: 'Dewi L.', amount: 'Rp 1.500.000', text: '💰 Strategi di X88VIP event premium berhasil! Sangat worth it.' },
  { name: 'Rinto H.', amount: 'Rp 2.100.000', text: '🎊 Ramai di L777 bikin main jadi lebih seru. Menang jadi termotivasi!' },
  { name: 'Fitri S.', amount: 'Rp 1.600.000', text: '⚡ Respons cepat RR777 perfect untuk sesi cepat-cepat di sela kerja.' },
  { name: 'Doni P.', amount: 'Rp 2.800.000', text: '🆕 Bonus member baru CV777 sangat generous. Langsung kaya!' }
];

let currentTestimonialIndex = 0;
let testimonialAutoRotate;

function renderTestimonials(){
  const carousel = qs('#testimonialCarousel');
  const dotsContainer = qs('#carouselDots');
  
  if (!carousel || !dotsContainer) return;
  
  carousel.innerHTML = testimonials.map((t, i) => `
    <div class="testimonial-item ${i === 0 ? 'active' : ''}">
      <div class="testimonial-content">
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">${t.name}</div>
        <div class="testimonial-amount">${t.amount}</div>
      </div>
    </div>
  `).join('');
  
  dotsContainer.innerHTML = testimonials.map((_, i) => `
    <button class="carousel-dot ${i === 0 ? 'active' : ''}" type="button" data-index="${i}" aria-label="Testimonial ${i + 1}"></button>
  `).join('');
}

function showTestimonial(index){
  currentTestimonialIndex = (index + testimonials.length) % testimonials.length;
  
  const items = qsa('.testimonial-item');
  const dots = qsa('.carousel-dot');
  
  items.forEach((item, i) => {
    item.classList.toggle('active', i === currentTestimonialIndex);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTestimonialIndex);
  });
}

function startTestimonialAutoRotate(){
  clearInterval(testimonialAutoRotate);
  testimonialAutoRotate = setInterval(() => {
    showTestimonial(currentTestimonialIndex + 1);
  }, 4500);
}

renderTestimonials();
startTestimonialAutoRotate();

const carouselPrev = qs('#carouselPrev');
const carouselNext = qs('#carouselNext');

if (carouselPrev) {
  carouselPrev.addEventListener('click', () => {
    showTestimonial(currentTestimonialIndex - 1);
    startTestimonialAutoRotate();
  });
}

if (carouselNext) {
  carouselNext.addEventListener('click', () => {
    showTestimonial(currentTestimonialIndex + 1);
    startTestimonialAutoRotate();
  });
}

qsa('.carousel-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    showTestimonial(parseInt(e.target.dataset.index));
    startTestimonialAutoRotate();
  });
});

// ─── Register Form ──────────────────────────────
const registerForm = qs('#registerForm');
const registerMsg = qs('#registerMsg');

if (registerForm){
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = new FormData(registerForm);
    const username = String(form.get('reg-username') || '').trim();
    const email = String(form.get('reg-email') || '').trim();
    const password = String(form.get('reg-password') || '').trim();
    const passwordConfirm = String(form.get('reg-password-confirm') || '').trim();
    
    if (!username){
      registerMsg.textContent = '❌ Username wajib diisi.';
      return;
    }
    if (password.length < 4){
      registerMsg.textContent = '❌ Password minimal 4 karakter.';
      return;
    }
    if (password !== passwordConfirm){
      registerMsg.textContent = '❌ Password tidak cocok.';
      return;
    }
    
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, email, t: Date.now() }));
    registerMsg.textContent = '✅ Register berhasil! Sekarang Anda sudah bisa login.';
    registerForm.reset();
    
    setTimeout(() => {
      const loginTab = qs('[data-tab="login"]');
      if (loginTab) loginTab.click();
      setMemberUI(true, username);
    }, 1000);
  });
}

// ─── Modal Tabs ─────────────────────────────────
qsa('.modal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    qsa('.modal-tab').forEach(t => t.classList.remove('active'));
    qsa('.modal-tab-content').forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    const content = qs(`[data-tab-content="${tabName}"]`);
    if (content) content.classList.add('active');
  });
});

// Footer year
const y = qs('#year');
if (y) y.textContent = new Date().getFullYear();
