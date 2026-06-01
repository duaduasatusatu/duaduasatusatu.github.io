// Simple plain JS - no obfuscation, no devtools blocking
document.addEventListener('DOMContentLoaded', function() {
  // Copy Telegram link
  const copyBtn = document.getElementById('btnCopyTelegram');
  if (copyBtn) {
    copyBtn.addEventListener('click', async function() {
      try {
        await navigator.clipboard.writeText('@mfishingirl');
        const original = this.textContent;
        this.textContent = 'Tersalin!';
        setTimeout(() => this.textContent = original, 2000);
      } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = '@mfishingirl';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    });
  }

  // Modal handling
  const openMember = document.getElementById('btnOpenMember');
  const openAdmin = document.getElementById('btnOpenAdmin');
  const memberModal = document.getElementById('memberModal');
  const adminModal = document.getElementById('adminModal');
  
  function openModal(modal) {
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal(modal) {
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }
  
  if (openMember) openMember.addEventListener('click', () => openModal(memberModal));
  if (openAdmin) openAdmin.addEventListener('click', () => openModal(adminModal));
  
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', function() {
      closeModal(memberModal);
      closeModal(adminModal);
    });
  });
  
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.dataset.tab;
      document.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      document.querySelectorAll('[data-tab-content]').forEach(c => {
        c.classList.toggle('active', c.dataset.tabContent === tab);
      });
    });
  });
});

// Stats simulation
(function() {
  var elPlayers = document.getElementById('totalPlayers');
  var elWinners = document.getElementById('totalWinners');
  if (elPlayers) elPlayers.textContent = (Math.floor(Math.random() * 1500) + 800).toLocaleString('id-ID') + '+';
  if (elWinners) elWinners.textContent = (Math.floor(Math.random() * 50) + 20).toLocaleString('id-ID') + '+';
})();

// Visitor counter
(function() {
  try {
    var key = 'visitor_counter_daily_v1';
    var now = new Date();
    var dayKey = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    var payload = JSON.parse(localStorage.getItem(key) || '{}');
    if (payload.day !== dayKey) { payload.day = dayKey; payload.count = 0; }
    payload.count = (Number(payload.count) || 0) + 1;
    localStorage.setItem(key, JSON.stringify(payload));
    var el = document.getElementById('visitorCounter');
    if (el) el.textContent = payload.count.toLocaleString('id-ID');
  } catch(e) {}
})();

// Testimonials
const testimonials = [
  { name: 'Rian P.', amount: 'Rp 2.500.000', text: '🔥 Gacor di VO777! Jackpot pertama dalam 10 menit.' },
  { name: 'Sinta M.', amount: 'Rp 1.800.000', text: '🎯 Event spesial di X88VIP bikin menang terus.' },
  { name: 'Ahmad R.', amount: 'Rp 3.200.000', text: '🐟 Tembak ikan yang bagus di V98, jackpot tertinggi dalam seminggu!' },
  { name: 'Dewi A.', amount: 'Rp 900.000', text: '💎 E88 bonus harian bantu naikin peluang menang.' },
  { name: 'Budi K.', amount: 'Rp 2.100.000', text: '🎊 Ramai di L777 bikin main jadi lebih seru. Menang jadi termotivasi!' },
  { name: 'Fitri S.', amount: 'Rp 1.500.000', text: '⚡ Respons cepat RR777 perfect untuk sesi cepat-cepat di sela kerja.' },
  { name: 'Tono W.', amount: 'Rp 2.800.000', text: '🆕 Bonus member baru CV777 sangat membantu untuk pemula.' },
  { name: 'Lina K.', amount: 'Rp 4.000.000', text: '💰 Main di VO777 jackpot ikan raja langsung masuk!' },
  { name: 'Joko S.', amount: 'Rp 2.200.000', text: '🎉 Bonus harian E88 bikin saldo terus naik tiap hari.' },
  { name: 'Mega L.', amount: 'Rp 3.500.000', text: '🚀 V98 server cepat, tidak ada lag saat tembak ikan besar.' },
  { name: 'Rizky A.', amount: 'Rp 1.900.000', text: '😍 Komunitas L777 sangat ramai, ada yang main bareng tiap malam.' }
];

let currentTestimonial = 0;
let testimonialInterval;

function updateTestimonial() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;
  
  // Update active class for testimonial item
  const testimonialItems = carousel.querySelectorAll('.testimonial-item');
  testimonialItems.forEach((item, index) => {
    item.classList.toggle('active', index === currentTestimonial);
  });
  
  // Update dot indicators
  const dots = document.querySelectorAll('.carousel-dots button');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentTestimonial);
  });
  
  // Restart interval
  clearInterval(testimonialInterval);
  testimonialInterval = setInterval(nextTestimonial, 5000);
}

function prevTestimonial() {
  currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
  updateTestimonial();
}

function nextTestimonial() {
  currentTestimonial = (currentTestimonial + 1) % testimonials.length;
  updateTestimonial();
}

// Initialize carousel
function initTestimonialCarousel() {
  const carousel = document.getElementById('testimonialCarousel');
  if (!carousel) return;
  
  // Create testimonial items
  carousel.innerHTML = '';
  testimonials.forEach((testimonial, index) => {
    const item = document.createElement('div');
    item.className = `testimonial-item ${index === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <div class="testimonial-text">"${testimonial.text}"</div>
      <div class="testimonial-author">${testimonial.name}</div>
      <div class="testimonial-amount">${testimonial.amount}</div>
    `;
    carousel.appendChild(item);
  });
  
  // Create dot indicators
  const dotsContainer = document.getElementById('carouselDots');
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    testimonials.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = index === 0 ? 'active' : '';
      dot.setAttribute('aria-label', `Ulasan ${index + 1}`);
      dot.addEventListener('click', () => {
        currentTestimonial = index;
        updateTestimonial();
      });
      dotsContainer.appendChild(dot);
    });
  }
  
  // Add event listeners to controls
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
  
  // Start automatic rotation
  testimonialInterval = setInterval(nextTestimonial, 5000);
  
  // Initial update
  updateTestimonial();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initTestimonialCarousel);