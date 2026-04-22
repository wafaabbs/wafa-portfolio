/* ============================================================
   HOME PAGE — Wafa Abbas Portfolio
   Handles: hero, stats, featured sections, scroll animations
   ============================================================ */

const HomePage = (() => {

  /* ── State ──────────────────────────────────────────────── */
  let _profile  = null;
  let _articles = [];
  let _opinions = [];
  let _news     = [];

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init() {
    try {
      await _loadData();
      _renderHero();
      _renderStats();
      _renderFeaturedArticles();
      _renderFeaturedOpinions();
      _renderFeaturedNews();
      _initScrollReveal();
      _initSkillBars();
      console.log('[HomePage] initialized');
    } catch (err) {
      console.error('[HomePage]', err);
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    const [profile, articles, opinions, news] = await Promise.all([
      Fetch.json(CONFIG.data.profile),
      Fetch.json(CONFIG.data.articles),
      Fetch.json(CONFIG.data.opinions),
      Fetch.json(CONFIG.data.news),
    ]);

    _profile  = profile;
    _articles = articles.items || [];
    _opinions = opinions.items || [];
    _news     = news.items     || [];
  }

  /* ── Render Hero ────────────────────────────────────────── */
  function _renderHero() {
    if (!_profile) return;
    const lang = Utils.getLang();
    const p    = _profile;

    /* Name */
    const nameEl = $('hero-name');
    if (nameEl) nameEl.innerHTML = `
      ${p.meta.name}
      <span class="highlight">${p.meta.suffix}</span>
    `;

    /* Title */
    const titleEl = $('hero-title');
    if (titleEl) titleEl.textContent =
      lang === 'id' ? p.meta.title.id : p.meta.title.en;

    /* Description */
    const descEl = $('hero-desc');
    if (descEl) descEl.textContent =
      lang === 'id' ? p.meta.tagline.id : p.meta.tagline.en;

    /* Photo */
    const photoEl = $('hero-photo');
    if (photoEl) {
      photoEl.src = CONFIG.assets.photo;
      photoEl.alt = p.meta.name;
    }

    /* CV Button */
    const cvBtn = $('hero-cv-btn');
    if (cvBtn) cvBtn.href = CONFIG.assets.cv;
  }

  /* ── Render Stats ───────────────────────────────────────── */
  function _renderStats() {
    if (!_profile?.stats) return;

    _profile.stats.forEach(stat => {
      const el = $(`stat-${stat.id}`);
      if (!el) return;
      el.innerHTML = `
        <div class="stat__number">
          ${stat.value}<span>${stat.suffix || ''}</span>
        </div>
        <div class="stat__label lang-en">${stat.labelEn}</div>
        <div class="stat__label lang-id">${stat.labelId}</div>
      `;
    });
  }

  /* ── Render Featured Articles ───────────────────────────── */
  function _renderFeaturedArticles() {
    const wrap = $('featured-articles');
    if (!wrap) return;

    const featured = _articles
      .filter(a => a.featured)
      .slice(0, CONFIG.content?.featuredCount || 3);

    if (!featured.length) {
      wrap.innerHTML = _emptyState('articles');
      return;
    }

    wrap.innerHTML = featured
      .map(item => Card.render(item, 'article'))
      .join('');
  }

  /* ── Render Featured Opinions ───────────────────────────── */
  function _renderFeaturedOpinions() {
    const wrap = $('featured-opinions');
    if (!wrap) return;

    const featured = _opinions
      .filter(o => o.featured)
      .slice(0, CONFIG.content?.featuredCount || 3);

    if (!featured.length) {
      wrap.innerHTML = _emptyState('opinions');
      return;
    }

    wrap.innerHTML = featured
      .map(item => Card.render(item, 'opinion'))
      .join('');
  }

  /* ── Render Featured News ───────────────────────────────── */
  function _renderFeaturedNews() {
    const wrap = $('featured-news');
    if (!wrap) return;

    const featured = _news
      .filter(n => n.featured)
      .slice(0, CONFIG.content?.featuredCount || 3);

    if (!featured.length) {
      wrap.innerHTML = _emptyState('news');
      return;
    }

    wrap.innerHTML = featured
      .map(item => Card.render(item, 'news'))
      .join('');
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const els = $$('.reveal, .reveal-left, .reveal-right');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  /* ── Skill Bars ─────────────────────────────────────────── */
  function _initSkillBars() {
    const section = $('skills');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar__fill')
            .forEach(fill => {
              const pct = fill.dataset.pct;
              setTimeout(() => {
                fill.style.width = pct + '%';
              }, 200);
            });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ── Empty State ────────────────────────────────────────── */
  function _emptyState(type) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">
          <i class="fa fa-${type === 'articles' ? 'newspaper'
                          : type === 'opinions' ? 'comment-dots'
                          : 'bullhorn'}"></i>
        </div>
        <p class="empty-state__text lang-en">No ${type} yet</p>
        <p class="empty-state__text lang-id">Belum ada ${
          type === 'articles' ? 'artikel'
        : type === 'opinions' ? 'opini'
        : 'berita'
        }</p>
      </div>
    `;
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => HomePage.init());