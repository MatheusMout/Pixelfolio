/* ----------------------------------------------------------------
   3. BANCO DE DADOS (FIREBASE) E GALERIA
   ---------------------------------------------------------------- */

const firebaseConfig = {
  apiKey: "AIzaSyDpS_YeMM_jAKRYw3CoHVHmc8tLrHrWS7o",
  authDomain: "pixelfolio-3cf2b.firebaseapp.com",
  projectId: "pixelfolio-3cf2b",
  storageBucket: "pixelfolio-3cf2b.firebasestorage.app",
  messagingSenderId: "1097372207282",
  appId: "1:1097372207282:web:2ee2ec1d71a4e6274161ab"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// (A partir daqui continua a função carregarArtes que já tinhas copiado...)
/* ================================================================
   PIXELFOLIO — script.js
   Toda a lógica interativa do site.
   ================================================================ */

/* ----------------------------------------------------------------
   1. ANO NO RODAPÉ
   ---------------------------------------------------------------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ----------------------------------------------------------------
   2. PIXELS FLUTUANTES — fundo decorativo da seção Hero
   ---------------------------------------------------------------- */
(function spawnFloatingPixels() {
  const container = document.getElementById('heroPixels');
  if (!container) return;

  const COLORS = ['#aef2f2', '#fef5a0', '#c8bfea', '#ffc8d8', '#ffaac8', '#b8eeff'];
  const TOTAL  = 40;

  for (let i = 0; i < TOTAL; i++) {
    const px = document.createElement('span');
    px.classList.add('floating-pixel');
    px.style.setProperty('--x',        Math.random() * 100 + '%');
    px.style.setProperty('--delay',    Math.random() * 8 + 's');
    px.style.setProperty('--duration', (4 + Math.random() * 6) + 's');
    px.style.setProperty('--color',    COLORS[Math.floor(Math.random() * COLORS.length)]);
    px.style.setProperty('--size',     (4 + Math.floor(Math.random() * 3) * 4) + 'px');
    container.appendChild(px);
  }
}());

/* ----------------------------------------------------------------
   3. GALERIA COM ABAS — slideshow por categoria
   ---------------------------------------------------------------- */
(function initGallery() {
  const tabs       = document.querySelectorAll('.tab-btn');
  const allItems   = document.querySelectorAll('.gallery__item');
  const counter    = document.getElementById('galleryCounter');
  const dotsWrap   = document.getElementById('galleryDots');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');

  if (!counter || !dotsWrap || !prevBtn || !nextBtn) return;

  const AUTOPLAY_MS  = 5000;
  let   activeCategory = 'pixel';
  let   activeIndex    = 0;
  let   autoplayTimer;

  function getActiveItems() {
    return [...allItems].filter(el => el.dataset.category === activeCategory);
  }

  function buildDots(items) {
    dotsWrap.innerHTML = '';
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className   = 'dot' + (i === activeIndex ? ' dot--active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(idx) {
    const items = getActiveItems();
    if (!items.length) return;

    allItems.forEach(el => el.classList.remove('gallery__item--active'));

    activeIndex = (idx + items.length) % items.length;
    items[activeIndex].classList.add('gallery__item--active');

    counter.textContent =
      String(activeIndex + 1).padStart(2, '0') + ' / ' +
      String(items.length).padStart(2, '0');

    buildDots(items);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(activeIndex + 1), AUTOPLAY_MS);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('tab-btn--active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('tab-btn--active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.dataset.category;
      activeIndex    = 0;
      goTo(0);
      resetAutoplay();
    });
  });

  prevBtn.addEventListener('click', () => { goTo(activeIndex - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(activeIndex + 1); resetAutoplay(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goTo(activeIndex - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(activeIndex + 1); resetAutoplay(); }
  });

  goTo(0);
  resetAutoplay();
}());

/* ----------------------------------------------------------------
   4. BARRAS DE SKILL — animação por IntersectionObserver
   ---------------------------------------------------------------- */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('skill-fill--animate');
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
}());
/* ----------------------------------------------------------------
   CURSOR ESTRELA PIXEL
   ---------------------------------------------------------------- */
(function initCursor() {
  const cursor     = document.getElementById('starCursor');
  const sparkleBox = document.getElementById('cursorSparkle');
  if (!cursor || !sparkleBox) return;

  const INTERACTIVE = 'a, button, input, textarea, label, .skill-card';
  const SPARKLE_COLORS = ['#FFE566', '#FFD700', '#fff0a0', '#ffaac8', '#c8bfea'];

  let mouseX  = -200;
  let mouseY  = -200;
  let isHover = false;

  (function loop() {
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
    requestAnimationFrame(loop);
  }());

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const el   = document.elementFromPoint(e.clientX, e.clientY);
    const over = el && el.closest(INTERACTIVE);

    if (over && !isHover) {
      isHover = true;
      cursor.classList.add('star-cursor--hover');
      spawnSparkles();
    } else if (!over && isHover) {
      isHover = false;
      cursor.classList.remove('star-cursor--hover');
    }
  });

  document.addEventListener('mousedown', () => cursor.classList.add('star-cursor--click'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('star-cursor--click'));

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

  function spawnSparkles() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const p     = document.createElement('span');
        p.className = 'sparkle-particle';

        const angle = Math.random() * 360;
        const dist  = 18 + Math.random() * 22;

        p.style.setProperty('--dx', Math.cos(angle * Math.PI / 180) * dist + 'px');
        p.style.setProperty('--dy', Math.sin(angle * Math.PI / 180) * dist + 'px');
        p.style.background = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        p.style.width      = (3 + Math.floor(Math.random() * 2) * 3) + 'px';
        p.style.height     = p.style.width;

        sparkleBox.appendChild(p);
        setTimeout(() => p.remove(), 500);
      }, i * 40);
    }
  }
}());

/* ----------------------------------------------------------------
   5. FORMULÁRIO DE CONTATO — feedback visual após envio
   ---------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const feedback = document.getElementById('formFeedback');
    feedback.textContent = '✔ MENSAGEM ENVIADA! OBRIGADA.';
    feedback.style.color = '#8a6a9a';

    form.reset();
    setTimeout(() => { feedback.textContent = ''; }, 5000);
  });
}());