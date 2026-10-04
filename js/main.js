/**
 * ORBERYX — Deep Space Interactive Engine
 * "Da curiosidade de uma criança às fronteiras do espaço"
 */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initScrollEffects();
  initMobileNav();
  initAstroTelemetry();
});

/* ==========================================================================
   1. Interactive Starfield Canvas (Subtle, Contemplative Astronomy)
   ========================================================================== */
function initStarfield() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Star generation parameters
  const starCount = Math.min(Math.floor((width * height) / 7500), 220);
  const stars = [];

  const starColors = [
    'rgba(255, 255, 255, ',    // Pure white
    'rgba(229, 185, 116, ',    // Stellar Amber/Gold
    'rgba(175, 205, 240, ',    // Soft Blue
    'rgba(240, 244, 255, '     // Warm White
  ];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.35 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
      vx: (Math.random() - 0.5) * 0.06,
      vy: (Math.random() - 0.5) * 0.06
    });
  }

  // Mouse subtle parallax
  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = mouseX;
  let targetMouseY = mouseY;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    const offsetX = (mouseX - width / 2) * 0.015;
    const offsetY = (mouseY - height / 2) * 0.015;

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      if (!isReducedMotion) {
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }

      const drawX = star.x + offsetX * (star.radius * 0.7);
      const drawY = star.y + offsetY * (star.radius * 0.7);

      ctx.beginPath();
      ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = star.colorPrefix + Math.max(0.1, Math.min(1, star.alpha)) + ')';
      ctx.fill();

      // Occasional faint halo for larger stellar bodies
      if (star.radius > 1.2 && star.alpha > 0.6) {
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = star.colorPrefix + (star.alpha * 0.12) + ')';
        ctx.fill();
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  // Handle visibility state for power saving
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      render();
    }
  });

  render();
}

/* ==========================================================================
   2. Scroll Dynamics & Intersection Observer
   ========================================================================== */
function initScrollEffects() {
  const headerWrapper = document.querySelector('.header-nav-wrapper');
  
  // Navbar state on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      headerWrapper?.classList.add('scrolled');
    } else {
      headerWrapper?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Staggered reveals for cards and sections
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer a');

  if (!toggleBtn || !drawer) return;

  function toggleMenu() {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', toggleMenu);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   4. AstroWatch Telemetry Counter & Dynamic Data
   ========================================================================== */
function initAstroTelemetry() {
  const distEl = document.getElementById('telemetry-distance');
  const velEl = document.getElementById('telemetry-velocity');

  if (!distEl || !velEl) return;

  // Real-time subtle fluctuation of cosmic metrics to represent active tracking
  let distance = 4.28;
  let velocity = 24.62;

  setInterval(() => {
    const dDelta = (Math.random() - 0.49) * 0.01;
    const vDelta = (Math.random() - 0.5) * 0.02;

    distance = Math.max(3.8, Math.min(5.2, distance + dDelta));
    velocity = Math.max(22.0, Math.min(27.0, velocity + vDelta));

    distEl.textContent = distance.toFixed(2) + ' M km';
    velEl.textContent = velocity.toFixed(2) + ' km/s';
  }, 3200);
}
