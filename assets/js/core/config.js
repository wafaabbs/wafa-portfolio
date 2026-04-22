/* ============================================================
   CONFIG — Wafa Abbas Portfolio
   Updated: Compatible with Netlify CMS
   ============================================================ */

const CONFIG = {

  /* ── Site ─────────────────────────────────────────────── */
  site: {
    name:        'Wafa Abbas',
    fullName:    'Wafa Abdullah Faqih Abbas, S.E.',
    title:       'Finance, Tax & Accounting Specialist',
    description: 'Finance & Accounting professional with cross-industry experience in manufacturing, tax consulting, and retail.',
    url:         'https://wafaabbs.github.io',
    baseUrl:     '/wafa-portfolio',
    lang:        'en',
    locale:      'en-US',
  },

  /* ── Navigation ───────────────────────────────────────── */
  nav: {
    height: 70,
    links: [
      { href: '/index.html',    labelEn: 'Home',     labelId: 'Beranda' },
      { href: '/about.html',    labelEn: 'About',    labelId: 'Tentang' },
      { href: '/articles.html', labelEn: 'Articles', labelId: 'Artikel' },
      { href: '/opinions.html', labelEn: 'Opinions', labelId: 'Opini'   },
      { href: '/news.html',     labelEn: 'News',     labelId: 'Berita'  },
    ],
  },

  /* ── Data Paths ───────────────────────────────────────── */
  data: {
    profile:  '/assets/data/profile.json',
    articles: '/assets/data/articles/',
    opinions: '/assets/data/opinions/',
    news:     '/assets/data/news/',
    manifest: {
      articles: '/assets/data/articles/index.json',
      opinions: '/assets/data/opinions/index.json',
      news:     '/assets/data/news/index.json',
    },
  },

  /* ── Pagination ───────────────────────────────────────── */
  pagination: {
    articlesPerPage: 9,
    opinionsPerPage: 9,
    newsPerPage:     9,
    searchPerPage:   10,
  },

  /* ── Content ──────────────────────────────────────────── */
  content: {
    excerptLength: 160,
    readTimeWPM:   200,
    featuredCount: 3,
    relatedCount:  3,
    recentCount:   5,
  },

  /* ── Assets ───────────────────────────────────────────── */
  assets: {
    photo:   '/assets/img/profile/wafa-photo.jpg',
    cv:      '/assets/files/wafa-cv.pdf',
    ogImage: '/assets/img/og/og-default.jpg',
    favicon: '/assets/img/icons/favicon.ico',
    uploads: '/assets/img/uploads/',
  },

  /* ── Social ───────────────────────────────────────────── */
  social: {
    email:    'alfaqihabbas@gmail.com',
    phone:    '082330610780',
    whatsapp: 'https://wa.me/6282330610780',
    linkedin: 'https://linkedin.com/in/wafaabbs/',
  },

  /* ── Categories ───────────────────────────────────────── */
  categories: {
    articles: [
      { slug: 'finance',     labelEn: 'Finance',     labelId: 'Keuangan',   color: 'blue'   },
      { slug: 'accounting',  labelEn: 'Accounting',  labelId: 'Akuntansi',  color: 'green'  },
      { slug: 'taxation',    labelEn: 'Taxation',    labelId: 'Perpajakan', color: 'yellow' },
      { slug: 'business',    labelEn: 'Business',    labelId: 'Bisnis',     color: 'purple' },
      { slug: 'digital',     labelEn: 'Digital',     labelId: 'Digital',    color: 'pink'   },
    ],
    opinions: [
      { slug: 'economy',     labelEn: 'Economy',     labelId: 'Ekonomi',    color: 'blue'   },
      { slug: 'policy',      labelEn: 'Policy',      labelId: 'Kebijakan',  color: 'yellow' },
      { slug: 'technology',  labelEn: 'Technology',  labelId: 'Teknologi',  color: 'purple' },
      { slug: 'career',      labelEn: 'Career',      labelId: 'Karir',      color: 'green'  },
      { slug: 'personal',    labelEn: 'Personal',    labelId: 'Personal',   color: 'pink'   },
    ],
    news: [
      { slug: 'achievement', labelEn: 'Achievement', labelId: 'Prestasi',   color: 'yellow' },
      { slug: 'career',      labelEn: 'Career',      labelId: 'Karir',      color: 'green'  },
      { slug: 'event',       labelEn: 'Event',        labelId: 'Acara',      color: 'blue'   },
      { slug: 'publication', labelEn: 'Publication', labelId: 'Publikasi',  color: 'purple' },
    ],
  },

  /* ── SEO ──────────────────────────────────────────────── */
  seo: {
    titleSeparator: ' — ',
    titleSuffix:    'Wafa Abbas',
    defaultDesc:    'Finance & Accounting professional with cross-industry experience.',
    twitterHandle:  '@wafaabbs',
  },

  /* ── Features ─────────────────────────────────────────── */
  features: {
    darkMode:    false,
    langSwitch:  true,
    search:      true,
    comments:    false,
    newsletter:  false,
    analytics:   false,
    analyticsId: '',
  },

  /* ── Date Format ──────────────────────────────────────── */
  date: {
    localeEn: 'en-US',
    localeId: 'id-ID',
    options: {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    },
  },

};

/* ── Freeze ────────────────────────────────────────────────── */
Object.freeze(CONFIG);
Object.freeze(CONFIG.site);
Object.freeze(CONFIG.nav);
Object.freeze(CONFIG.data);
Object.freeze(CONFIG.data.manifest);
Object.freeze(CONFIG.pagination);
Object.freeze(CONFIG.content);
Object.freeze(CONFIG.assets);
Object.freeze(CONFIG.social);
Object.freeze(CONFIG.categories);
Object.freeze(CONFIG.seo);
Object.freeze(CONFIG.features);
Object.freeze(CONFIG.date);

/* ── Export ────────────────────────────────────────────────── */
if (typeof module !== 'undefined') module.exports = CONFIG;