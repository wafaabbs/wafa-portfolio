/* ============================================================
   ARTICLES PAGE — Wafa Abbas Portfolio
   Handles: fetch, filter, paginate, render article cards
   ============================================================ */

const ArticlesPage = (() => {

  /* ── State ─────────────────────────────────────────────── */
  let _all      = [];
  let _filtered = [];
  let _page     = 1;
  let _category = 'all';
  let _sort     = 'newest';
  let _lang     = 'en';

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init() {
    try {
      _lang = LANG.current();
      await _loadData();
      _renderFilters();
      _renderSort();
      _applyFilters();
      _bindEvents();
      _initScrollReveal();
      _initLangWatch();
      console.log('[ArticlesPage] initialized');
    } catch (err) {
      console.error('[ArticlesPage] init error:', err);
      _renderError();
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    RENDER.loading($('articles-grid'), 6);
    _all = await FETCH.articles();
  }

  /* ── Render Filters ─────────────────────────────────────── */
  function _renderFilters() {
    const wrap = $('filter-btns');
    if (!wrap) return;

    const cats = CONFIG.categories.articles;
    const lang = _lang;

    const allBtn = `
      <button class="filter-btn ${_category === 'all' ? 'filter-btn--active' : ''}"
        data-cat="all">
        ${lang === 'id' ? 'Semua' : 'All'}
      </button>
    `;

    const catBtns = cats.map(c => `
      <button class="filter-btn ${_category === c.slug ? 'filter-btn--active' : ''}"
        data-cat="${c.slug}">
        ${lang === 'id' ? c.labelId : c.labelEn}
      </button>
    `).join('');

    wrap.innerHTML = allBtn + catBtns;
  }

  /* ── Render Sort ────────────────────────────────────────── */
  function _renderSort() {
    const sel = $('sort-select');
    if (!sel) return;

    const options = _lang === 'id'
      ? [
          { val: 'newest', label: 'Terbaru'   },
          { val: 'oldest', label: 'Terlama'   },
          { val: 'az',     label: 'A → Z'     },
          { val: 'za',     label: 'Z → A'     },
        ]
      : [
          { val: 'newest', label: 'Newest'    },
          { val: 'oldest', label: 'Oldest'    },
          { val: 'az',     label: 'A → Z'     },
          { val: 'za',     label: 'Z → A'     },
        ];

    sel.innerHTML = options.map(o => `
      <option value="${o.val}" ${_sort === o.val ? 'selected' : ''}>
        ${o.label}
      </option>
    `).join('');
  }

  /* ── Apply Filters ──────────────────────────────────────── */
  function _applyFilters() {
    let data = [..._all];

    /* Category filter */
    if (_category !== 'all') {
      data = data.filter(i => i.category === _category);
    }

    /* Sort */
    switch (_sort) {
      case 'newest': data.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
      case 'oldest': data.sort((a,b) => new Date(a.date) - new Date(b.date)); break;
      case 'az':     data.sort((a,b) => a.titleEn.localeCompare(b.titleEn));  break;
      case 'za':     data.sort((a,b) => b.titleEn.localeCompare(a.titleEn));  break;
    }

    _filtered = data;
    _page     = 1;
    _renderGrid();
    _renderCount();
    _renderPagination();
  }

  /* ── Render Grid ────────────────────────────────────────── */
  function _renderGrid() {
    const grid = $('articles-grid');
    if (!grid) return;

    const perPage = CONFIG.pagination.articlesPerPage;
    const start   = (_page - 1) * perPage;
    const items   = _filtered.slice(start, start + perPage);

    if (!items.length) {
      RENDER.empty(grid, {
        icon:    'fa-newspaper',
        titleEn: 'No articles found',
        titleId: 'Artikel tidak ditemukan',
        descEn:  'Try a different category or check back later.',
        descId:  'Coba kategori lain atau cek lagi nanti.',
        lang:    _lang,
      });
      return;
    }

    grid.innerHTML = RENDER.cards(items, 'articles', _lang);
    _initRevealCards();
  }

  /* ── Render Count ───────────────────────────────────────── */
  function _renderCount() {
    const el = $('articles-count');
    if (!el) return;
    const total = _filtered.length;
    el.textContent = _lang === 'id'
      ? `${total} artikel ditemukan`
      : `${total} article${total !== 1 ? 's' : ''} found`;
  }

  /* ── Render Pagination ──────────────────────────────────── */
  function _renderPagination() {
    const wrap = $('articles-pagination');
    if (!wrap) return;

    const total = Math.ceil(_filtered.length / CONFIG.pagination.articlesPerPage);
    wrap.innerHTML = RENDER.pagination({
      current: _page,
      total,
    });

    wrap.querySelectorAll('.pagination__btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        _page = parseInt(btn.dataset.page);
        _renderGrid();
        _renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ── Bind Events ────────────────────────────────────────── */
  function _bindEvents() {
    /* Filter buttons */
    document.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      _category = btn.dataset.cat;
      $$('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');
      _applyFilters();
    });

    /* Sort select */
    const sortSel = $('sort-select');
    if (sortSel) {
      sortSel.addEventListener('change', e => {
        _sort = e.target.value;
        _applyFilters();
      });
    }
  }

  /* ── Scroll Reveal Cards ────────────────────────────────── */
  function _initRevealCards() {
    const cards = $$('.card');
    cards.forEach((card, i) => {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(24px)';
      card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
      setTimeout(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const els = $$('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  /* ── Lang Watch ─────────────────────────────────────────── */
  function _initLangWatch() {
    document.addEventListener('langchange', e => {
      _lang = e.detail.lang;
      _renderFilters();
      _renderSort();
      _renderGrid();
      _renderCount();
    });
  }

  /* ── Error ──────────────────────────────────────────────── */
  function _renderError() {
    RENDER.error($('articles-grid'), { lang: _lang });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Auto Init ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (Router.currentPage() === 'articles') ArticlesPage.init();
});