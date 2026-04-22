/* ============================================================
   FETCH — Wafa Abbas Portfolio
   Updated: Compatible with Netlify CMS output
   Format : frontmatter markdown (.md) + index.json
   ============================================================ */

const FETCH = (() => {

  /* ── Cache ──────────────────────────────────────────────── */
  const _cache = new Map();

  /* ── Base Fetcher ───────────────────────────────────────── */
  async function _get(url) {
    if (_cache.has(url)) return _cache.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
      const data = url.endsWith('.json')
        ? await res.json()
        : await res.text();
      _cache.set(url, data);
      return data;
    } catch (err) {
      console.error('[FETCH] error:', err);
      throw err;
    }
  }

  /* ── Parse Frontmatter ──────────────────────────────────── */
  function _parseFrontmatter(raw) {
    try {
      const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (!match) return { meta: {}, body: raw };

      const yamlStr = match[1];
      const body    = match[2].trim();
      const meta    = {};

      yamlStr.split('\n').forEach(line => {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) return;

        const key   = line.slice(0, colonIdx).trim();
        let   val   = line.slice(colonIdx + 1).trim();

        /* remove quotes */
        if ((val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }

        /* boolean */
        if (val === 'true')  { meta[key] = true;  return; }
        if (val === 'false') { meta[key] = false; return; }

        /* number */
        if (!isNaN(val) && val !== '') { meta[key] = Number(val); return; }

        /* array inline: [a, b, c] */
        if (val.startsWith('[') && val.endsWith(']')) {
          meta[key] = val.slice(1, -1)
            .split(',')
            .map(v => v.trim().replace(/^["']|["']$/g, ''));
          return;
        }

        meta[key] = val;
      });

      return { meta, body };

    } catch (err) {
      console.error('[FETCH] parseFrontmatter error:', err);
      return { meta: {}, body: raw };
    }
  }

  /* ── Parse Bilingual Field ──────────────────────────────── */
  function _parseBilingual(meta, key) {
    if (meta[key] && typeof meta[key] === 'object') {
      return meta[key]; // { en, id }
    }
    /* fallback: titleEn / titleId pattern */
    const en = meta[`${key}En`] || meta[key] || '';
    const id = meta[`${key}Id`] || en;
    return { en, id };
  }

  /* ── Normalize Item ─────────────────────────────────────── */
  function _normalize(meta, body, slug) {
    return {
      slug:      meta.slug     || slug,
      title:     _parseBilingual(meta, 'title'),
      excerpt:   _parseBilingual(meta, 'excerpt'),
      category:  meta.category || '',
      tags:      Array.isArray(meta.tags) ? meta.tags : [],
      date:      meta.date     || '',
      featured:  meta.featured || false,
      published: meta.published !== false,
      readTime:  meta.readTime  || meta.read_time || 5,
      image:     meta.image     || meta.thumbnail || '',
      author: {
        name:  _parseBilingual(meta.author || {}, 'name'),
        photo: (meta.author || {}).photo || CONFIG.assets.defaultAvatar,
      },
      source:    meta.source     || '',
      sourceUrl: meta.source_url || '',
      body,
    };
  }

  /* ── Public: Get Index ──────────────────────────────────── */
  async function getIndex(type) {
    const url  = `${CONFIG.data[type]}index.json`;
    const data = await _get(url);
    return Array.isArray(data) ? data : (data.items || []);
  }

  /* ── Public: Get One Item ───────────────────────────────── */
  async function getItem(type, slug) {
    const url = `${CONFIG.data[type]}${slug}.md`;
    const raw = await _get(url);
    const { meta, body } = _parseFrontmatter(raw);
    return _normalize(meta, body, slug);
  }

  /* ── Public: Get All Items ──────────────────────────────── */
  async function getAll(type) {
    try {
      const index = await getIndex(type);
      const items = await Promise.all(
        index
          .filter(i => i.published !== false)
          .map(i => getItem(type, i.slug || i))
      );
      return items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (err) {
      console.error(`[FETCH] getAll(${type}) error:`, err);
      return [];
    }
  }

  /* ── Public: Get Featured ───────────────────────────────── */
  async function getFeatured(type, limit = 3) {
    const all = await getAll(type);
    return all.filter(i => i.featured).slice(0, limit);
  }

  /* ── Public: Get Related ────────────────────────────────── */
  async function getRelated(type, current, limit = 3) {
    const all = await getAll(type);
    return all
      .filter(i =>
        i.slug !== current.slug &&
        (i.category === current.category ||
         i.tags.some(t => current.tags.includes(t)))
      )
      .slice(0, limit);
  }

  /* ── Public: Search ─────────────────────────────────────── */
  async function search(query, types = ['articles', 'opinions', 'news']) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results = await Promise.all(
      types.map(async type => {
        const items = await getAll(type);
        return items
          .filter(i => {
            const titleEn  = (i.title.en  || '').toLowerCase();
            const titleId  = (i.title.id  || '').toLowerCase();
            const excerptEn = (i.excerpt.en || '').toLowerCase();
            const excerptId = (i.excerpt.id || '').toLowerCase();
            const tags     = i.tags.join(' ').toLowerCase();
            const cat      = (i.category  || '').toLowerCase();
            return (
              titleEn.includes(q)   ||
              titleId.includes(q)   ||
              excerptEn.includes(q) ||
              excerptId.includes(q) ||
              tags.includes(q)      ||
              cat.includes(q)
            );
          })
          .map(i => ({ ...i, _type: type }));
      })
    );

    return results.flat();
  }

  /* ── Public: Get Profile ────────────────────────────────── */
  async function getProfile() {
    const url = CONFIG.data.profile;
    return await _get(url);
  }

  /* ── Clear Cache ────────────────────────────────────────── */
  function clearCache() {
    _cache.clear();
    console.log('[FETCH] cache cleared');
  }

  /* ── Public API ─────────────────────────────────────────── */
  return {
    getIndex,
    getItem,
    getAll,
    getFeatured,
    getRelated,
    search,
    getProfile,
    clearCache,
  };

})();

/* ── Export ──────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = FETCH;