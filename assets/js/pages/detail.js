/* ============================================================
   DETAIL PAGE — Wafa Abbas Portfolio
   Shared logic for: article-detail, opinion-detail, news-detail
   Handles: fetch markdown, render content, related posts, share
   ============================================================ */

const DetailPage = (() => {

  /* ── State ─────────────────────────────────────────────── */
  let _item     = null;
  let _type     = 'articles';
  let _slug     = '';
  let _all      = [];
  let _lang     = 'en';

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init(type = 'articles') {
    try {
      _type = type;
      _lang = LANG.current();
      _slug = UTILS.getParam('slug');

      if (!_slug) return Router.redirectTo404();

      _showSkeleton();
      await _loadData();
      _renderHero();
      _renderMeta();
      _renderContent();
      _renderRelated();
      _renderShare();
      _initReadingProgress();
      _initLangWatch();
      _initScrollReveal();

      console.log(`[DetailPage:${_type}] initialized`);
    } catch (err) {
      console.error('[DetailPage] error:', err);
      Router.redirectTo404();
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    const [index, content] = await Promise.all([
      FETCH.json(CONFIG.data[_type]),
      FETCH.markdown(`/assets/data/${_type}/${_slug}.md`)
    ]);

    _all  = index || [];
    _item = _all.find(i => i.slug === _slug);

    if (!_item) return Router.redirectTo404();
    _item._content = content || '';
  }

  /* ── Skeleton ───────────────────────────────────────────── */
  function _showSkeleton() {
    const hero = $('detail-hero');
    const body = $('detail-body');
    if (hero) hero.innerHTML = RENDER.skeleton(1, 'hero');
    if (body) body.innerHTML = RENDER.skeleton(3, 'text');
  }

  /* ── Render Hero ────────────────────────────────────────── */
  function _renderHero() {
    const hero = $('detail-hero');
    if (!hero || !_item) return;

    const title    = RENDER.t(_item.title, _lang);
    const date     = UTILS.formatDate(_item.date, _lang);
    const readTime = UTILS.readTime(_item._content, _lang);
    const badge    = RENDER.badge(_item.category, _type, _lang);

    hero.innerHTML = `
      <div class="detail-hero__inner">
        <div class="detail-hero__meta">
          ${badge}
          <span class="detail-hero__date">
            <i class="fa fa-calendar"></i> ${date}
          </span>
          <span class="detail-hero__read">
            <i class="fa fa-clock"></i> ${readTime}
          </span>
        </div>
        <h1 class="detail-hero__title">${title}</h1>
        <div class="detail-hero__author">
          <img
            src="${CONFIG.assets.photo}"
            alt="${CONFIG.site.shortName}"
            class="detail-hero__avatar"
          />
          <div>
            <div class="detail-hero__author-name">
              ${CONFIG.site.fullName}
            </div>
            <div class="detail-hero__author-role">
              ${CONFIG.site.title}
            </div>
          </div>
        </div>
        ${_item.image ? `
          <div class="detail-hero__cover">
            <img
              src="${_item.image}"
              alt="${title}"
              class="detail-hero__cover-img"
            />
          </div>
        ` : ''}
      </div>
    `;
  }

  /* ── Render Meta (SEO) ──────────────────────────────────── */
  function _renderMeta() {
    if (!_item) return;
    RENDER.setMeta({
      title : RENDER.t(_item.title,   _lang),
      desc  : RENDER.t(_item.excerpt, _lang),
      image : _item.image || CONFIG.assets.ogDefault,
      url   : window.location.href,
    });
  }

  /* ── Render Content ─────────────────────────────────────── */
  function _renderContent() {
    const body = $('detail-body');
    if (!body || !_item) return;

    const html = UTILS.markdownToHTML(_item._content);

    body.innerHTML = `
      <div class="prose">${html}</div>
      <div class="detail-tags">
        ${(_item.tags || []).map(tag => `
          <span class="tag">
            <i class="fa fa-tag"></i> ${tag}
          </span>
        `).join('')}
      </div>
    `;
  }

  /* ── Render Related ─────────────────────────────────────── */
  function _renderRelated() {
    const wrap = $('related-posts');
    if (!wrap || !_item) return;

    const related = _all
      .filter(i =>
        i.slug !== _slug &&
        i.category === _item.category
      )
      .slice(0, CONFIG.content.relatedCount);

    if (!related.length) {
      wrap.closest('.related-section')?.remove();
      return;
    }

    wrap.innerHTML = RENDER.cards(related, _type, _lang);
  }

  /* ── Render Share ───────────────────────────────────────── */
  function _renderShare() {
    const wrap = $('share-btns');
    if (!wrap || !_item) return;

    const url   = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(RENDER.t(_item.title, _lang));

    wrap.innerHTML = `
      <a href="https://twitter.com/intent/tweet?url=${url}&text=${title}"
         target="_blank" class="share-btn share-btn--twitter">
        <i class="fab fa-twitter"></i>
        <span>Twitter</span>
      </a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${url}"
         target="_blank" class="share-btn share-btn--linkedin">
        <i class="fab fa-linkedin-in"></i>
        <span>LinkedIn</span>
      </a>
      <a href="https://wa.me/?text=${title}%20${url}"
         target="_blank" class="share-btn share-btn--whatsapp">
        <i class="fab fa-whatsapp"></i>
        <span>WhatsApp</span>
      </a>
      <button class="share-btn share-btn--copy"
              onclick="DetailPage.copyLink()">
        <i class="fa fa-link"></i>
        <span>${_lang === 'id' ? 'Salin Link' : 'Copy Link'}</span>
      </button>
    `;
  }

  /* ── Reading Progress Bar ───────────────────────────────── */
  function _initReadingProgress() {
    const bar = $('reading-progress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const doc    = document.documentElement;
      const total  = doc.scrollHeight - doc.clientHeight;
      const current = window.scrollY;
      const pct    = total ? Math.round((current / total) * 100) : 0;
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  /* ── Language Watch ─────────────────────────────────────── */
  function _initLangWatch() {
    document.addEventListener('langChange', (e) => {
      _lang = e.detail.lang;
      _renderHero();
      _renderMeta();
      _renderContent();
      _renderRelated();
    });
  }

  /* ── Copy Link ──────────────────────────────────────────── */
  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const btn = document.querySelector('.share-btn--copy span');
      if (btn) {
        btn.textContent = _lang === 'id' ? 'Tersalin!' : 'Copied!';
        setTimeout(() => {
          btn.textContent = _lang === 'id' ? 'Salin Link' : 'Copy Link';
        }, 2000);
      }
    });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    init,
    copyLink,
  };

})();