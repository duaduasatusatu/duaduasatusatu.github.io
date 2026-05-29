// Utility functions
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

// Copy to clipboard utility
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (e) {
      return false;
    } finally {
      ta.remove();
    }
  }
}

// Initialize testimonials data
const testimonials = [
  { name: 'Budi K.', amount: 'Rp 2.500.000', text: '🎉 Menang besar pertama kali main! Main di VO777 dan langsung jackpot.' },
  { name: 'Siti M.', amount: 'Rp 1.800.000', text: '✨ Bonus harian di E88 sangat konsisten. Sudah 3 hari berturut-turut menang.' },
  { name: 'Ahmad R.', amount: 'Rp 3.200.000', text: '🐟 Tembak ikan yang bagus di V98, jackpot tertinggi dalam seminggu!' },
  { name: 'Dewi L.', amount: 'Rp 1.500.000', text: '💰 Strategi di X88VIP event premium berhasil! Sangat worth it.' },
  { name: 'Rinto H.', amount: 'Rp 2.100.000', text: '🎊 Ramai di L777 bikin main jadi lebih seru. Menang jadi termotivasi!' },
  { name: 'Fitri S.', amount: 'Rp 1.600.000', text: '⚡ Respons cepat RR777 perfect untuk sesi cepat-cepat di sela kerja.' },
  { name: 'Doni P.', amount: 'Rp 2.800.000', text: '🆕 Bonus member baru CV777 sangat generous. Langsung kaya!' }
];

// Testimonial Carousel
let currentTestimonialIndex = 0;
let testimonialAutoRotate;

function renderTestimonials() {
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

function showTestimonial(index) {
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

function startTestimonialAutoRotate() {
  clearInterval(testimonialAutoRotate);
  testimonialAutoRotate = setInterval(() => {
    showTestimonial(currentTestimonialIndex + 1);
  }, 4500);
}

// Initialize testimonial carousel
renderTestimonials();
startTestimonialAutoRotate();

// Testimonial controls
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

// Dot controls
qsa('.carousel-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    showTestimonial(parseInt(e.target.dataset.index));
    startTestimonialAutoRotate();
  });
});

// Copy Telegram functionality
const telegramUsername = 'mfishingirl';
const btnCopyTelegram = qs('#btnCopyTelegram');

if (btnCopyTelegram) {
  btnCopyTelegram.addEventListener('click', async () => {
    const ok = await copyText(`@${telegramUsername}`);
    const prev = btnCopyTelegram.textContent;
    btnCopyTelegram.textContent = ok ? 'Telegram Copied ✓' : 'Copy Gagal';
    setTimeout(() => btnCopyTelegram.textContent = prev, 1400);
  });
}

// Member Modal functionality
const memberModal = qs('#memberModal');
const btnOpenMember = qs('#btnOpenMember');

function setModalOpen(open) {
  if (!memberModal) return;
  memberModal.hidden = !open;
  if (open) {
    memberModal.dataset.open = 'true';
    memberModal.querySelector('[data-close="true"]')?.focus?.();
  } else {
    memberModal.dataset.open = 'false';
  }
}

if (btnOpenMember && memberModal) {
  btnOpenMember.addEventListener('click', () => setModalOpen(true));
}

// Modal close functionality
if (memberModal) {
  memberModal.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.getAttribute && target.getAttribute('data-close') === 'true') {
      setModalOpen(false);
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !memberModal.hidden) {
      setModalOpen(false);
    }
  });
}

// Member authentication
const AUTH_KEY = 'member_demo_auth_v1';
const loginForm = qs('#loginForm');
const registerForm = qs('#registerForm');
const loginMsg = qs('#loginMsg');
const registerMsg = qs('#registerMsg');
const btnLogout = qs('#btnLogout');

const memberStatus = qs('#memberStatus');
const memberUser = qs('#memberUser');
const memberContent = qs('#memberContent');

function setMemberUI(isAuthed, username = '') {
  if (!memberStatus || !memberUser || !memberContent) return;
  
  if (isAuthed) {
    memberStatus.textContent = 'Login';
    memberUser.textContent = username;
    memberContent.style.display = 'block';
  } else {
    memberStatus.textContent = 'Belum login';
    memberUser.textContent = '—';
    memberContent.style.display = 'none';
  }
}

// Initialize auth state
(function initAuth() {
  try {
    const payload = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    if (payload && payload.username) {
      setMemberUI(true, payload.username);
    } else {
      setMemberUI(false);
    }
  } catch (_) {
    setMemberUI(false);
  }
})();

// Login form handling
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = new FormData(loginForm);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '').trim();

    if (!username) {
      loginMsg.textContent = 'Username wajib diisi.';
      return;
    }
    
    if (password.length < 4) {
      loginMsg.textContent = 'Password minimal 4 karakter (demo).';
      return;
    }

    localStorage.setItem(AUTH_KEY, JSON.stringify({ username, t: Date.now() }));
    loginMsg.textContent = 'Login berhasil (demo).';
    setMemberUI(true, username);
  });
}

// Logout functionality
if (btnLogout) {
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem(AUTH_KEY);
    if (loginMsg) loginMsg.textContent = 'Logout berhasil.';
    setMemberUI(false);
  });
}

// Register form handling
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const form = new FormData(registerForm);
    const username = String(form.get('reg-username') || '').trim();
    const email = String(form.get('reg-email') || '').trim();
    const password = String(form.get('reg-password') || '').trim();
    const passwordConfirm = String(form.get('reg-password-confirm') || '').trim();

    if (!username) {
      registerMsg.textContent = '❌ Username wajib diisi.';
      return;
    }
    
    if (password.length < 4) {
      registerMsg.textContent = '❌ Password minimal 4 karakter.';
      return;
    }
    
    if (password !== passwordConfirm) {
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

// Modal tabs functionality
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

// Smooth scrolling for anchor links
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    
    const target = qs(href);
    if (!target) return;
    
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// FAQ Accordion functionality
qsa('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', !isExpanded);
    
    const answer = question.nextElementSibling;
    if (answer && answer.classList.contains('faq-answer')) {
      answer.classList.toggle('active');
    }
  });
});

// Visitor counter
(function () {
  try {
    const key = 'visitor_counter_daily_v1';
    const now = new Date();
    const dayKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    let payload = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!payload || typeof payload !== 'object') payload = {};
    if (payload.day !== dayKey) { 
      payload.day = dayKey; 
      payload.count = 0; 
    }
    payload.count = (Number(payload.count) || 0) + 1;
    localStorage.setItem(key, JSON.stringify(payload));
    
    const el = document.getElementById('visitorCounter');
    if (el) el.textContent = payload.count.toLocaleString('id-ID');
  } catch (e) {
    // Silent error for visitor counter
  }
})();

// Admin Authentication
(function () {
  const ADMIN_USERNAME = 'Adeovalin2211';
  const ADMIN_PASSWORD = 'Brebes25';
  const ADMIN_AUTH_KEY = 'admin_demo_auth_v1';
  
  const adminModal = qs('#adminModal');
  const btnOpenAdmin = qs('#btnOpenAdmin');
  const adminLoginForm = qs('#adminLoginForm');
  const adminLoginMsg = qs('#adminLoginMsg');
  const adminPanel = qs('#adminPanel');
  const btnAdminLogout = qs('#btnAdminLogout');
  const pendingComments = qs('#pendingComments');
  
  // Check if admin is logged in
  function isAdminLoggedIn() {
    try {
      const payload = JSON.parse(localStorage.getItem(ADMIN_AUTH_KEY) || 'null');
      return payload && payload.username === ADMIN_USERNAME;
    } catch (e) {
      return false;
    }
  }
  
  // Show admin button only if admin logged in
  function updateAdminButton() {
    if (btnOpenAdmin) {
      btnOpenAdmin.style.display = isAdminLoggedIn() ? 'inline-flex' : 'none';
    }
  }
  
  // Open admin modal
  if (btnOpenAdmin && adminModal) {
    btnOpenAdmin.addEventListener('click', () => {
      adminModal.hidden = false;
      adminModal.dataset.open = 'true';
    });
  }
  
  // Close admin modal
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.getAttribute && target.getAttribute('data-close') === 'true') {
        adminModal.hidden = true;
      }
    });
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !adminModal.hidden) {
        adminModal.hidden = true;
      }
    });
  }
  
  // Admin login handling
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const form = new FormData(adminLoginForm);
      const username = String(form.get('admin-username') || '').trim();
      const password = String(form.get('admin-password') || '').trim();
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify({ username, t: Date.now() }));
        adminLoginMsg.textContent = 'Login admin berhasil!';
        adminPanel.style.display = 'block';
        adminLoginForm.style.display = 'none';
        updateAdminButton();
        renderPendingComments();
      } else {
        adminLoginMsg.textContent = 'Username atau password admin salah!';
      }
    });
  }
  
  // Admin logout
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      adminPanel.style.display = 'none';
      adminLoginForm.style.display = 'block';
      adminLoginForm.reset();
      adminLoginMsg.textContent = 'Logout admin berhasil.';
      adminModal.hidden = true;
      updateAdminButton();
    });
  }
  
  // Comment System
  const COMMENTS_KEY = 'comments_demo_v1';
  
  function loadComments() {
    try {
      const data = localStorage.getItem(COMMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
  
  function saveComments(comments) {
    try {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    } catch (e) {}
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function renderPendingComments() {
    if (!pendingComments) return;
    
    const comments = loadComments();
    const pending = comments.filter(c => !c.approved);
    
    if (pending.length === 0) {
      pendingComments.innerHTML = '<p class="empty-state">Tidak ada komentar yang menunggu persetujuan.</p>';
      return;
    }
    
    pendingComments.innerHTML = pending.map((comment, index) => `
      <div class="comment-card card">
        <div class="comment-header">
          <span class="comment-user">${escapeHtml(comment.username)}</span>
          <span class="comment-time">${new Date(comment.timestamp).toLocaleString('id-ID')}</span>
        </div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
        <div class="comment-actions">
          <button class="btn btn--approve" data-index="${index}">Setujui</button>
          <button class="btn btn--reject" data-index="${index}">Tolak</button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners for approve/reject buttons
    qsa('.btn--approve').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        approveComment(idx);
      });
    });
    
    qsa('.btn--reject').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        rejectComment(idx);
      });
    });
  }
  
  function approveComment(index) {
    const comments = loadComments();
    const pending = comments.filter(c => !c.approved);
    const commentToApprove = pending[index];
    
    if (!commentToApprove) return;
    
    const commentIdx = comments.findIndex(c => c.id === commentToApprove.id);
    if (commentIdx > -1) {
      comments[commentIdx].approved = true;
      saveComments(comments);
      renderPendingComments();
      renderApprovedComments();
      adminLoginMsg.textContent = 'Komentar disetujui!';
    }
  }
  
  function rejectComment(index) {
    const comments = loadComments();
    const pending = comments.filter(c => !c.approved);
    const commentToReject = pending[index];
    
    if (!commentToReject) return;
    
    const commentIdx = comments.findIndex(c => c.id === commentToReject.id);
    if (commentIdx > -1) {
      comments.splice(commentIdx, 1);
      saveComments(comments);
      renderPendingComments();
      adminLoginMsg.textContent = 'Komentar ditolak!';
    }
  }
  
  function renderApprovedComments() {
    const commentsList = qs('#commentsList');
    if (!commentsList) return;
    
    const comments = loadComments();
    const approved = comments.filter(c => c.approved);
    
    if (approved.length === 0) {
      commentsList.innerHTML = '<p class="empty-state">Belum ada komentar yang disetujui.</p>';
      return;
    }
    
    commentsList.innerHTML = approved.map(comment => `
      <div class="comment-card card">
        <div class="comment-header">
          <span class="comment-user">${escapeHtml(comment.username)}</span>
          <span class="comment-time">${new Date(comment.timestamp).toLocaleString('id-ID')}</span>
        </div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      </div>
    `).join('');
  }
  
  // Comment form handling
  const commentForm = qs('#commentForm');
  const commentMsg = qs('#commentMsg');
  const commentFormWrapper = qs('#commentFormWrapper');
  const commentLoginMsg = qs('#commentLoginMsg');
  
  // Show comment form for logged-in members
  function updateCommentFormVisibility() {
    const isMemberLoggedIn = !!JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    if (commentFormWrapper) {
      commentFormWrapper.style.display = isMemberLoggedIn ? 'block' : 'none';
    }
    if (commentLoginMsg) {
      commentLoginMsg.style.display = isMemberLoggedIn ? 'none' : 'block';
    }
  }
  
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const form = new FormData(commentForm);
      const text = String(form.get('comment-text') || '').trim();
      
      if (!text) {
        commentMsg.textContent = 'Komentar tidak boleh kosong!';
        return;
      }
      
      const authData = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
      const username = authData?.username || 'Anonymous';
      
      const comments = loadComments();
      comments.push({
        id: Date.now() + Math.random(),
        text: text,
        username: username,
        timestamp: Date.now(),
        approved: false
      });
      saveComments(comments);
      
      commentForm.reset();
      commentMsg.textContent = 'Komentar terkirim, menunggu persetujuan admin!';
      renderPendingComments();
    });
  }
  
  // Initialize
  updateAdminButton();
  updateCommentFormVisibility();
  renderApprovedComments();
  
  // Listen for auth changes
  window.addEventListener('storage', () => {
    updateAdminButton();
    updateCommentFormVisibility();
    renderPendingComments();
  });
})();