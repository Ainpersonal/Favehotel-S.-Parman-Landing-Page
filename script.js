/* ============================================================
   favehotel S. Parman Medan — script.js
   Interactive & Dynamic Behaviors
   ============================================================ */

'use strict';

/* ── LOADER ─────────────────────────────────────────────────── */
(function initLoader() {
  const loader     = document.getElementById('loader');
  const fill       = document.getElementById('loaderFill');
  if (!loader || !fill) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAOS();
        animateCounters();
      }, 300);
    }
    fill.style.width = progress + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

/* cursor: menggunakan cursor default browser */

/* ── NAVBAR ──────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile menu
  if (hamburger) {
    let mobileMenu = document.getElementById('mobileMenuOverlay');

    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.id = 'mobileMenuOverlay';
      mobileMenu.className = 'mobile-menu';

      const links = ['Tentang', 'Kamar', 'Fasilitas', 'Galeri', 'Kontak'];
      const hrefs = ['#about', '#rooms', '#facilities', '#gallery', '#contact'];

      links.forEach((txt, i) => {
        const a = document.createElement('a');
        a.href = hrefs[i];
        a.className = 'nav-link';
        a.textContent = txt;
        a.addEventListener('click', () => toggleMenu(false));
        mobileMenu.appendChild(a);
      });

      document.body.appendChild(mobileMenu);
    }

    let menuOpen = false;

    function toggleMenu(force) {
      menuOpen = force !== undefined ? force : !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      document.body.style.overflow = menuOpen ? 'hidden' : '';

      // Animate hamburger → X
      const spans = hamburger.querySelectorAll('span');
      if (menuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(4px, 4.5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(4px, -4.5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    }

    hamburger.addEventListener('click', () => toggleMenu());
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen) toggleMenu(false);
    });
  }
})();

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── AOS (Animate On Scroll) ─────────────────────────────────── */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  counters.forEach(counter => {
    const target   = parseInt(counter.dataset.count);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

/* ── GALLERY ─────────────────────────────────────────────────── */
(function initGallery() {
  const track   = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const dotsEl  = document.getElementById('galleryDots');
  const items   = track ? track.querySelectorAll('.gallery-item') : [];

  if (!track || !items.length) return;

  // Create dots
  items.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => scrollToItem(i));
    dotsEl.appendChild(dot);
  });

  function updateDots() {
    const scrollLeft = track.scrollLeft;
    const itemWidth  = items[0].offsetWidth + 16; // gap
    const activeIdx  = Math.round(scrollLeft / itemWidth);
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === activeIdx);
    });
  }

  function scrollToItem(idx) {
    const itemWidth = items[0].offsetWidth + 16;
    track.scrollTo({ left: idx * itemWidth, behavior: 'smooth' });
  }

  let currentIdx = 0;

  prevBtn && prevBtn.addEventListener('click', () => {
    currentIdx = Math.max(currentIdx - 1, 0);
    scrollToItem(currentIdx);
  });

  nextBtn && nextBtn.addEventListener('click', () => {
    currentIdx = Math.min(currentIdx + 1, items.length - 1);
    scrollToItem(currentIdx);
  });

  track.addEventListener('scroll', updateDots, { passive: true });

  // Lightbox
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxClose= document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let lightboxIdx = 0;
  const galleryImgs = Array.from(items).map(item => item.querySelector('img'));

  function openLightbox(idx) {
    lightboxIdx = idx;
    const img = galleryImgs[idx];
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox && lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navLightbox(dir) {
    lightboxIdx = (lightboxIdx + dir + items.length) % items.length;
    const img = galleryImgs[lightboxIdx];
    if (!img) return;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.style.opacity = '1';
    }, 200);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && img.src && !img.src.endsWith('/')) openLightbox(i);
    });
  });

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev  && lightboxPrev.addEventListener('click', () => navLightbox(-1));
  lightboxNext  && lightboxNext.addEventListener('click', () => navLightbox(1));

  lightbox && lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
})();

/* ── TESTIMONIALS SLIDER ─────────────────────────────────────── */
(function initTestimonials() {
  const slider    = document.getElementById('testiSlider');
  const dotsEl    = document.getElementById('testiDots');
  const prevBtn   = document.getElementById('testiPrev');
  const nextBtn   = document.getElementById('testiNext');
  const cards     = slider ? slider.querySelectorAll('.testi-card') : [];

  if (!slider || !cards.length) return;

  let current = 0;

  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsEl && dotsEl.appendChild(dot);
  });

  // Set slider min-height based on largest card
  function setMinHeight() {
    let maxH = 0;
    cards.forEach(card => {
      card.style.position = 'static';
      maxH = Math.max(maxH, card.offsetHeight);
      card.style.position = '';
    });
    slider.style.minHeight = maxH + 'px';
  }

  setMinHeight();
  window.addEventListener('resize', setMinHeight);

  function goTo(idx) {
    cards[current].classList.remove('active');
    dotsEl && dotsEl.querySelectorAll('.dot')[current].classList.remove('active');

    current = (idx + cards.length) % cards.length;

    cards[current].classList.add('active');
    dotsEl && dotsEl.querySelectorAll('.dot')[current].classList.add('active');
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-rotate
  let autoRotate = setInterval(() => goTo(current + 1), 5000);

  slider.addEventListener('mouseenter', () => clearInterval(autoRotate));
  slider.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch swipe
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });
})();

/* ── BOOKING FORM ────────────────────────────────────────────── */
(function initBookingForm() {
  const form        = document.getElementById('bookingForm');
  const checkinDate = document.getElementById('checkinDate');
  const checkoutDate= document.getElementById('checkoutDate');

  if (!form) return;

  // Set min date to today
  const today = new Date().toISOString().split('T')[0];
  if (checkinDate)  checkinDate.min  = today;
  if (checkoutDate) checkoutDate.min = today;

  // Ensure checkout is after checkin
  checkinDate && checkinDate.addEventListener('change', () => {
    if (checkoutDate) {
      checkoutDate.min = checkinDate.value;
      if (checkoutDate.value && checkoutDate.value <= checkinDate.value) {
        const next = new Date(checkinDate.value);
        next.setDate(next.getDate() + 1);
        checkoutDate.value = next.toISOString().split('T')[0];
      }
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = form.querySelectorAll('[required]');
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#ff4d6d';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });

    if (valid) {
      showToast('✅ Terima kasih! Reservasi Anda telah diterima. Kami akan menghubungi Anda segera.');
      form.reset();
    } else {
      showToast('⚠️ Mohon lengkapi semua data yang diperlukan.');
    }
  });
})();

/* ── NEWSLETTER ──────────────────────────────────────────────── */
(function initNewsletter() {
  const form  = document.querySelector('.newsletter-form');
  const input = form ? form.querySelector('input') : null;
  const btn   = form ? form.querySelector('button') : null;

  if (!form || !input || !btn) return;

  btn.addEventListener('click', e => {
    e.preventDefault();
    const email = input.value.trim();
    if (!email || !email.includes('@')) {
      showToast('⚠️ Masukkan alamat email yang valid.');
      return;
    }
    showToast('✅ Terima kasih! Anda telah berlangganan newsletter kami.');
    input.value = '';
  });
})();

/* ── BACK TO TOP ─────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── PARALLAX HERO ───────────────────────────────────────────── */
(function initParallax() {
  const heroBg = document.getElementById('heroBgImg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY  = window.scrollY;
    const speed    = 0.35;
    heroBg.style.transform = `translateY(${scrollY * speed}px)`;
  }, { passive: true });
})();

/* ── TOAST ───────────────────────────────────────────────────── */
function showToast(message, duration = 4000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ── IMAGE PLACEHOLDER LABELS ────────────────────────────────── */
(function labelPlaceholders() {
  const labels = {
    'room-standard.jpg': 'Standard Room',
    'room-deluxe.jpg':   'Deluxe Room',
    'room-suite.jpg':    'Suite Room',
    'gallery-1.jpg':     'Lobby Utama',
    'gallery-2.jpg':     'Restoran',
    'gallery-3.jpg':     'Kolam Renang',
    'gallery-4.jpg':     'Ruang Meeting',
    'gallery-5.jpg':     'Kamar Deluxe',
    'gallery-6.jpg':     'Pusat Kebugaran',
    'about-hotel.jpg':   'Foto Hotel',
    'hero-bg.jpg':       'Latar Belakang',
  };

  document.querySelectorAll('img[src]').forEach(img => {
    const filename = img.src.split('/').pop();
    const label    = labels[filename];
    if (label) {
      img.addEventListener('error', () => {
        const wrap = img.parentElement;
        wrap.classList.add('img-placeholder');
        if (!wrap.querySelector('.placeholder-label')) {
          const span = document.createElement('span');
          span.className = 'placeholder-label';
          span.textContent = label;
          span.style.cssText = `
            position:absolute; inset:0; display:flex; align-items:center;
            justify-content:center; color:rgba(255,255,255,0.3);
            font-size:.75rem; letter-spacing:.15em; text-transform:uppercase;
          `;
          wrap.style.position = 'relative';
          wrap.appendChild(span);
        }
      });
    }
  });
})();

/* ── ACTIVE NAV LINK ON SCROLL ───────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => observer.observe(s));
})();

/* ── HOVER TILT FOR ROOM CARDS ───────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left - rect.width  / 2;
      const y      = e.clientY - rect.top  - rect.height / 2;
      const tiltX  = -(y / rect.height) * 6;
      const tiltY  =  (x / rect.width)  * 6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── HERO PARTICLE CANVAS ────────────────────────────────────── */
(function initParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position:absolute; inset:0; z-index:0; pointer-events:none; opacity:0.35;
  `;
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:    Math.random() * canvas.width,
        y:    Math.random() * canvas.height,
        r:    Math.random() * 1.5 + 0.4,
        vx:   (Math.random() - 0.5) * 0.3,
        vy:  -(Math.random() * 0.4 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(214, 228, 255, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(30, 91, 204, ${0.1 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0)              p.y = canvas.height;
      if (p.x < 0)              p.x = canvas.width;
      if (p.x > canvas.width)   p.x = 0;
    });

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ── REVEAL STATS ON SCROLL ──────────────────────────────────── */
(function revealStats() {
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.5 });

  observer.observe(statsSection);
})();

/* ── FLOATING NAV ACTIVE STYLE ───────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active { color: var(--white) !important; }
  .nav-link.active::after { width: 100% !important; }

  .img-placeholder {
    background: linear-gradient(135deg, #0E2347, #1A3D6B) !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }
`;
document.head.appendChild(style);

/* ── KEYBOARD ACCESSIBILITY ──────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    document.body.classList.add('using-keyboard');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('using-keyboard');
});

const a11yStyle = document.createElement('style');
a11yStyle.textContent = `
  body.using-keyboard *:focus {
    outline: 2px solid var(--blue-bright) !important;
    outline-offset: 3px !important;
  }
`;
document.head.appendChild(a11yStyle);

console.log(
  '%c favehotel S. Parman Medan ',
  'background: #1E5BCC; color: #fff; padding: 6px 16px; border-radius: 4px; font-size: 14px;'
);
console.log('%c Website ready. Customize your images by replacing the placeholder file paths in index.html', 'color: #2E6FE0');

/* ============================================================
   MIDTRANS PAYMENT INTEGRATION
   ============================================================ */

/* ── KONFIGURASI ─────────────────────────────────────────────
   PENTING: Sesuaikan nilai berikut dengan akun Midtrans Anda
   - Daftar di: https://dashboard.midtrans.com
   - Client Key ada di: Settings → Access Keys
   ─────────────────────────────────────────────────────────── */
const MIDTRANS_CONFIG = {
  // Ganti dengan Client Key Anda (lihat di tag <script> Midtrans di index.html)
  clientKey: 'YOUR_MIDTRANS_CLIENT_KEY',

  // Harga kamar (IDR) — sesuaikan dengan harga aktual
  roomPrices: {
    'Kamar Standar': 350000,
    'Kamar Deluxe':  550000,
    'Kamar Suite':   850000,
  },

  // Server Key HANYA dipakai di backend (Node.js / PHP)
  // JANGAN taruh server key di frontend!
  // serverKey: 'YOUR_SERVER_KEY' ← HAPUS baris ini, taruh di backend
};

/* ── STATE PEMBAYARAN ─────────────────────────────────────── */
let paymentState = {
  method:   'snap',
  formData: {},
  nights:   1,
  total:    0,
};

/* ── BUKA MODAL PEMBAYARAN ───────────────────────────────── */
function openPaymentModal(formData) {
  const backdrop = document.getElementById('paymentModalBackdrop');
  if (!backdrop) return;

  paymentState.formData = formData;

  // Hitung durasi menginap
  const checkin  = new Date(formData.checkin);
  const checkout = new Date(formData.checkout);
  const nights   = Math.max(1, Math.round((checkout - checkin) / (1000 * 60 * 60 * 24)));
  const pricePerNight = MIDTRANS_CONFIG.roomPrices[formData.roomType] || 350000;
  const total    = nights * pricePerNight;

  paymentState.nights = nights;
  paymentState.total  = total;

  // Update ringkasan pesanan
  document.getElementById('summaryGuest').textContent    = formData.name;
  document.getElementById('summaryRoom').textContent     = formData.roomType || 'Kamar Standar';
  document.getElementById('summaryCheckin').textContent  = formatDate(formData.checkin);
  document.getElementById('summaryCheckout').textContent = formatDate(formData.checkout);
  document.getElementById('summaryNights').textContent   = nights + ' malam';
  document.getElementById('summaryTotal').textContent    = formatRupiah(total);

  // Reset status
  const statusEl = document.getElementById('payStatus');
  if (statusEl) { statusEl.className = 'pay-status'; statusEl.textContent = ''; }

  // Buka modal
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Trap focus
  setTimeout(() => {
    const closeBtn = document.getElementById('paymentModalClose');
    if (closeBtn) closeBtn.focus();
  }, 100);
}

/* ── TUTUP MODAL PEMBAYARAN ──────────────────────────────── */
function closePaymentModal() {
  const backdrop = document.getElementById('paymentModalBackdrop');
  if (!backdrop) return;
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── PILIH METODE PEMBAYARAN ─────────────────────────────── */
function selectPaymentMethod(btn) {
  document.querySelectorAll('.payment-method-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  paymentState.method = btn.dataset.method;
}

/* ── PROSES PEMBAYARAN ───────────────────────────────────── */
async function processPayment() {
  const btn      = document.getElementById('payNowBtn');
  const statusEl = document.getElementById('payStatus');
  if (!btn || !statusEl) return;

  // Loading state
  btn.disabled    = true;
  btn.textContent = '⏳ Memproses...';

  try {
    /* ────────────────────────────────────────────────────────
       INTEGRASI BACKEND NYATA:
       Uncomment kode di bawah dan sesuaikan URL endpoint backend Anda.
       Backend (Node.js/PHP/Python) bertugas membuat transaksi ke Midtrans
       menggunakan Server Key, lalu mengembalikan snap_token.

       Contoh endpoint backend (Node.js/Express):
       POST /api/create-transaction
       Body: { orderId, grossAmount, customerDetails, itemDetails }
       Response: { token: "snap_token_dari_midtrans", orderId: "..." }
    ──────────────────────────────────────────────────────── */

    /*
    // ── CARA PAKAI BACKEND NYATA ──
    const orderId = 'FAVE-' + Date.now() + '-' + Math.random().toString(36).substr(2,6).toUpperCase();

    const response = await fetch('/api/create-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        grossAmount: paymentState.total,
        customerDetails: {
          firstName: paymentState.formData.name,
          email:     paymentState.formData.email,
        },
        itemDetails: [{
          id:    paymentState.formData.roomType,
          price: paymentState.total / paymentState.nights,
          quantity: paymentState.nights,
          name: paymentState.formData.roomType + ' - favehotel Medan',
        }],
        paymentType: paymentState.method,
      }),
    });

    const { token } = await response.json();
    launchMidtransSnap(token);
    */

    // ── MODE DEMO (tanpa backend) ──
    // Simulasi response Midtrans untuk preview / development
    runDemoPayment();

  } catch (err) {
    console.error('Payment error:', err);
    setPayStatus('error', '❌ Terjadi kesalahan. Silakan coba lagi atau hubungi resepsionis kami.');
    btn.disabled    = false;
    btn.textContent = 'Bayar Sekarang';
  }
}

/* ── LAUNCH MIDTRANS SNAP ────────────────────────────────── */
function launchMidtransSnap(snapToken) {
  const btn = document.getElementById('payNowBtn');

  // Pastikan library snap.js sudah dimuat
  if (typeof window.snap === 'undefined') {
    setPayStatus('error', '❌ Midtrans Snap belum dimuat. Pastikan script Midtrans terpasang dengan benar.');
    if (btn) { btn.disabled = false; btn.textContent = 'Bayar Sekarang'; }
    return;
  }

  window.snap.pay(snapToken, {
    onSuccess: function(result) {
      console.log('Payment success:', result);
      setPayStatus('success', '✅ Pembayaran berhasil! Order ID: ' + result.order_id + '. Terima kasih telah memesan di favehotel Medan.');
      if (btn) { btn.disabled = false; btn.textContent = 'Bayar Sekarang'; }
      // Tutup modal setelah 3 detik
      setTimeout(() => {
        closePaymentModal();
        showToast('✅ Reservasi dikonfirmasi! Kami akan mengirim detail ke email Anda.');
        const form = document.getElementById('bookingForm');
        if (form) form.reset();
      }, 3000);
    },
    onPending: function(result) {
      console.log('Payment pending:', result);
      setPayStatus('pending', '⏳ Pembayaran pending. Silakan selesaikan pembayaran sesuai instruksi yang dikirim ke email Anda.');
      if (btn) { btn.disabled = false; btn.textContent = 'Cek Status Pembayaran'; }
    },
    onError: function(result) {
      console.error('Payment error:', result);
      setPayStatus('error', '❌ Pembayaran gagal: ' + (result.status_message || 'Silakan coba lagi.'));
      if (btn) { btn.disabled = false; btn.textContent = 'Coba Lagi'; }
    },
    onClose: function() {
      console.log('Snap closed by user');
      if (btn) { btn.disabled = false; btn.textContent = 'Bayar Sekarang'; }
    },
  });
}

/* ── MODE DEMO (tanpa backend) ───────────────────────────── */
function runDemoPayment() {
  const btn      = document.getElementById('payNowBtn');
  const method   = paymentState.method;

  // Simulasi delay network
  setTimeout(() => {
    const methodLabels = {
      snap:   'Midtrans Snap',
      gopay:  'GoPay',
      bca_va: 'BCA Virtual Account',
      qris:   'QRIS',
    };

    const methodName = methodLabels[method] || 'Midtrans';
    const demoOrderId = 'DEMO-' + Date.now().toString().slice(-8);

    // Tampilkan instruksi demo sesuai metode
    let demoMsg = '';

    if (method === 'snap') {
      demoMsg = `
        <strong>🔖 Demo Mode — Midtrans Snap</strong><br/>
        Order ID: <code>${demoOrderId}</code><br/>
        Total: <strong>${formatRupiah(paymentState.total)}</strong><br/><br/>
        <em>Untuk production: hubungkan ke backend Midtrans Anda dan ganti 
        <code>YOUR_MIDTRANS_CLIENT_KEY</code> dengan Client Key asli.</em>
      `;
    } else if (method === 'gopay') {
      demoMsg = `
        <strong>🟢 Demo GoPay</strong><br/>
        QR Code akan muncul di sini (via Midtrans Snap).<br/>
        Order ID: <code>${demoOrderId}</code><br/>
        Total: <strong>${formatRupiah(paymentState.total)}</strong>
      `;
    } else if (method === 'bca_va') {
      const vaNumber = '8277' + Math.floor(Math.random() * 9000000000 + 1000000000);
      demoMsg = `
        <strong>🏦 Demo BCA Virtual Account</strong><br/>
        No. VA: <code>${vaNumber}</code><br/>
        Bayar ke: <strong>Bank BCA</strong><br/>
        Jumlah: <strong>${formatRupiah(paymentState.total)}</strong><br/>
        Berlaku: 24 jam
      `;
    } else if (method === 'qris') {
      demoMsg = `
        <strong>📱 Demo QRIS</strong><br/>
        QR Code akan tampil di sini.<br/>
        Order ID: <code>${demoOrderId}</code><br/>
        Total: <strong>${formatRupiah(paymentState.total)}</strong>
      `;
    }

    const statusEl = document.getElementById('payStatus');
    if (statusEl) {
      statusEl.className = 'pay-status pending';
      statusEl.innerHTML = demoMsg;
    }

    if (btn) {
      btn.disabled    = false;
      btn.textContent = 'Bayar Sekarang';
    }

  }, 1800);
}

/* ── SET PAY STATUS ──────────────────────────────────────── */
function setPayStatus(type, message) {
  const el = document.getElementById('payStatus');
  if (!el) return;
  el.className = 'pay-status ' + type;
  el.innerHTML = message;
}

/* ── FORMAT HELPERS ──────────────────────────────────────── */
function formatRupiah(amount) {
  return 'IDR ' + amount.toLocaleString('id-ID');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── INISIALISASI MODAL EVENTS ───────────────────────────── */
(function initPaymentModal() {
  const backdrop = document.getElementById('paymentModalBackdrop');
  const closeBtn = document.getElementById('paymentModalClose');

  // Tutup saat klik backdrop
  backdrop && backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closePaymentModal();
  });

  // Tutup saat klik tombol X
  closeBtn && closeBtn.addEventListener('click', closePaymentModal);

  // Tutup saat tekan Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
      closePaymentModal();
    }
  });
})();

/* ── OVERRIDE BOOKING FORM SUBMIT ────────────────────────── */
(function overrideBookingSubmit() {
  // Hapus event listener form lama dan ganti dengan yang membuka payment modal
  const form         = document.getElementById('bookingForm');
  const checkinDate  = document.getElementById('checkinDate');
  const checkoutDate = document.getElementById('checkoutDate');

  if (!form) return;

  // Set min date
  const today = new Date().toISOString().split('T')[0];
  if (checkinDate)  checkinDate.min  = today;
  if (checkoutDate) checkoutDate.min = today;

  // Pastikan checkout setelah checkin
  checkinDate && checkinDate.addEventListener('change', () => {
    if (checkoutDate) {
      checkoutDate.min = checkinDate.value;
      if (checkoutDate.value && checkoutDate.value <= checkinDate.value) {
        const next = new Date(checkinDate.value);
        next.setDate(next.getDate() + 1);
        checkoutDate.value = next.toISOString().split('T')[0];
      }
    }
  });

  // Override submit → buka payment modal
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput     = form.querySelector('input[type="text"]');
    const emailInput    = form.querySelector('input[type="email"]');
    const roomSelect    = form.querySelector('select:first-of-type');
    const guestSelect   = form.querySelector('select:last-of-type');

    // Validasi
    let valid = true;
    const required = form.querySelectorAll('[required]');
    required.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#ff4d6d';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });

    if (!valid) {
      showToast('⚠️ Mohon lengkapi semua data yang diperlukan.');
      return;
    }

    if (!checkinDate.value || !checkoutDate.value) {
      showToast('⚠️ Pilih tanggal check-in dan check-out terlebih dahulu.');
      return;
    }

    if (!roomSelect || !roomSelect.value) {
      showToast('⚠️ Pilih tipe kamar terlebih dahulu.');
      roomSelect && (roomSelect.style.borderColor = '#ff4d6d');
      return;
    }

    // Kumpulkan data form
    const formData = {
      name:       nameInput    ? nameInput.value.trim()  : '',
      email:      emailInput   ? emailInput.value.trim() : '',
      checkin:    checkinDate  ? checkinDate.value        : '',
      checkout:   checkoutDate ? checkoutDate.value       : '',
      roomType:   roomSelect   ? roomSelect.value         : 'Kamar Standar',
      numGuests:  guestSelect  ? guestSelect.value        : '1 Orang',
    };

    // Buka payment modal
    openPaymentModal(formData);
  });
})();