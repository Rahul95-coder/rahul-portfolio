/* Common interactions for the single-page portfolio
   - Mobile nav toggle
   - Typewriter effect
   - Theme cycle (Auto -> Dark -> Light -> Auto)
   - Smooth scroll for anchor links
   - Contact form demo validation
   - Back-to-top visibility
   - Small reveal animations
*/

(function () {
  // Utilities
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  const mobileBtn = $('#mobile-btn');
  const mobileMenu = $('#mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        mobileMenu?.classList.add('hidden');
      }
    });
  });

  // Typewriter phrases
  const phrases = ['Web Developer', 'Problem Solver', 'Learner'];
  let pIndex = 0;
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    function typeloop() {
      const text = phrases[pIndex];
      let i = 0;
      twEl.textContent = '';
      const t = setInterval(() => {
        twEl.textContent += text[i++] || '';
        if (i > text.length) {
          clearInterval(t);
          setTimeout(() => {
            // erase
            let j = text.length;
            const er = setInterval(() => {
              twEl.textContent = text.slice(0, --j);
              if (j === 0) {
                clearInterval(er);
                pIndex = (pIndex + 1) % phrases.length;
                setTimeout(typeloop, 200);
              }
            }, 40);
          }, 900);
        }
      }, 70);
    }
    typeloop();
  }

  // Theme handling
  const themeBtn = $('#theme-toggle');
  function applyAuto() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (themeBtn) themeBtn.textContent = 'Auto';
    localStorage.removeItem('theme');
  }
  function applyDark() { document.documentElement.classList.add('dark'); if (themeBtn) themeBtn.textContent = 'Dark'; localStorage.setItem('theme', 'dark'); }
  function applyLight() { document.documentElement.classList.remove('dark'); if (themeBtn) themeBtn.textContent = 'Light'; localStorage.setItem('theme', 'light'); }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') applyDark();
  else if (savedTheme === 'light') applyLight();
  else applyAuto();

  if (themeBtn) themeBtn.addEventListener('click', () => {
    const state = localStorage.getItem('theme');
    if (!state) applyDark();
    else if (state === 'dark') applyLight();
    else applyAuto();
  });

  // Respond to OS theme changes when in Auto
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (!localStorage.getItem('theme')) applyAuto();
    });
  }

  // Contact form demo
  const form = $('#contact-form');
  if (form) {
    const nameEl = $('#c-name');
    const emailEl = $('#c-email');
    const msgEl = $('#c-message');
    const btn = $('#send-btn');
    const status = $('#contact-status');

    btn.addEventListener('click', () => {
      status.textContent = '';
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const msg = msgEl.value.trim();
      if (!name || !email || !msg) {
        status.textContent = 'Please fill all fields.';
        return;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) {
        status.textContent = 'Enter a valid email.';
        return;
      }
      status.textContent = 'Message ready to send (demo).';
      btn.textContent = 'Sent ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send';
        btn.disabled = false;
        form.reset();
        status.textContent = '';
      }, 1600);
    });
  }

  // Back-to-top visibility
  const backTop = $('#back-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) backTop.classList.remove('hidden'); else backTop.classList.add('hidden');
  });
  backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Small reveal animations on scroll (simple)
  const revealEls = $$('section, .group, .bg-white\\/5');
  function revealOnScroll() {
    const trigger = window.innerHeight * 0.9;
    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < trigger) el.classList.add('opacity-100', 'translate-y-0'); else el.classList.remove('opacity-100', 'translate-y-0');
    });
  }
  // Initial styles
  revealEls.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-500');
  });
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('resize', revealOnScroll);

  // tiny skill bar entrance animation
  setTimeout(() => { const bar = document.getElementById('skill-anim'); if (bar) bar.style.width = '66%'; }, 600);

  // small hover subtle effect for project cards (already handled by Tailwind classes)
})();
