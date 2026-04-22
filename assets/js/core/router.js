/* ============================================================
   ROUTER — Wafa Abbas Portfolio
   Client-side routing utilities
   ============================================================ */

const Router = (() => {

  /* ── Current Page Detection ───────────────────────────── */
  function currentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';

    const map = {
      'index.html':          'home',
      '':                    'home',
      'about.html':          'about',
      'articles.html':       'articles',
      'article-detail.html': 'article-detail',
      'opinions.html':       'opinions',
      'opinion-detail.html': 'opinion-detail',
      'news.html':           'news',
      'news-detail.html':    'news-detail',
      'search.html':         'search',
      '404.html':            '404',
    };

    return map[file] || 'unknown';
  }

  /* ── Navigate ─────────────────────────────────────────── */
  function go(url) {
    window.location.href = url;
  }

  function goBack() {
    if (document.referrer) {
      window.history.back();
    } else {
      go('/index.html');
    }
  }

  /* ── Detail Page URL Builder ──────────────────────────── */
  function detailURL(type, slug) {
    const map = {
      article: '/article-detail.html',
      opinion: '/opinion-detail.html',
      news:    '/news-detail.html',
    };
    return `${map[type] || '/article-detail.html'}?slug=${slug}`;
  }

  /* ── 404 Redirect ─────────────────────────────────────── */
  function redirectTo404() {
    go('/404.html');
  }

  /* ── Active Nav Highlight ─────────────────────────────── */
  function highlightNav() {
    const page = currentPage();
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      const linkPage = link.dataset.navLink;
      const isActive =
        linkPage === page ||
        (linkPage === 'articles' && page === 'article-detail') ||
        (linkPage === 'opinions' && page === 'opinion-detail') ||
        (linkPage === 'news'     && page === 'news-detail');

      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  /* ── Public API ───────────────────────────────────────── */
  return {
    currentPage,
    go,
    goBack,
    detailURL,
    redirectTo404,
    highlightNav,
  };

})();