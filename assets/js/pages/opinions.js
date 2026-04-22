/* ============================================================
   OPINIONS PAGE — Wafa Abbas Portfolio
   Handles: fetch, filter, paginate, render opinion cards
   ============================================================ */

const OpinionsPage = (() => {

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
      console.log('[OpinionsPage] initialized');
    } catch (err) {
      console.error('[OpinionsPage] init error:', err);
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    try {
      RENDER.loading($('opinions-grid'), 6);
      _all = await FETCH.list('opinions');
    } catch (err) {
      RENDER.error($('opinions-grid'));
      throw err;
    }
  }

  /* ── Render Filters ─────────────────────────────────────── */
  function _renderFilters() {
    const wrap = $('filter-wrap');
    if (!wrap) return;

    const cats = CONFIG.categories.opinions;
    const lang = _lang;

    const allBtn = `
      <button class="filter-btn active" data-category="all">
        ${lang === 'id' ? 'Semua' : 'All'}
      </button>`;

    const catBtns = cats.map(cat => `
      <button class="filter-btn" data-category="${cat.slug}">
        ${lang === 'id' ? cat.labelId : cat.labelEn}
      </button>
    `).join('');

    wrap.innerHTML = allBtn + catBtns;
  }

  /* ── Render Sort ────────────────────────────────────────── */
  function _renderSort() {
    const wrap = $('sort-wrap');
    if (!wrap) return;

    wrap.innerHTML = `
      <select class="sort-select" id="sort-select">
        <option value="newest">
          ${_lang === 'id' ? 'Terbaru' : 'Newest'}
        </option>
        <option value="oldest">
          ${_lang === 'id' ? 'Terlama' : 'Oldest'}
        </option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>`;
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
    _renderPagination();
    _renderCount();
  }

  /* ── Render Grid ────────────────────────────────────────── */
  function _renderGrid() {
    const grid = $('opinions-grid');
    if (!grid) return;

    const perPage = CONFIG.pagination.opinionsPerPage;
    const start   = (_page - 1) * perPage;
    const items   = _filtered.slice(start, start + perPage);

    if (!items.length) {
      RENDER.empty(grid, {
        icon:    'fa-comment-slash',
        titleEn: 'No opinions found',
        titleId: 'Tidak ada opini',
        descEn:  'Try a different filter or check back later.',
        descId:  'Coba filter lain atau cek lagi nanti.',
        lang:    _lang,
      });
      return;
    }

    grid.innerHTML = items.map(item =>
      RENDER.card(item, 'opinions', _lang)
    ).join('');
  }

  /* ── Render Pagination ──────────────────────────────────── */
  function _renderPagination() {
    const wrap = $('pagination-wrap');
    if (!wrap) return;

    const perPage = CONFIG.pagination.opinionsPerPage;
    const total   = Math.ceil(_filtered.length / perPage);

    wrap.innerHTML = RENDER.pagination({
      current: _page,
      total,
    });

    /* Bind pagination clicks */
    wrap.querySelectorAll('.pagination__btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        _page = parseInt(btn.dataset.page);
        _renderGrid();
        _renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ── Render Count ───────────────────────────────────────── */
  function _renderCount() {
    const el = $('results-count');
    if (!el) return;

    const total = _filtered.length;
    el.textContent = _lang === 'id'
      ? `${total} opini ditemukan`
      : `${total} opinion${total !== 1 ? 's' : ''} found`;
  }

  /* ── Bind Events ────────────────────────────────────────── */
  function _bindEvents() {
    /* Filter buttons */
    document.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _category = btn.dataset.category || 'all';
      _applyFilters();
    });

    /* Sort select */
    document.addEventListener('change', e => {
      if (e.target.id !== 'sort-select') return;
      _sort = e.target.value;
      _applyFilters();
    });
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const els = $$('.reveal, .reveal-up, .reveal-left, .reveal-right');
    if (!els.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  /* ── Lang Watch ─────────────────────────────────────────── */
  function _initLangWatch() {
    document.addEventListener('langChange', e => {
      _lang = e.detail.lang;
      _renderFilters();
      _renderSort();
      _renderGrid();
      _renderPagination();
      _renderCount();
    });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Auto Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (Router.currentPage() === 'opinions') {
    OpinionsPage.init();
  }
});