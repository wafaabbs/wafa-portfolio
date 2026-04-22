/* ============================================================
   UTILS — Wafa Abbas Portfolio
   Helper functions: date, slug, readtime, truncate, etc.
   ============================================================ */

const UTILS = {

  /* ── Date Formatting ──────────────────────────────────── */
  formatDate(dateStr, lang = 'en') {
    if (!dateStr) return '';
    const date   = new Date(dateStr);
    const locale = lang === 'id'
      ? CONFIG.date.localeId
      : CONFIG.date.localeEn;
    return date.toLocaleDateString(locale, CONFIG.date.options);
  },

  formatDateShort(dateStr, lang = 'en') {
    if (!dateStr) return '';
    const date   = new Date(dateStr);
    const locale = lang === 'id' ? 'id-ID' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  },

  timeAgo(dateStr, lang = 'en') {
    const date  = new Date(dateStr);
    const now   = new Date();
    const diff  = Math.floor((now - date) / 1000);
    const units = [
      { en: 'year',   id: 'tahun',  s: 31536000 },
      { en: 'month',  id: 'bulan',  s: 2592000  },
      { en: 'week',   id: 'minggu', s: 604800   },
      { en: 'day',    id: 'hari',   s: 86400    },
      { en: 'hour',   id: 'jam',    s: 3600     },
      { en: 'minute', id: 'menit',  s: 60       },
    ];
    for (const u of units) {
      const val = Math.floor(diff / u.s);
      if (val >= 1) {
        return lang === 'id'
          ? `${val} ${u.id} lalu`
          : `${val} ${u.en}${val > 1 ? 's' : ''} ago`;
      }
    }
    return lang === 'id' ? 'Baru saja' : 'Just now';
  },

  /* ── Slug ─────────────────────────────────────────────── */
  toSlug(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  fromSlug(slug) {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  },

  /* ── Read Time ────────────────────────────────────────── */
  readTime(content, lang = 'en') {
    if (!content) return lang === 'id' ? '1 menit baca' : '1 min read';
    const words   = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / CONFIG.content.readTimeWPM));
    return lang === 'id'
      ? `${minutes} menit baca`
      : `${minutes} min read`;
  },

  /* ── Text ─────────────────────────────────────────────── */
  truncate(str, len = CONFIG.content.excerptLength) {
    if (!str) return '';
    if (str.length <= len) return str;
    return str.slice(0, len).replace(/\s+\S*$/, '') + '…';
  },

  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  },

  stripMarkdown(md) {
    return md
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/^\s*[-*+]\s/gm, '')
      .replace(/^\s*\d+\.\s/gm, '')
      .replace(/\n+/g, ' ')
      .trim();
  },

  /* ── URL ──────────────────────────────────────────────── */
  getQueryParam(key) {
    return new URLSearchParams(window.location.search).get(key) || '';
  },

  setQueryParam(key, value) {
    const url    = new URL(window.location.href);
    if (value) url.searchParams.set(key, value);
    else       url.searchParams.delete(key);
    window.history.replaceState({}, '', url);
  },

  buildUrl(base, params = {}) {
    const url = new URL(base, window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.pathname + url.search;
  },

  /* ── DOM ──────────────────────────────────────────────── */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  },

  /* ── Storage ──────────────────────────────────────────── */
  store: {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : fallback;
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); }
      catch {}
    },
    remove(key) {
      try { localStorage.removeItem(key); }
      catch {}
    },
  },

  /* ── Debounce ─────────────────────────────────────────── */
  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  /* ── Throttle ─────────────────────────────────────────── */
  throttle(fn, limit = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  },

  /* ── Category ─────────────────────────────────────────── */
  getCategoryLabel(slug, type = 'articles', lang = 'en') {
    const cats = CONFIG.categories[type] || [];
    const cat  = cats.find(c => c.slug === slug);
    if (!cat) return UTILS.fromSlug(slug);
    return lang === 'id' ? cat.labelId : cat.labelEn;
  },

  getCategoryColor(slug, type = 'articles') {
    const cats = CONFIG.categories[type] || [];
    const cat  = cats.find(c => c.slug === slug);
    return cat?.color || 'blue';
  },

  /* ── Scroll ───────────────────────────────────────────── */
  scrollTo(target, offset = CONFIG.nav.height + 8) {
    const el = typeof target === 'string'
      ? document.querySelector(target)
      : target;
    if (!el) return;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  },

  /* ── Clipboard ────────────────────────────────────────── */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

};

/* ── Export ────────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = UTILS;