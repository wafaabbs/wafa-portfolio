/* ============================================================
   CARD COMPONENT — Wafa Abbas Portfolio
   Handles: render article/opinion/news cards
   ============================================================ */

const Card = (() => {

  /* ── Helpers ────────────────────────────────────────────── */
  const _lang = () => document.documentElement.getAttribute('data-lang') || 'en';

  /* ── Main Render ────────────────────────────────────────── */
  function render(item, type = 'article') {
    switch (type) {
      case 'article': return _renderArticle(item);
      case 'opinion': return _renderOpinion(item);
      case 'news':    return _renderNews(item);
      default:        return _renderArticle(item);
    }
  }

  /* ── Article Card ───────────────────────────────────────── */
  function _renderArticle(item) {
    const lang     = _lang();
    const title    = lang === 'id' ? (item.titleId || item.titleEn) : item.titleEn;
    const excerpt  = lang === 'id' ? (item.excerptId || item.excerptEn) : item.excerptEn;
    const category = lang === 'id' ? (item.categoryId || item.categoryEn) : item.categoryEn;
    const date     = _formatDate(item.date, lang);
    const readTime = _readTime(item.content || excerpt);

    return `
      <article class="card card--article" data-slug="${item.slug}">

        <!-- Thumbnail -->
        <div class="card__thumb">
          <img
            src="${item.thumbnail || '/assets/img/og/og-default.jpg'}"
            alt="${title}"
            loading="lazy"
            onerror="this.src='/assets/img/og/og-default.jpg'"
          />
          <span class="badge badge--${item.categorySlug || 'default'}">
            ${category}
          </span>
        </div>

        <!-- Body -->
        <div class="card__body">
          <div class="card__meta">
            <span class="card__date">
              <i class="fa fa-calendar"></i> ${date}
            </span>
            <span class="card__read">
              <i class="fa fa-clock"></i> ${readTime}
            </span>
          </div>

          <h3 class="card__title">
            <a href="/article-detail.html?slug=${item.slug}">${title}</a>
          </h3>

          <p class="card__excerpt">${excerpt}</p>

          <div class="card__footer">
            <div class="card__tags">
              ${(item.tags || []).slice(0, 2).map(tag =>
                `<span class="card__tag">#${tag}</span>`
              ).join('')}
            </div>
            <a href="/article-detail.html?slug=${item.slug}" class="card__link">
              <span data-en="Read More" data-id="Baca Selengkapnya">
                ${lang === 'id' ? 'Baca Selengkapnya' : 'Read More'}
              </span>
              <i class="fa fa-arrow-right"></i>
            </a>
          </div>
        </div>

      </article>
    `;
  }

  /* ── Opinion Card ───────────────────────────────────────── */
  function _renderOpinion(item) {
    const lang    = _lang();
    const title   = lang === 'id' ? (item.titleId || item.titleEn) : item.titleEn;
    const excerpt = lang === 'id' ? (item.excerptId || item.excerptEn) : item.excerptEn;
    const cat     = lang === 'id' ? (item.categoryId || item.categoryEn) : item.categoryEn;
    const date    = _formatDate(item.date, lang);

    return `
      <article class="card card--opinion" data-slug="${item.slug}">

        <!-- Top Bar -->
        <div class="card__top">
          <span class="badge badge--${item.categorySlug || 'default'}">${cat}</span>
          <span class="card__date">
            <i class="fa fa-calendar"></i> ${date}
          </span>
        </div>

        <!-- Quote Mark -->
        <div class="card__quote-mark">
          <i class="fa fa-quote-left"></i>
        </div>

        <!-- Body -->
        <div class="card__body">
          <h3 class="card__title">
            <a href="/opinion-detail.html?slug=${item.slug}">${title}</a>
          </h3>
          <p class="card__excerpt">${excerpt}</p>
        </div>

        <!-- Footer -->
        <div class="card__footer">
          <div class="card__author">
            <img
              src="${CONFIG.assets.photo}"
              alt="Wafa Abbas"
              class="card__avatar"
            />
            <div>
              <div class="card__author-name">Wafa Abbas</div>
              <div class="card__author-role">
                ${lang === 'id' ? 'Spesialis Keuangan' : 'Finance Specialist'}
              </div>
            </div>
          </div>
          <a href="/opinion-detail.html?slug=${item.slug}" class="card__link">
            ${lang === 'id' ? 'Baca' : 'Read'}
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>

      </article>
    `;
  }

  /* ── News Card ──────────────────────────────────────────── */
  function _renderNews(item) {
    const lang    = _lang();
    const title   = lang === 'id' ? (item.titleId || item.titleEn) : item.titleEn;
    const excerpt = lang === 'id' ? (item.excerptId || item.excerptEn) : item.excerptEn;
    const cat     = lang === 'id' ? (item.categoryId || item.categoryEn) : item.categoryEn;
    const date    = _formatDate(item.date, lang);

    return `
      <article class="card card--news" data-slug="${item.slug}">

        <!-- Thumbnail -->
        <div class="card__thumb card__thumb--news">
          <img
            src="${item.thumbnail || '/assets/img/og/og-default.jpg'}"
            alt="${title}"
            loading="lazy"
            onerror="this.src='/assets/img/og/og-default.jpg'"
          />
          <div class="card__thumb-overlay">
            <span class="badge badge--${item.categorySlug || 'default'}">${cat}</span>
          </div>
        </div>

        <!-- Body -->
        <div class="card__body">
          <div class="card__meta">
            <span class="card__date">
              <i class="fa fa-calendar"></i> ${date}
            </span>
            <span class="card__source">
              <i class="fa fa-newspaper"></i>
              ${item.source || 'Wafa Abbas'}
            </span>
          </div>

          <h3 class="card__title">
            <a href="/news-detail.html?slug=${item.slug}">${title}</a>
          </h3>

          <p class="card__excerpt">${excerpt}</p>

          <a href="/news-detail.html?slug=${item.slug}" class="card__link">
            ${lang === 'id' ? 'Selengkapnya' : 'Full Story'}
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>

      </article>
    `;
  }

  /* ── Featured Card (large) ──────────────────────────────── */
  function renderFeatured(item, type = 'article') {
    const lang    = _lang();
    const title   = lang === 'id' ? (item.titleId || item.titleEn) : item.titleEn;
    const excerpt = lang === 'id' ? (item.excerptId || item.excerptEn) : item.excerptEn;
    const cat     = lang === 'id' ? (item.categoryId || item.categoryEn) : item.categoryEn;
    const date    = _formatDate(item.date, lang);
    const href    = `/${type}-detail.html?slug=${item.slug}`;

    return `
      <article class="card card--featured" data-slug="${item.slug}">

        <div class="card__featured-thumb">
          <img
            src="${item.thumbnail || '/assets/img/og/og-default.jpg'}"
            alt="${title}"
            loading="lazy"
            onerror="this.src='/assets/img/og/og-default.jpg'"
          />
          <div class="card__featured-overlay"></div>
        </div>

        <div class="card__featured-body">
          <div class="card__featured-meta">
            <span class="badge badge--${item.categorySlug || 'default'}">${cat}</span>
            <span class="card__date">
              <i class="fa fa-calendar"></i> ${date}
            </span>
          </div>
          <h2 class="card__featured-title">
            <a href="${href}">${title}</a>
          </h2>
          <p class="card__featured-excerpt">${excerpt}</p>
          <a href="${href}" class="btn btn--primary btn--sm">
            ${lang === 'id' ? 'Baca Selengkapnya' : 'Read More'}
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>

      </article>
    `;
  }

  /* ── Skeleton Loader ────────────────────────────────────── */
  function renderSkeleton(count = 6) {
    return Array(count).fill(0).map(() => `
      <div class="card card--skeleton">
        <div class="skeleton skeleton--thumb"></div>
        <div class="card__body">
          <div class="skeleton skeleton--line skeleton--short"></div>
          <div class="skeleton skeleton--line"></div>
          <div class="skeleton skeleton--line"></div>
          <div class="skeleton skeleton--line skeleton--med"></div>
        </div>
      </div>
    `).join('');
  }

  /* ── Helpers ────────────────────────────────────────────── */
  function _formatDate(dateStr, lang) {
    if (!dateStr) return '';
    try {
      const locale  = lang === 'id' ? 'id-ID' : 'en-US';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString(locale, options);
    } catch {
      return dateStr;
    }
  }

  function _readTime(text = '') {
    const words   = text.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    const lang    = _lang();
    return lang === 'id' ? `${minutes} menit baca` : `${minutes} min read`;
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    render,
    renderFeatured,
    renderSkeleton,
  };

})();

/* ── Export ─────────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = Card;