/* ============================================================
   NEWS PAGE — Wafa Abbas Portfolio
   ============================================================ */

const NewsPage = (() => {

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
      console.log('[NewsPage] initialized');
    } catch (err) {
      console.error('[NewsPage] init error:', err);
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    const data = await FETCH.list('news');
    _all = data.items || [];
  }

  /* ── Render Filters ─────────────────────────────────────── */
  function _renderFilters() {
    const wrap = $('filter-btns');
    if (!wrap) return;

    const cats = CONFIG.categories.news;

    wrap.innerHTML = `
      <button class="filter-btn ${_category === 'all' ? 'active' : ''}"
              data-cat="all">
        ${_lang === 'id' ? 'Semua' : 'All'}
      </button>
      ${cats.map(c => `
        <button class="filter-btn ${_category === c.slug ? 'active' : ''}"
                data-cat="${c.slug}">
          ${_lang === 'id' ? c.labelId : c.labelEn}
        </button>
      `).join('')}
    `;
  }

  /* ── Render Sort ────────────────────────────────────────── */
  function _renderSort() {
    const sel = $('sort-select');
    if (!sel) return;

    sel.innerHTML = `
      <option value="newest">
        ${_lang === 'id' ? 'Terbaru' : 'Newest'}
      </option>
      <option value="oldest">
        ${_lang === 'id' ? 'Terlama' : 'Oldest'}
      </option>
      <option value="az">A – Z</option>
      <option value="za">Z – A</option>
    `;
    sel.value = _sort;
  }

  /* ── Apply Filters ──────────────────────────────────────── */
  function _applyFilters() {
    let data = [..._all];

    /* category filter */
    if (_category !== 'all') {
      data = data.filter(i => i.category === _category);
    }

    /* sort */
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
    const wrap = $('news-grid');
    if (!wrap) return;

    const perPage = CONFIG.pagination.newsPerPage;
    const start   = (_page - 1) * perPage;
    const items   = _filtered.slice(start, start + perPage);

    if (!items.length) {
      RENDER.empty(wrap, {
        icon:    'fa-newspaper',
        titleEn: 'No news found',
        titleId: 'Berita tidak ditemukan',
        descEn:  'Try a different filter.',
        descId:  'Coba filter yang berbeda.',
        lang:    _lang,
      });
      return;
    }

    wrap.innerHTML = items.map(item =>
      RENDER.card(item, 'news', _lang)
    ).join('');

    _animateCards();
  }

  /* ── Render Pagination ──────────────────────────────────── */
  function _renderPagination() {
    const wrap = $('pagination');
    if (!wrap) return;

    const perPage = CONFIG.pagination.newsPerPage;
    const total   = Math.ceil(_filtered.length / perPage);

    wrap.innerHTML = RENDER.pagination({
      current: _page,
      total,
    });

    wrap.querySelectorAll('[data-page]').forEach(btn => {
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
      ? `${total} berita ditemukan`
      : `${total} news found`;
  }

  /* ── Bind Events ────────────────────────────────────────── */
  function _bindEvents() {

    /* Filter buttons */
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      _category = btn.dataset.cat;
      $$('[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _applyFilters();
    });

    /* Sort select */
    const sel = $('sort-select');
    if (sel) {
      sel.addEventListener('change', () => {
        _sort = sel.value;
        _applyFilters();
      });
    }
  }

  /* ── Animate Cards ──────────────────────────────────────── */
  function _animateCards() {
    $$('.card').forEach((card, i) => {
      card.style.opacity    = '0';
      card.style.transform  = 'translateY(20px)';
      card.style.transition = `opacity 0.4s ease ${i * 0.08}s,
                               transform 0.4s ease ${i * 0.08}s`;
      requestAnimationFrame(() => {
        card.style.opacity   = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    $$('[data-reveal]').forEach(el => obs.observe(el));
  }

  /* ── Lang Watch ─────────────────────────────────────────── */
  function _initLangWatch() {
    document.addEventListener('langChange', (e) => {
      _lang = e.detail.lang;
      _renderFilters();
      _renderSort();
      _renderGrid();
      _renderCount();
    });
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Auto Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => NewsPage.init());