/* ============================================================
   FOOTER COMPONENT — Wafa Abbas Portfolio
   Handles: load, current year, social links
   ============================================================ */

const Footer = (() => {

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    _renderYear();
    _renderSocials();
    _bindLangUpdate();
    console.log('[Footer] initialized');
  }

  /* ── Render Year ────────────────────────────────────────── */
  function _renderYear() {
    const yearEl = $$('.footer-year');
    const year   = new Date().getFullYear();
    yearEl.forEach(el => el.textContent = year);
  }

  /* ── Render Socials ─────────────────────────────────────── */
  function _renderSocials() {
    const wrap = $('footer-socials');
    if (!wrap) return;

    const socials = [
      {
        href:  CONFIG.social.email,
        icon:  'fa fa-envelope',
        label: 'Email',
        type:  'email'
      },
      {
        href:  CONFIG.social.whatsapp,
        icon:  'fa fa-phone',
        label: 'WhatsApp',
        type:  'external'
      },
      {
        href:  CONFIG.social.linkedin,
        icon:  'fab fa-linkedin-in',
        label: 'LinkedIn',
        type:  'external'
      },
    ];

    wrap.innerHTML = socials.map(s => `
      <a
        href="${s.type === 'email' ? 'mailto:' + s.href : s.href}"
        class="footer__social-link"
        aria-label="${s.label}"
        ${s.type === 'external' ? 'target="_blank" rel="noopener noreferrer"' : ''}
      >
        <i class="${s.icon}"></i>
      </a>
    `).join('');
  }

  /* ── Bind Lang Update ───────────────────────────────────── */
  function _bindLangUpdate() {
    document.addEventListener('langChange', (e) => {
      _updateLang(e.detail.lang);
    });
    _updateLang(Lang.get());
  }

  /* ── Update Lang ────────────────────────────────────────── */
  function _updateLang(lang) {
    const copyEl = $('footer-copy');
    if (!copyEl) return;

    const name = CONFIG.site.fullName;
    const year = new Date().getFullYear();

    copyEl.textContent = lang === 'id'
      ? `© ${year} ${name}. Hak cipta dilindungi.`
      : `© ${year} ${name}. All rights reserved.`;
  }

  /* ── Render Full Footer ─────────────────────────────────── */
  function render(containerId = 'footer-root') {
    const container = $(containerId);
    if (!container) return;

    container.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer__inner">

            <!-- Logo -->
            <div class="footer__logo">
              Wafa <span>Abbas</span>
            </div>

            <!-- Copy -->
            <p class="footer__copy" id="footer-copy"></p>

            <!-- Socials -->
            <div class="footer__socials" id="footer-socials"></div>

          </div>
        </div>
      </footer>
    `;

    init();
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init, render };

})();

/* ── Auto Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('footer-root')) {
    Footer.render('footer-root');
  } else {
    Footer.init();
  }
});