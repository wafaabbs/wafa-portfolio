/* ============================================================
   ABOUT PAGE — Wafa Abbas Portfolio
   Handles: profile, skills, experience, certifications,
            education, organization, achievements
   ============================================================ */

const AboutPage = (() => {

  /* ── State ──────────────────────────────────────────────── */
  let _profile = null;

  /* ── DOM Helpers ────────────────────────────────────────── */
  const $  = (id)  => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ── Init ───────────────────────────────────────────────── */
  async function init() {
    try {
      await _loadData();
      _renderHero();
      _renderAbout();
      _renderSkills();
      _renderExperience();
      _renderCertifications();
      _renderEducation();
      _renderOrganization();
      _renderAchievements();
      _renderContact();
      _initScrollReveal();
      _initSkillBars();
      console.log('[AboutPage] initialized');
    } catch (err) {
      console.error('[AboutPage]', err);
    }
  }

  /* ── Load Data ──────────────────────────────────────────── */
  async function _loadData() {
    _profile = await Fetch.json(CONFIG.data.profile);
  }

  /* ── Render Hero ────────────────────────────────────────── */
  function _renderHero() {
    const lang = Lang.get();
    const el   = $('about-hero');
    if (!el || !_profile) return;

    const { meta, contact } = _profile;

    el.innerHTML = `
      <div class="about-hero__content reveal-left">
        <span class="section-label">
          <span class="lang-en">About Me</span>
          <span class="lang-id">Tentang Saya</span>
        </span>
        <h1 class="about-hero__name">
          ${meta.name}
          <span class="about-hero__suffix">${meta.suffix}</span>
        </h1>
        <p class="about-hero__title">
          <span class="lang-en">${meta.title.en}</span>
          <span class="lang-id">${meta.title.id}</span>
        </p>
        <p class="about-hero__location">
          <i class="fa fa-map-marker-alt"></i>
          ${contact.location}
        </p>
        <div class="about-hero__btns">
          <a href="${CONFIG.assets.cv}"
             class="btn btn--primary"
             download>
            <i class="fa fa-download"></i>
            <span class="lang-en">Download CV</span>
            <span class="lang-id">Unduh CV</span>
          </a>
          <a href="mailto:${contact.email}"
             class="btn btn--outline">
            <i class="fa fa-envelope"></i>
            <span class="lang-en">Email Me</span>
            <span class="lang-id">Email Saya</span>
          </a>
        </div>
      </div>
      <div class="about-hero__photo reveal-right">
        <div class="about-hero__frame">
          <img
            src="${CONFIG.assets.photo}"
            alt="${meta.name}"
            class="about-hero__img"
            loading="eager"
          />
          <div class="about-hero__badge">
            <i class="fa fa-certificate"></i>
            <span>Brevet A & B</span>
          </div>
        </div>
      </div>
    `;

    Lang.apply();
  }

  /* ── Render About ───────────────────────────────────────── */
  function _renderAbout() {
    const el = $('about-content');
    if (!el || !_profile) return;

    const { about, contact } = _profile;

    el.innerHTML = `
      <div class="about-text reveal-left">
        <p class="lang-en">${about.bioEn}</p>
        <p class="lang-id">${about.bioId}</p>
        <p class="lang-en">${about.bio2En}</p>
        <p class="lang-id">${about.bio2Id}</p>

        <div class="about-info-list">
          <div class="about-info-item">
            <div class="about-info-item__icon">
              <i class="fa fa-map-marker-alt"></i>
            </div>
            <div>
              <div class="about-info-item__label lang-en">Location</div>
              <div class="about-info-item__label lang-id">Lokasi</div>
              <div class="about-info-item__value">${contact.location}</div>
            </div>
          </div>
          <div class="about-info-item">
            <div class="about-info-item__icon">
              <i class="fa fa-envelope"></i>
            </div>
            <div>
              <div class="about-info-item__label">Email</div>
              <div class="about-info-item__value">
                <a href="mailto:${contact.email}">${contact.email}</a>
              </div>
            </div>
          </div>
          <div class="about-info-item">
            <div class="about-info-item__icon">
              <i class="fa fa-phone"></i>
            </div>
            <div>
              <div class="about-info-item__label lang-en">Phone</div>
              <div class="about-info-item__label lang-id">Telepon</div>
              <div class="about-info-item__value">${contact.phone}</div>
            </div>
          </div>
          <div class="about-info-item">
            <div class="about-info-item__icon">
              <i class="fab fa-linkedin"></i>
            </div>
            <div>
              <div class="about-info-item__label">LinkedIn</div>
              <div class="about-info-item__value">
                <a href="${contact.linkedin}" target="_blank">
                  ${contact.linkedin.replace('https://','')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="about-highlights reveal-right">
        ${about.highlights.map(h => `
          <div class="about-highlight-card">
            <div class="about-highlight-card__icon">
              <i class="${h.icon}"></i>
            </div>
            <div>
              <h4 class="lang-en">${h.titleEn}</h4>
              <h4 class="lang-id">${h.titleId}</h4>
              <p class="lang-en">${h.descEn}</p>
              <p class="lang-id">${h.descId}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    Lang.apply();
  }

  /* ── Render Skills ──────────────────────────────────────── */
  function _renderSkills() {
    const el = $('skills-content');
    if (!el || !_profile) return;

    const { skills } = _profile;

    el.innerHTML = `
      <div class="skills-wrapper">

        <!-- Finance & Accounting -->
        <div class="skill-category reveal">
          <div class="skill-cat-title">
            <i class="fa fa-calculator"></i>
            <span class="lang-en">Finance & Accounting</span>
            <span class="lang-id">Keuangan & Akuntansi</span>
          </div>
          ${skills.finance.map(s => `
            <div class="skill-item">
              <div class="skill-row">
                <span class="skill-name lang-en">${s.nameEn}</span>
                <span class="skill-name lang-id">${s.nameId}</span>
                <span class="skill-pct">${s.pct}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-bar__fill" data-pct="${s.pct}"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Software & Tools -->
        <div class="skill-category reveal">
          <div class="skill-cat-title">
            <i class="fa fa-laptop-code"></i>
            <span class="lang-en">Software & Tools</span>
            <span class="lang-id">Perangkat Lunak</span>
          </div>
          ${skills.software.map(s => `
            <div class="skill-item">
              <div class="skill-row">
                <span class="skill-name">${s.name}</span>
                <span class="skill-pct">${s.pct}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-bar__fill" data-pct="${s.pct}"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Soft Skills -->
        <div class="skill-category reveal">
          <div class="skill-cat-title">
            <i class="fa fa-users"></i>
            <span class="lang-en">Soft Skills</span>
            <span class="lang-id">Soft Skills</span>
          </div>
          <div class="tags-wrap">
            ${skills.soft.map(s => `
              <span class="tag">
                <i class="${s.icon}"></i>
                <span class="lang-en">${s.nameEn}</span>
                <span class="lang-id">${s.nameId}</span>
              </span>
            `).join('')}
          </div>

          <div class="skill-cat-title" style="margin-top:28px">
            <i class="fa fa-heart"></i>
            <span class="lang-en">Interests</span>
            <span class="lang-id">Ketertarikan</span>
          </div>
          <div class="tags-wrap">
            ${skills.interests.map(s => `
              <span class="tag tag--accent">
                <i class="${s.icon}"></i>
                <span class="lang-en">${s.nameEn}</span>
                <span class="lang-id">${s.nameId}</span>
              </span>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    Lang.apply();
  }

  /* ── Render Experience ──────────────────────────────────── */
  function _renderExperience() {
    const el = $('experience-content');
    if (!el || !_profile) return;

    const { experience } = _profile;

    el.innerHTML = `
      <div class="timeline">
        ${experience.map((exp, i) => `
          <div class="timeline-item reveal">
            <div class="timeline-dot ${i === 0 ? 'timeline-dot--current' : ''}"></div>
            <div class="exp-card">
              <div class="exp-card__header">
                <div>
                  <div class="exp-card__role lang-en">${exp.roleEn}</div>
                  <div class="exp-card__role lang-id">${exp.roleId}</div>
                  <div class="exp-card__company">${exp.company}</div>
                  <div class="exp-card__location">
                    <i class="fa fa-map-marker-alt"></i>
                    ${exp.location}
                  </div>
                </div>
                <div>
                  <span class="exp-card__period">
                    <i class="fa fa-calendar"></i>
                    ${exp.periodEn}
                  </span>
                  ${i === 0 ? `
                    <span class="badge lang-en">Current</span>
                    <span class="badge lang-id">Saat Ini</span>
                  ` : ''}
                </div>
              </div>
              <ul class="exp-card__bullets">
                ${exp.bullets.map(b => `
                  <li class="lang-en">${b.en}</li>
                  <li class="lang-id">${b.id}</li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    Lang.apply();
  }

  /* ── Render Certifications ──────────────────────────────── */
  function _renderCertifications() {
    const el = $('cert-content');
    if (!el || !_profile) return;

    const { certifications } = _profile;

    el.innerHTML = `
      <div class="cert-grid">
        ${certifications.map(cert => `
          <div class="cert-card reveal">
            <div class="cert-card__icon">
              <i class="${cert.icon}"></i>
            </div>
            <div>
              <div class="cert-card__title lang-en">${cert.titleEn}</div>
              <div class="cert-card__title lang-id">${cert.titleId}</div>
              <div class="cert-card__issuer">${cert.issuer}</div>
              <div class="cert-card__period">
                <i class="fa fa-calendar"></i>
                ${cert.period}
              </div>
              <div class="cert-card__desc lang-en">${cert.descEn}</div>
              <div class="cert-card__desc lang-id">${cert.descId}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    Lang.apply();
  }

  /* ── Render Education ───────────────────────────────────── */
  function _renderEducation() {
    const el = $('edu-content');
    if (!el || !_profile) return;

    const { education } = _profile;

    el.innerHTML = `
      ${education.map(edu => `
        <div class="edu-card reveal">
          <div class="edu-card__icon">
            <i class="fa fa-graduation-cap"></i>
          </div>
          <div>
            <div class="edu-card__degree lang-en">${edu.degreeEn}</div>
            <div class="edu-card__degree lang-id">${edu.degreeId}</div>
            <div class="edu-card__school">${edu.school}</div>
            <div class="edu-card__meta">
              <span><i class="fa fa-calendar"></i> ${edu.period}</span>
              <span><i class="fa fa-star"></i> GPA: ${edu.gpa}</span>
              <span><i class="fa fa-award"></i>
                <span class="lang-en">${edu.honorEn}</span>
                <span class="lang-id">${edu.honorId}</span>
              </span>
            </div>
            <ul class="edu-card__bullets">
              ${edu.bullets.map(b => `
                <li class="lang-en">${b.en}</li>
                <li class="lang-id">${b.id}</li>
              `).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    `;

    Lang.apply();
  }

  /* ── Render Organization ────────────────────────────────── */
  function _renderOrganization() {
    const el = $('org-content');
    if (!el || !_profile) return;

    const { organization } = _profile;

    el.innerHTML = `
      <div class="org-grid">
        ${organization.map(org => `
          <div class="org-card reveal">
            <div class="org-card__role lang-en">${org.roleEn}</div>
            <div class="org-card__role lang-id">${org.roleId}</div>
            <div class="org-card__name">${org.name}</div>
            <div class="org-card__period">
              <i class="fa fa-calendar"></i>
              ${org.period}
            </div>
            <div class="org-card__desc lang-en">${org.descEn}</div>
            <div class="org-card__desc lang-id">${org.descId}</div>
          </div>
        `).join('')}
      </div>
    `;

    Lang.apply();
  }

  /* ── Render Achievements ────────────────────────────────── */
  function _renderAchievements() {
    const el = $('ach-content');
    if (!el || !_profile) return;

    const { achievements } = _profile;

    el.innerHTML = `
      <div class="ach-grid">
        ${achievements.map(ach => `
          <div class="ach-card reveal">
            <div class="ach-card__icon">${ach.emoji}</div>
            <div class="ach-card__title lang-en">${ach.titleEn}</div>
            <div class="ach-card__title lang-id">${ach.titleId}</div>
            <div class="ach-card__desc lang-en">${ach.descEn}</div>
            <div class="ach-card__desc lang-id">${ach.descId}</div>
          </div>
        `).join('')}
      </div>
    `;

    Lang.apply();
  }

  /* ── Render Contact ─────────────────────────────────────── */
  function _renderContact() {
    const el = $('contact-content');
    if (!el || !_profile) return;

    const { contact } = _profile;

    el.innerHTML = `
      <div class="contact-wrapper">
        <div class="contact-intro reveal-left">
          <h3 class="lang-en">Open to New Opportunities</h3>
          <h3 class="lang-id">Terbuka untuk Peluang Baru</h3>
          <p class="lang-en">
            I am actively looking for new challenges in Finance, Accounting, and Tax roles.
            Whether you have a full-time position, freelance project, or just want to
            network — I'd love to hear from you!
          </p>
          <p class="lang-id">
            Saya aktif mencari tantangan baru di bidang Finance, Accounting, dan Tax.
            Baik itu posisi full-time, proyek freelance, maupun sekadar ingin bertukar
            jaringan — saya sangat terbuka untuk berdiskusi!
          </p>

          <div class="contact-items">
            <a href="mailto:${contact.email}" class="contact-item">
              <div class="contact-item__icon"><i class="fa fa-envelope"></i></div>
              <div>
                <div class="contact-item__label">Email</div>
                <div class="contact-item__value">${contact.email}</div>
              </div>
              <i class="fa fa-arrow-right contact-item__arrow"></i>
            </a>
            <a href="${contact.whatsapp}" target="_blank" class="contact-item">
              <div class="contact-item__icon"><i class="fa fa-phone"></i></div>
              <div>
                <div class="contact-item__label lang-en">Phone / WhatsApp</div>
                <div class="contact-item__label lang-id">Telepon / WhatsApp</div>
                <div class="contact-item__value">${contact.phone}</div>
              </div>
              <i class="fa fa-arrow-right contact-item__arrow"></i>
            </a>
            <a href="${contact.linkedin}" target="_blank" class="contact-item">
              <div class="contact-item__icon"><i class="fab fa-linkedin-in"></i></div>
              <div>
                <div class="contact-item__label">LinkedIn</div>
                <div class="contact-item__value">
                  ${contact.linkedin.replace('https://','')}
                </div>
              </div>
              <i class="fa fa-arrow-right contact-item__arrow"></i>
            </a>
            <div class="contact-item">
              <div class="contact-item__icon"><i class="fa fa-map-marker-alt"></i></div>
              <div>
                <div class="contact-item__label lang-en">Location</div>
                <div class="contact-item__label lang-id">Lokasi</div>
                <div class="contact-item__value">${contact.location}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-cta reveal-right">
          <div class="contact-cta__emoji">👋</div>
          <h4 class="lang-en">Ready to Work Together?</h4>
          <h4 class="lang-id">Siap Bekerja Sama?</h4>
          <p class="lang-en">
            Download my full CV to learn more about my experience,
            skills, and certifications.
          </p>
          <p class="lang-id">
            Unduh CV lengkap saya untuk mengetahui lebih lanjut tentang
            pengalaman, keahlian, dan sertifikasi saya.
          </p>
          <a href="${CONFIG.assets.cv}" class="btn btn--primary" download>
            <i class="fa fa-download"></i>
            <span class="lang-en">Download Full CV</span>
            <span class="lang-id">Unduh CV Lengkap</span>
          </a>
          <a href="${contact.linkedin}" target="_blank" class="btn btn--outline">
            <i class="fab fa-linkedin-in"></i>
            <span>LinkedIn Profile</span>
          </a>
        </div>
      </div>
    `;

    Lang.apply();
  }

  /* ── Scroll Reveal ──────────────────────────────────────── */
  function _initScrollReveal() {
    const els = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right'
    );

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  }

  /* ── Skill Bars ─────────────────────────────────────────── */
  function _initSkillBars() {
    const section = document.getElementById('skills');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar__fill').forEach(fill => {
            setTimeout(() => {
              fill.style.width = fill.dataset.pct + '%';
            }, 200);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(section);
  }

  /* ── Public API ─────────────────────────────────────────── */
  return { init };

})();

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => AboutPage.init());