/* ============================================================
   SEARCH PAGE — Wafa Abbas Portfolio
   Handles: search, filter by type, paginate, render results
   ============================================================ */

const SearchPage = (() => {

  /* ── State ─────────────────────────────────────────────── */
  let _all      = [];
  let _results  = [];
  let _query    = '';
  let _type     = 'all';
  let _page     = 1;
  let _lang     = 'en';

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init() {
    try {
      _lang  = LANG.current();
      _query = UTILS.getParam('q') || '';
      _type  = UTILS.getParam('type') || 'all';

      await _loadData();
      _renderSearchBox();
      _renderFilters();
      _doSearch();
      _bindEvents();
      _initLangWatch();
      console.log('[SearchPage] initialized');
    } catch(err) {
      console.error('[SearchPage] init error', err);
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    const [articles, opinions, news] = await Promise.all([
      FETCH.json(CONFIG.data.articles),
      FETCH.json(CONFIG.data.opinions),
      FETCH.json(CONFIG.data.news),
    ]);

    _all = [
      ...articles.map(i => ({ ...i, _type: 'articles' })),
      ...opinions.map(i => ({ ...i, _type: 'opinions' })),
      ...news.map(i => ({ ...i, _type: 'news'     })),
    ];
  }

  /* ── Render Search Box ──────────────────────────────────── */
  function _renderSearchBox() {
    const input = $('search-input');
    const count = $('search-count');
    if (input) input.value = _query;
    if (count) count.textContent = '';
  }

  /* ── Render Filters ─────────────────────────────────────── */
  function _renderFilters() {
    const wrap = $('type-filters');
    if (!wrap) return;

    const types = [
      { slug: 'all',      labelEn: 'All',      labelId: 'Semua'   },
      { slug: 'articles', labelEn: 'Articles',  labelId: 'Artikel' },
      { slug: 'opinions', labelEn: 'Opinions',  labelId: 'Opini'   },
      { slug: 'news',     labelEn: 'News',      labelId: 'Berita'  },
    ];

    wrap.innerHTML = types.map(t => `
      <button
        class="filter-btn ${t.slug === _type ? 'filter-btn--active' : ''}"
        data-type="${t.slug}">
        ${_lang === 'id' ? t.labelId : t.labelEn}
      </button>
    `).join('');
  }

  /* ── Do Search ──────────────────────────────────────────── */
  function _doSearch() {
    if (!_query.trim()) {
      _results = [];
      _renderResults();
      _renderCount();
      return;
    }

    const q = _query.toLowerCase().trim();

    _results = _all.filter(item => {
      /* type filter */
      if (_type !== 'all' && item._type !== _type) return false;

      /* text match */
      const title    = (RENDER.t(item.title,   _lang) || '').toLowerCase();
      const excerpt  = (RENDER.t(item.excerpt, _lang) || '').toLowerCase();
      const category = (item.category || '').toLowerCase();
      const tags     = (item.tags || []).join(' ').toLowerCase();

      return (
        title.includes(q)    ||
        excerpt.includes(q)  ||
        category.includes(q) ||
        tags.includes(q)
      );
    });

    _page = 1;
    _renderResults();
    _renderCount();
    _updateURL();
  }

  /* ── Render Results ─────────────────────────────────────── */
  function _renderResults() {
    const wrap = $('search-results');
    if (!wrap) return;

    if (!_query.trim()) {
      _renderEmpty(wrap, 'idle');
      return;
    }

    if (!_results.length) {
      _renderEmpty(wrap, 'noresult');
      return;
    }

    const perPage = CONFIG.pagination.searchPerPage;
    const start   = (_page - 1) * perPage;
    const paged   = _results.slice(start, start + perPage);

    wrap.innerHTML = `
      <div class="cards-grid">
        ${paged.map(item => RENDER.card(item, item._type, _lang)).join('')}
      </div>
      ${RENDER.pagination({
        current: _page,
        total:   Math.ceil(_results.length / perPage),
      })}
    `;

    _bindPagination(wrap);
  }

  /* ── Render Count ───────────────────────────────────────── */
  function _renderCount() {
    const el = $('search-count');
    if (!el) return;

    if (!_query.trim()) { el.textContent = ''; return; }

    const n = _results.length;
    el.textContent = _lang === 'id'
      ? `${n} hasil untuk "${_query}"`
      : `${n} result${n !== 1 ? 's' : ''} for "${_query}"`;
  }

  /* ── Render Empty ───────────────────────────────────────── */
  function _renderEmpty(wrap, mode = 'idle') {
    if (mode === 'idle') {
      wrap.innerHTML = `
        <div class="search-idle">
          <i class="fa fa-magnifying-glass"></i>
          <p>${_lang === 'id'
            ? 'Ketik sesuatu untuk mencari...'
            : 'Type something to search...'}</p>
        </div>
      `;
    } else {
      wrap.innerHTML = `
        <div class="search-empty">
          <i class="fa fa-face-frown"></i>
          <h3>${_lang === 'id' ? 'Tidak ditemukan' : 'No results found'}</h3>
          <p>${_lang === 'id'
            ? `Tidak ada hasil untuk "${_query}"`
            : `No results for "${_query}"`}</p>
        </div>
      `;
    }
  }

  /* ── Bind Events ────────────────────────────────────────── */
  function _bindEvents() {
    /* Search input */
    const input = $('search-input');
    if (input) {
      input.addEventListener('input', UTILS.debounce(e => {
        _query = e.target.value;
        _doSearch();
      }, 350));

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          _query = e.target.value;
          _doSearch();
        }
      });
    }

    /* Clear button */
    const clear = $('search-clear');
    if (clear) {
      clear.addEventListener('click', () => {
        _query = '';
        if (input) input.value = '';
        _doSearch();
      });
    }

    /* Type filters */
    const wrap = $('type-filters');
    if (wrap) {
      wrap.addEventListener('click', e => {
        const btn = e.target.closest('[data-type]');
        if (!btn) return;
        _type = btn.dataset.type;
        wrap.querySelectorAll('.filter-btn')
            .forEach(b => b.classList.toggle(
              'filter-btn--active', b === btn
            ));
        _doSearch();
      });
    }
  }

  /* ── Bind Pagination ────────────────────────────────────── */
  function _bindPagination(wrap) {
    wrap.addEventListener('click', e => {
      const btn = e.target.closest('[data-page]');
      if (!btn || btn.disabled) return;
      _page = parseInt(btn.dataset.page);
      _renderResults();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Update URL ─────────────────────────────────────────── */
  function _updateURL() {
    const params = new URLSearchParams();
    if (_query) params.set('q',    _query);
    if (_type !== 'all') params.set('type', _type);
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }

  /* ── Lang Watch ─────────────────────────────────────────── */
  function _initLangWatch() {
    document.addEventListener('langchange', e => {
      _lang = e.detail.lang;
      _renderFilters();
      _renderResults();
      _renderCount();
    });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Auto Init ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (Router.currentPage() === 'search') SearchPage.init();
});