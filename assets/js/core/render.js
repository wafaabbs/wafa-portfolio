/* ============================================================
   RENDER — Wafa Abbas Portfolio
   HTML rendering utilities
   ============================================================ */

const RENDER = {

  /* ── Language ─────────────────────────────────────────── */
  t(obj, lang = LANG.current()) {
    if (!obj) return '';
    return obj[lang] || obj.en || '';
  },

  /* ── Meta / SEO ───────────────────────────────────────── */
  setMeta({ title, desc, image, url } = {}) {
    const sep      = CONFIG.seo.titleSeparator;
    const suffix   = CONFIG.seo.titleSuffix;
    const fullTitle = title ? `${title}${sep}${suffix}` : suffix;

    document.title = fullTitle;

    const metas = {
      'description':         desc  || CONFIG.seo.defaultDesc,
      'og:title':            fullTitle,
      'og:description':      desc  || CONFIG.seo.defaultDesc,
      'og:image':            image || CONFIG.assets.ogImage,
      'og:url':              url   || window.location.href,
      'twitter:title':       fullTitle,
      'twitter:description': desc  || CONFIG.seo.defaultDesc,
      'twitter:image':       image || CONFIG.assets.ogImage,
    };

    Object.entries(metas).forEach(([name, content]) => {
      let el = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });
  },

  /* ── Loading States ───────────────────────────────────── */
  skeleton(count = 3, type = 'card') {
    return Array(count).fill(0).map(() => `
      <div class="skeleton skeleton--${type}">
        <div class="skeleton__img"></div>
        <div class="skeleton__body">
          <div class="skeleton__line skeleton__line--sm"></div>
          <div class="skeleton__line"></div>
          <div class="skeleton__line skeleton__line--lg"></div>
          <div class="skeleton__line skeleton__line--sm"></div>
        </div>
      </div>
    `).join('');
  },

  loading(container, count = 3) {
    if (!container) return;
    container.innerHTML = this.skeleton(count);
  },

  /* ── Empty State ──────────────────────────────────────── */
  empty(container, opts = {}) {
    if (!container) return;
    const {
      icon    = 'fa-inbox',
      titleEn = 'Nothing here yet',
      titleId = 'Belum ada konten',
      descEn  = 'Check back later for updates.',
      descId  = 'Cek lagi nanti untuk pembaruan.',
      lang    = LANG.current(),
    } = opts;

    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">
          <i class="fa ${icon}"></i>
        </div>
        <h3 class="empty-state__title">
          ${lang === 'id' ? titleId : titleEn}
        </h3>
        <p class="empty-state__desc">
          ${lang === 'id' ? descId : descEn}
        </p>
      </div>
    `;
  },

  /* ── Error State ──────────────────────────────────────── */
  error(container, opts = {}) {
    if (!container) return;
    const {
      lang    = LANG.current(),
      message = lang === 'id'
        ? 'Terjadi kesalahan. Coba lagi.'
        : 'Something went wrong. Please try again.',
    } = opts;

    container.innerHTML = `
      <div class="error-state">
        <div class="error-state__icon">
          <i class="fa fa-triangle-exclamation"></i>
        </div>
        <p class="error-state__msg">${message}</p>
        <button class="btn btn--outline btn--sm"
          onclick="window.location.reload()">
          <i class="fa fa-rotate-right"></i>
          ${lang === 'id' ? 'Muat Ulang' : 'Reload'}
        </button>
      </div>
    `;
  },

  /* ── Badge ────────────────────────────────────────────── */
  badge(slug, type = 'articles', lang = 'en') {
    const label = UTILS.getCategoryLabel(slug, type, lang);
    const color = UTILS.getCategoryColor(slug, type);
    return `<span class="badge badge--${color}">${label}</span>`;
  },

  /* ── Card ─────────────────────────────────────────────── */
  card(item, type = 'articles', lang = 'en') {
    const title   = RENDER.t(item.title,   lang);
    const excerpt = RENDER.t(item.excerpt, lang);
    const date    = UTILS.formatDateShort(item.date, lang);
    const readT   = UTILS.readTime(excerpt, lang);
    const url     = `/assets/data/${type}/${item.slug}`;
    const detailPage = `/${type.slice(0,-1)}-detail.html?slug=${item.slug}`;

    return `
      <article class="card card--${type.slice(0,-1)}">
        ${item.image ? `
          <a href="${detailPage}" class="card__img-wrap">
            <img
              src="${item.image}"
              alt="${title}"
              class="card__img"
              loading="lazy"
            />
            <div class="card__img-overlay"></div>
          </a>
        ` : ''}
        <div class="card__body">
          <div class="card__meta">
            ${RENDER.badge(item.category, type, lang)}
            <span class="card__date">
              <i class="fa fa-calendar"></i> ${date}
            </span>
            <span class="card__read">
              <i class="fa fa-clock"></i> ${readT}
            </span>
          </div>
          <h3 class="card__title">
            <a href="${detailPage}">${title}</a>
          </h3>
          <p class="card__excerpt">${UTILS.truncate(excerpt)}</p>
          <a href="${detailPage}" class="card__link">
            <span>${lang === 'id' ? 'Baca Selengkapnya' : 'Read More'}</span>
            <i class="fa fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  },

  /* ── Cards Grid ───────────────────────────────────────── */
  cards(items = [], type = 'articles', lang = 'en') {
    if (!items.length) return '';
    return items.map(item => RENDER.card(item, type, lang)).join('');
  },

  /* ── Pagination ───────────────────────────────────────── */
  pagination({ current, total, onPage } = {}) {
    if (total <= 1) return '';

    const pages = [];

    // Prev
    pages.push(`
      <button class="pagination__btn pagination__btn--prev"
        ${current <= 1 ? 'disabled' : ''}
        data-page="${current - 1}">
        <i class="fa fa-chevron-left"></i>
      </button>
    `);

    // Page numbers
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || i === total ||
        (i >= current - 1 && i <= current + 1)
      ) {
        pages.push(`
          <button class="pagination__btn ${i === current ? 'pagination__btn--active' : ''}"
            data-page="${i}">${i}</button>
        `);
      } else if (i === current - 2 || i === current + 2) {
        pages.push(`<span class="pagination__ellipsis">…</span>`);
      }
    }

    // Next
    pages.push(`
      <button class="pagination__btn pagination__btn--next"
        ${current >= total ? 'disabled' : ''}
        data-page="${current + 1}">
        <i class="fa fa-chevron-right"></i>
      </button>
    `);

    return `<div class="pagination">${pages.join('')}</div>`;
  },

};

/* ── Export ────────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = RENDER;