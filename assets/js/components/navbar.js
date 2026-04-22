/* ============================================================
   NAVBAR COMPONENT — Wafa Abbas Portfolio
   ============================================================ */

const Navbar = (() => {

  /* ── State ─────────────────────────────────────────────── */
  let _isOpen     = false;
  let _lastScroll = 0;

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Elements ───────────────────────────────────────────── */
  let navbar, hamburger, mobileMenu, langBtns, navLinks;

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    navbar     = $('navbar');
    hamburger  = $('hamburger');
    mobileMenu = $('mobile-menu');
    langBtns   = $$('.lang-btn');
    navLinks   = $$('.nav-link');

    if (!navbar) return;

    _bindScroll();
    _bindHamburger();
    _bindLang();
    _bindNavLinks();
    _setActiveLink();
    _restoreLang();

    console.log('[Navbar] initialized');
  }

  /* ── Scroll Handler ─────────────────────────────────────── */
  function _bindScroll() {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;

      /* Scrolled class */
      navbar.classList.toggle('scrolled', y > 40);

      /* Hide on scroll down, show on scroll up */
      if (y > _lastScroll && y > 200) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }

      _lastScroll = y <= 0 ? 0 : y;

      /* Back to top button */
      const backTop = $('back-top');
      if (backTop) {
        backTop.classList.toggle('show', y > 400);
      }
    }, { passive: true });
  }

  /* ── Hamburger ──────────────────────────────────────────── */
  function _bindHamburger() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      _isOpen = !_isOpen;
      hamburger.classList.toggle('open', _isOpen);
      mobileMenu.classList.toggle('open', _isOpen);
      document.body.style.overflow = _isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', _isOpen);
    });

    /* Close on backdrop click */
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) _closeMobile();
    });

    /* Close on ESC */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _isOpen) _closeMobile();
    });
  }

  function _closeMobile() {
    _isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', false);
  }

  /* ── Language Switch ────────────────────────────────────── */
  function _bindLang() {
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        _setLang(lang);
      });
    });
  }

  function _setLang(lang) {
    /* Update html attribute */
    document.documentElement.setAttribute('data-lang', lang);

    /* Update all buttons */
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    /* Persist */
    localStorage.setItem('wafa-lang', lang);

    /* Dispatch event for other components */
    window.dispatchEvent(new CustomEvent('langChange', { detail: { lang } }));
  }

  function _restoreLang() {
    const saved = localStorage.getItem('wafa-lang') || 'en';
    _setLang(saved);
  }

  /* ── Active Nav Link ────────────────────────────────────── */
  function _bindNavLinks() {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (_isOpen) _closeMobile();
      });
    });
  }

  function _setActiveLink() {
    const current = window.location.pathname
      .split('/')
      .pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href')
        .split('/')
        .pop();

      const isActive =
        href === current ||
        (current === '' && href === 'index.html');

      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'page');
    });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    init,
    closeMobile: _closeMobile,
    setLang:     _setLang,
  };

})();

/* ── Auto Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => Navbar.init());