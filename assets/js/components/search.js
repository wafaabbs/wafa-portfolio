/* ============================================================
   SEARCH COMPONENT — Wafa Abbas Portfolio
   ============================================================ */

const Search = (() => {

  /* ── State ─────────────────────────────────────────────── */
  let _allData   = [];
  let _query     = '';
  let _type      = 'all';
  let _page      = 1;
  let _isLoading = false;

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init() {
    _bindInput();
    _bindFilters();
    _bindClear();
    _readURLParams();
    await _loadAllData();
    if (_query) _doSearch();
    console.log('[Search] initialized');
  }

  /* ── Load All Data ──────────────────────────────────────── */
  async function _loadAllData() {
    try {
      const [art, opi, nws] = await Promise.all([
        fetch(CONFIG.data.articles).then(r => r.json()),
        fetch(CONFIG.data.opinions).then(r => r.json()),
        fetch(CONFIG.data.news).then(r => r.json()),
      ]);

      _allData = [
        ...art.map(i => ({ ...i, _type: 'article' })),
        ...opi.map(i => ({ ...i, _type: 'opinion' })),
        ...nws.map(i => ({ ...i, _type: 'news'    })),
      ];

    } catch (err) {
      console.error('[Search] load error:', err);
      _allData = [];
    }
  }

  /* ── Read URL Params ────────────────────────────────────── */
  function _readURLParams() {
    const params = new URLSearchParams(window.location.search);
    _query = params.get('q')    || '';
    _type  = params.get('type') || 'all';
    _page  = parseInt(params.get('page')) || 1;

    const input = $('search-input');
    if (input && _query) input.value = _query;

    /* set active filter btn */
    $$('.search-filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === _type);
    });
  }

  /* ── Bind Input ─────────────────────────────────────────── */
  function _bindInput() {
    const input = $('search-input');
    if (!input) return;

    let _debounce;
    input.addEventListener('input', () => {
      clearTimeout(_debounce);
      _debounce = setTimeout(() => {
        _query = input.value.trim();
        _page  = 1;
        _doSearch();
        _updateURL();
      }, 350);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        clearTimeout(_debounce);
        _query = input.value.trim();
        _page  = 1;
        _doSearch();
        _updateURL();
      }
    });
  }

  /* ── Bind Filters ───────────────────────────────────────── */
  function _bindFilters() {
    $$('.search-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _type = btn.dataset.type || 'all';
        _page = 1;
        $$('.search-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _doSearch();
        _updateURL();
      });
    });
  }

  /* ── Bind Clear ─────────────────────────────────────────── */
  function _bindClear() {
    const clearBtn = $('search-clear');
    const input    = $('search-input');
    if (!clearBtn || !input) return;

    clearBtn.addEventListener('click', () => {
      input.value = '';
      _query      = '';
      _page       = 1;
      _doSearch();
      _updateURL();
      input.focus();
    });

    input.addEventListener('input', () => {
      clearBtn.style.display = input.value ? 'flex' : 'none';
    });
  }

  /* ── Do Search ──────────────────────────────────────────── */
  function _doSearch() {
    if (!_query) {
      _renderEmpty('prompt');
      return;
    }

    const lang    = document.documentElement.getAttribute('data-lang') || 'en';
    const q       = _query.toLowerCase();

    let results = _allData.filter(item => {
      /* type filter */
      if (_type !== 'all' && item._type !== _type) return false;

      /* text match */
      const title   = (lang === 'id' ? item.titleId   : item.titleEn)   || '';
      const excerpt = (lang === 'id' ? item.excerptId : item.excerptEn) || '';
      const tags    = (item.tags || []).join(' ');
      const cat     = item.category || '';

      return (
        title.toLowerCase().includes(q)   ||
        excerpt.toLowerCase().includes(q) ||
        tags.toLowerCase().includes(q)    ||
        cat.toLowerCase().includes(q)
      );
    });

    /* sort by date desc */
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    _renderResults(results, lang, q);
  }

  /* ── Render Results ─────────────────────────────────────── */
  function _renderResults(results, lang, q) {
    const wrap     = $('search-results');
    const countEl  = $('search-count');
    const pagWrap  = $('search-pagination');
    if (!wrap) return;

    /* count */
    if (countEl) {
      countEl.textContent = lang === 'id'
        ? `${results.length} hasil ditemukan untuk "${q}"`
        : `${results.length} results found for "${q}"`;
    }

    /* empty */
    if (results.length === 0) {
      _renderEmpty('no-results');
      if (pagWrap) pagWrap.innerHTML = '';
      return;
    }

    /* paginate */
    const perPage = CONFIG.pagination.searchPerPage;
    const total   = Math.ceil(results.length / perPage);
    _page         = Math.min(_page, total);
    const start   = (_page - 1) * perPage;
    const paged   = results.slice(start, start + perPage);

    /* render cards */
    wrap.innerHTML = paged.map(item =>
      _renderCard(item, lang, q)
    ).join('');

    /* pagination */
    if (pagWrap) {
      pagWrap.innerHTML = _renderPagination(total);
      _bindPagination();
    }
  }

  /* ── Render Single Card ─────────────────────────────────── */
  function _renderCard(item, lang, q) {
    const title   = _highlight(
      (lang === 'id' ? item.titleId : item.titleEn) || '', q
    );
    const excerpt = _highlight(
      (lang === 'id' ? item.excerptId : item.excerptEn) || '', q
    );
    const date    = item.date
      ? new Date(item.date).toLocaleDateString(
          lang === 'id' ? 'id-ID' : 'en-US',
          { year: 'numeric', month: 'long', day: 'numeric' }
        )
      : '';

    const typeLabel = {
      article: lang === 'id' ? 'Artikel'  : 'Article',
      opinion: lang === 'id' ? 'Opini'    : 'Opinion',
      news:    lang === 'id' ? 'Berita'   : 'News',
    }[item._type] || item._type;

    const href = `/${item._type}s/${item.slug}.html`;

    return `
      <a href="${href}" class="search-card">
        <div class="search-card__meta">
          <span class="badge badge--${item._type}">${typeLabel}</span>
          ${item.category
            ? `<span class="badge badge--outline">${item.category}</span>`
            : ''}
          <span class="search-card__date">
            <i class="fa fa-calendar"></i> ${date}
          </span>
        </div>
        <h3 class="search-card__title">${title}</h3>
        <p  class="search-card__excerpt">${excerpt}</p>
        <span class="search-card__link">
          ${lang === 'id' ? 'Baca selengkapnya' : 'Read more'}
          <i class="fa fa-arrow-right"></i>
        </span>
      </a>`;
  }

  /* ── Highlight Query ────────────────────────────────────── */
  function _highlight(text, q) {
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex   = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  /* ── Render Empty State ─────────────────────────────────── */
  function _renderEmpty(type) {
    const wrap  = $('search-results');
    const count = $('search-count');
    const lang  = document.documentElement.getAttribute('data-lang') || 'en';
    if (!wrap) return;

    if (count) count.textContent = '';

    if (type === 'prompt') {
      wrap.innerHTML = `
        <div class="search-empty">
          <div class="search-empty__icon">🔍</div>
          <h3 class="search-empty__title">
            ${lang === 'id' ? 'Cari sesuatu...' : 'Search something...'}
          </h3>
          <p class="search-empty__desc">
            ${lang === 'id'
              ? 'Masukkan kata kunci untuk mencari artikel, opini, atau berita.'
              : 'Enter a keyword to search articles, opinions, or news.'}
          </p>
        </div>`;
      return;
    }

    wrap.innerHTML = `
      <div class="search-empty">
        <div class="search-empty__icon">😔</div>
        <h3 class="search-empty__title">
          ${lang === 'id' ? 'Tidak ditemukan' : 'No results found'}
        </h3>
        <p class="search-empty__desc">
          ${lang === 'id'
            ? `Tidak ada hasil untuk "<strong>${_query}</strong>". Coba kata kunci lain.`
            : `No results for "<strong>${_query}</strong>". Try a different keyword.`}
        </p>
      </div>`;
  }

  /* ── Render Pagination ──────────────────────────────────── */
  function _renderPagination(total) {
    if (total <= 1) return '';
    let html = '<div class="pagination">';
    for (let i = 1; i <= total; i++) {
      html += `
        <button
          class="pagination__btn ${i === _page ? 'active' : ''}"
          data-page="${i}"
        >${i}</button>`;
    }
    html += '</div>';
    return html;
  }

  /* ── Bind Pagination ────────────────────────────────────── */
  function _bindPagination() {
    $$('.pagination__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _page = parseInt(btn.dataset.page);
        _doSearch();
        _updateURL();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  /* ── Update URL ─────────────────────────────────────────── */
  function _updateURL() {
    const params = new URLSearchParams();
    if (_query) params.set('q',    _query);
    if (_type !== 'all') params.set('type', _type);
    if (_page  > 1)      params.set('page', _page);
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Auto Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('search-input')) {
    Search.init();
  }
});