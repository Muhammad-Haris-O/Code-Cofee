/* ==========================================================================
   CODE-COFFEE — script.js
   Handles: preloader, navbar, mobile menu, custom cursor, hero particles,
   menu rendering + filtering, stat counters, scroll reveal, countdown timer,
   3D hero cup + showcase (Three.js with CSS fallback), gallery lightbox,
   contact form validation.
   ========================================================================== */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     1. PRELOADER
     ------------------------------------------------------------------ */
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });

  /* ------------------------------------------------------------------
     2. NAVBAR — scroll background + active link + mobile menu
     ------------------------------------------------------------------ */
  const mainNav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinkEls = document.querySelectorAll('.nav-link');
  const mobileLinkEls = document.querySelectorAll('.mobile-link');

  function onScrollNav() {
    if (window.scrollY > 40) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  [...mobileLinkEls].forEach((link) => {
    if (!link.classList.contains('btn-order')) {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Active nav link on scroll (Intersection Observer)
  const sections = document.querySelectorAll('main > section[id]');
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinkEls.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((s) => navObserver.observe(s));

  /* ------------------------------------------------------------------
     3. CUSTOM CURSOR (desktop only)
     ------------------------------------------------------------------ */
  const cursor = document.getElementById('customCursor');
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (isFinePointer && !prefersReducedMotion) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const growTargets = document.querySelectorAll(
      'a, button, .menu-card, .gallery-item, .why-card, .review-card, input, textarea'
    );
    growTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
    });
  }

  /* ------------------------------------------------------------------
     4. HERO BACKGROUND PARTICLES (floating coffee-bean-colored dots)
     ------------------------------------------------------------------ */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles && !prefersReducedMotion) {
    const count = window.innerWidth < 768 ? 14 : 26;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const size = 3 + Math.random() * 6;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${60 + Math.random() * 40}%`;
      p.style.animationDuration = `${10 + Math.random() * 14}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      heroParticles.appendChild(p);
    }
  }

  /* ------------------------------------------------------------------
     5. SCROLL REVEAL — Intersection Observer
     ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     6. ANIMATED STAT COUNTERS (About section)
     ------------------------------------------------------------------ */
  const statCards = document.querySelectorAll('.stat-card[data-count]');
  function animateCount(card) {
    const target = parseInt(card.getAttribute('data-count'), 10);
    const suffix = card.getAttribute('data-suffix') || '';
    const numEl = card.querySelector('.stat-number');
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      numEl.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statCards.forEach((c) => statObserver.observe(c));

  /* ------------------------------------------------------------------
     7. COFFEE MENU DATA + RENDER + FILTER
     ------------------------------------------------------------------ */
  const MENU_ITEMS = [
    {
      name: 'Espresso',
      category: 'espresso',
      desc: 'A bold, concentrated shot of pure roasted coffee.',
      price: '₹129',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Cappuccino',
      category: 'cappuccino',
      desc: 'Equal parts espresso, steamed milk and silky foam.',
      price: '₹179',
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Café Latte',
      category: 'latte',
      desc: 'Smooth espresso layered with steamed milk and a whisper of foam.',
      price: '₹189',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Mocha',
      category: 'specialty',
      desc: 'Espresso, steamed milk and rich chocolate, topped with cream.',
      price: '₹209',
      rating: 4.8,
      img: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Americano',
      category: 'espresso',
      desc: 'Espresso diluted with hot water for a lighter, smooth cup.',
      price: '₹149',
      rating: 4.6,
      img: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Caramel Macchiato',
      category: 'latte',
      desc: 'Vanilla-kissed espresso marked with caramel drizzle.',
      price: '₹219',
      rating: 4.9,
      img: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Cold Brew',
      category: 'cold',
      desc: 'Slow-steeped for 18 hours, smooth and naturally sweet.',
      price: '₹199',
      rating: 4.7,
      img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=500&auto=format&fit=crop',
    },
    {
      name: 'Signature Code Coffee',
      category: 'specialty',
      desc: 'Rich espresso blended with smooth caramel and premium roasted beans.',
      price: '₹249',
      rating: 5.0,
      img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500&auto=format&fit=crop',
    },
  ];

  const menuGrid = document.getElementById('menuGrid');
  const toastMsg = document.getElementById('toastMsg');
  let toastTimer = null;

  function showToast(text) {
    toastMsg.textContent = text;
    toastMsg.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastMsg.classList.remove('show'), 2200);
  }

  function starString(rating) {
    const full = Math.round(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }

  function renderMenu() {
    const frag = document.createDocumentFragment();
    MENU_ITEMS.forEach((item, idx) => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.dataset.category = item.category;
      card.setAttribute('data-reveal', 'up');
      card.innerHTML = `
        <div class="menu-card-img-wrap">
          <img class="menu-card-img" src="${item.img}" alt="${item.name}" loading="lazy">
        </div>
        <div class="menu-card-body">
          <div class="menu-card-top">
            <h3 class="menu-card-name">${item.name}</h3>
            <span class="menu-card-price">${item.price}</span>
          </div>
          <p class="menu-card-desc">${item.desc}</p>
          <span class="menu-card-rating">${starString(item.rating)} <span style="color:var(--cream-dim)">(${item.rating})</span></span>
          <button type="button" class="menu-card-btn" data-name="${item.name}">Add to Order</button>
        </div>
      `;
      frag.appendChild(card);
    });
    menuGrid.appendChild(frag);

    // Observe newly-added reveal elements
    menuGrid.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

    // Add-to-order buttons
    menuGrid.querySelectorAll('.menu-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => showToast(`${btn.dataset.name} added to your order ☕`));
    });
  }
  renderMenu();

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.menu-card').forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !show);
      });
    });
  });

  /* ------------------------------------------------------------------
     8. COUNTDOWN TIMER (Special Offer)
     ------------------------------------------------------------------ */
  const cdHours = document.getElementById('cd-hours');
  const cdMinutes = document.getElementById('cd-minutes');
  const cdSeconds = document.getElementById('cd-seconds');

  // Countdown resets to a fresh 24-hour window from first page load,
  // then re-loops, so the offer always appears "live".
  let offerEndTime = Date.now() + 24 * 60 * 60 * 1000;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tickCountdown() {
    let remaining = offerEndTime - Date.now();
    if (remaining <= 0) {
      offerEndTime = Date.now() + 24 * 60 * 60 * 1000;
      remaining = offerEndTime - Date.now();
    }
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (cdHours) cdHours.textContent = pad(hours);
    if (cdMinutes) cdMinutes.textContent = pad(minutes);
    if (cdSeconds) cdSeconds.textContent = pad(seconds);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  const claimOfferBtn = document.getElementById('claimOfferBtn');
  if (claimOfferBtn) {
    claimOfferBtn.addEventListener('click', () => {
      showToast('Offer claimed! Show this at checkout ☕');
    });
  }

  /* ------------------------------------------------------------------
     9. GALLERY LIGHTBOX
     ------------------------------------------------------------------ */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const full = item.getAttribute('data-full');
      const alt = item.querySelector('img').getAttribute('alt');
      lightboxImg.src = full;
      lightboxImg.alt = alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });

  /* ------------------------------------------------------------------
     10. CONTACT FORM VALIDATION (no backend — simulated success)
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setFieldError(inputId, message) {
    const row = document.getElementById(inputId).closest('.form-row');
    const errorEl = document.getElementById(`err-${inputId}`);
    if (message) {
      row.classList.add('invalid');
      errorEl.textContent = message;
    } else {
      row.classList.remove('invalid');
      errorEl.textContent = '';
    }
  }

  function validateContactForm() {
    let valid = true;

    const name = document.getElementById('fullName').value.trim();
    if (name.length < 2) {
      setFieldError('fullName', 'Please enter your full name.');
      valid = false;
    } else {
      setFieldError('fullName', '');
    }

    const email = document.getElementById('emailField').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setFieldError('emailField', 'Please enter a valid email address.');
      valid = false;
    } else {
      setFieldError('emailField', '');
    }

    const phone = document.getElementById('phoneField').value.trim();
    const phonePattern = /^[0-9+\-\s()]{7,15}$/;
    if (!phonePattern.test(phone)) {
      setFieldError('phoneField', 'Please enter a valid phone number.');
      valid = false;
    } else {
      setFieldError('phoneField', '');
    }

    const message = document.getElementById('messageField').value.trim();
    if (message.length < 10) {
      setFieldError('messageField', 'Message should be at least 10 characters.');
      valid = false;
    } else {
      setFieldError('messageField', '');
    }

    return valid;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateContactForm()) {
        formSuccess.hidden = false;
        contactForm.reset();
        setTimeout(() => { formSuccess.hidden = true; }, 5000);
      } else {
        formSuccess.hidden = true;
      }
    });
  }

  /* ------------------------------------------------------------------
     11. THREE.JS 3D SCENES (hero cup + showcase) with CSS fallback
     ------------------------------------------------------------------ */
  const canUseThree = typeof THREE !== 'undefined' && !prefersReducedMotion;
  const isSmallScreen = window.innerWidth < 640;

  function showFallbackCup() {
    const fallback = document.getElementById('fallbackCup');
    if (fallback) fallback.classList.add('show');
  }

  if (!canUseThree) {
    showFallbackCup();
  } else {
    try {
      initHeroScene();
      initShowcaseScene();
    } catch (err) {
      console.warn('3D scene failed to initialize, using fallback.', err);
      showFallbackCup();
    }
  }

  // ---- Shared: build a simple stylized "coffee cup" group ----
  function buildCoffeeCup(THREE) {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x3e2517,
      roughness: 0.4,
      metalness: 0.15,
    });
    const coffeeMat = new THREE.MeshStandardMaterial({
      color: 0x6b4226,
      roughness: 0.25,
      metalness: 0.1,
      emissive: 0x2a1810,
      emissiveIntensity: 0.2,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe3b26c,
      roughness: 0.3,
      metalness: 0.6,
    });

    // Cup body (cylinder, slightly tapered)
    const bodyGeo = new THREE.CylinderGeometry(1.05, 0.85, 1.6, 40, 1, true);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    // Coffee surface
    const coffeeGeo = new THREE.CircleGeometry(1.0, 40);
    const coffee = new THREE.Mesh(coffeeGeo, coffeeMat);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.8;
    group.add(coffee);

    // Rim ring
    const rimGeo = new THREE.TorusGeometry(1.05, 0.05, 16, 48);
    const rim = new THREE.Mesh(rimGeo, goldMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.8;
    group.add(rim);

    // Handle
    const handleGeo = new THREE.TorusGeometry(0.45, 0.11, 16, 32, Math.PI * 1.5);
    const handle = new THREE.Mesh(handleGeo, bodyMat);
    handle.position.set(1.15, 0.1, 0);
    handle.rotation.z = Math.PI / 2;
    handle.rotation.y = Math.PI / 2;
    group.add(handle);

    // Saucer
    const saucerGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.08, 48);
    const saucer = new THREE.Mesh(saucerGeo, bodyMat);
    saucer.position.y = -0.85;
    group.add(saucer);

    // Floating beans (small ellipsoids)
    const beanMat = new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.5 });
    const beans = [];
    for (let i = 0; i < 6; i++) {
      const beanGeo = new THREE.SphereGeometry(0.14, 12, 12);
      beanGeo.scale(1, 0.7, 0.55);
      const bean = new THREE.Mesh(beanGeo, beanMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.3 + Math.random() * 0.6;
      bean.position.set(
        Math.cos(angle) * radius,
        Math.sin(i * 1.7) * 0.9,
        Math.sin(angle) * radius
      );
      bean.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      beans.push(bean);
      group.add(bean);
    }

    return { group, beans };
  }

  function initHeroScene() {
    const wrap = document.getElementById('heroCanvasWrap');
    const canvas = document.getElementById('heroCanvas');
    if (!wrap || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0.4, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    scene.add(new THREE.AmbientLight(0xfff1dd, 0.55));
    const keyLight = new THREE.DirectionalLight(0xe3b26c, 1.2);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xc88a3e, 1.4, 10);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    const { group: cup, beans } = buildCoffeeCup(THREE);
    cup.scale.setScalar(isSmallScreen ? 0.85 : 1);
    scene.add(cup);

    let targetRotX = 0;
    let targetRotY = 0;

    wrap.addEventListener('pointermove', (e) => {
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.6;
      targetRotX = ny * 0.3;
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      cup.rotation.y += (targetRotY + t * 0.15 - cup.rotation.y) * 0.04;
      cup.rotation.x += (targetRotX - cup.rotation.x) * 0.04;
      cup.position.y = Math.sin(t * 0.8) * 0.15;

      beans.forEach((bean, i) => {
        bean.position.y += Math.sin(t * 1.2 + i) * 0.0015;
        bean.rotation.x += 0.004;
        bean.rotation.y += 0.003;
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function initShowcaseScene() {
    const wrap = document.getElementById('showcaseCanvasWrap');
    const canvas = document.getElementById('showcaseCanvas');
    if (!wrap || !canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, wrap.clientWidth / wrap.clientHeight, 0.1, 100);
    camera.position.set(0, 0.6, 7);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);

    scene.add(new THREE.AmbientLight(0xfff1dd, 0.5));
    const key = new THREE.DirectionalLight(0xe3b26c, 1.3);
    key.position.set(-3, 4, 5);
    scene.add(key);
    const fill = new THREE.PointLight(0xc88a3e, 1.2, 12);
    fill.position.set(4, -2, 2);
    scene.add(fill);

    const { group: cup, beans } = buildCoffeeCup(THREE);
    cup.scale.setScalar(isSmallScreen ? 1.1 : 1.4);
    scene.add(cup);

    let targetRotY = 0;
    let targetRotX = 0;
    let autoRotate = true;

    wrap.addEventListener('pointermove', (e) => {
      autoRotate = false;
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * Math.PI * 0.7;
      targetRotX = ny * 0.4;
    });
    wrap.addEventListener('pointerleave', () => { autoRotate = true; });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (autoRotate) targetRotY = t * 0.3;
      cup.rotation.y += (targetRotY - cup.rotation.y) * 0.05;
      cup.rotation.x += (targetRotX - cup.rotation.x) * 0.05;
      cup.position.y = Math.sin(t * 0.7) * 0.18;

      beans.forEach((bean, i) => {
        bean.position.y += Math.sin(t * 1.1 + i) * 0.0015;
        bean.rotation.x += 0.003;
      });

      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const w = wrap.clientWidth, h = wrap.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

})();
