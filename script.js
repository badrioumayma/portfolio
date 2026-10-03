// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.setAttribute('data-theme', storedTheme);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// Mobile nav
const navBurger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
navBurger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navBurger.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// Stacked pages: each section pins while the next one slides over it
const pages = [...document.querySelectorAll('.page')];
const navLinkEls = document.querySelectorAll('.nav-link');
// zero-height markers keep each page's natural (un-pinned) position for navigation
const anchors = pages.map(p => {
  const m = document.createElement('span');
  m.className = 'page-anchor';
  p.before(m);
  return m;
});
const pageTop = (i) => anchors[i].getBoundingClientRect().top + window.scrollY;

const dots = document.createElement('nav');
dots.className = 'page-dots';
dots.setAttribute('aria-label', 'Pages');
dots.innerHTML = pages.map((p) =>
  `<button type="button" aria-label="${p.dataset.title}"><span>${p.dataset.title}</span></button>`
).join('') + '<div class="page-counter"></div>';
document.body.appendChild(dots);
const dotBtns = [...dots.querySelectorAll('button')];
const counter = dots.querySelector('.page-counter');

const goTo = (i) => window.scrollTo({ top: pageTop(i), behavior: 'smooth' });
dotBtns.forEach((btn, i) => btn.addEventListener('click', () => goTo(i)));
document.querySelectorAll('a[href^="#"]').forEach(link => {
  const i = pages.findIndex(p => p.dataset.page === link.getAttribute('href').slice(1));
  if (i === -1) return;
  link.addEventListener('click', (e) => { e.preventDefault(); goTo(i); });
});

const layoutPages = () => {
  pages.forEach(p => p.style.setProperty('--stick', `${Math.min(0, window.innerHeight - p.offsetHeight)}px`));
};

let ticking = false;
const updatePages = () => {
  ticking = false;
  const vh = window.innerHeight;
  let current = 0;
  pages.forEach((p, i) => {
    if (pageTop(i) <= window.scrollY + vh * 0.5) current = i;
    const next = pages[i + 1];
    if (!next) return;
    // 0 while the next page is below the fold, 1 once it fully covers this one
    const progress = Math.min(Math.max(1 - next.getBoundingClientRect().top / vh, 0), 1);
    p.style.setProperty('--dim', (progress * 0.35).toFixed(3));
    p.style.setProperty('--shrink', (1 - progress * 0.06).toFixed(4));
  });
  dotBtns.forEach((b, i) => b.classList.toggle('active', i === current));
  counter.textContent = `${current + 1} / ${pages.length}`;
  const id = pages[current].dataset.page;
  navLinkEls.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
};
const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(updatePages); } };

layoutPages();
updatePages();
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => { layoutPages(); requestUpdate(); });
window.addEventListener('load', () => { layoutPages(); requestUpdate(); });
new ResizeObserver(() => { layoutPages(); requestUpdate(); }).observe(document.querySelector('main'));

// Typewriter effect
const roles = [
  'Machine Learning Engineer',
  'NLP & LLM Fine-Tuning',
  'Cyber Threat Intelligence',
  'Full-Stack Developer'
];
const typewriterEl = document.getElementById('typewriter');
let roleIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typewriterEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 70);
}
typeLoop();

// ---------- Digital badges wall (vertical marquee) ----------
(() => {
  const wall = document.getElementById('badges-wall');
  if (!wall) return;

  // type: ibm (orange ring), cog (Cognitive Class, green), cap (capstone, gold), sb (IBM SkillsBuild), aws
  // Ordered by priority: professional certificates → capstones → GenAI/LLMs → deep learning → ML → data → foundations.
  // Columns are filled round-robin, so the first items land at the top of each column.
  const badges = [
    { t: 'AI Capstone Project with Deep Learning', i: 'Coursera', d: 'May 28, 2025', type: 'cap', label: 'Capstone', img: 'img/badges/ai-capstone.png', level: 'Advanced', skills: ['Deep Learning', 'Deep Neural Networks', 'PyTorch'] },
    { t: 'Applied Data Science Capstone', i: 'Coursera', d: 'Feb 25, 2025', type: 'cap', label: 'Capstone', img: 'img/badges/ds-capstone.png', level: 'Advanced', skills: ['Data Collection', 'Data Wrangling', 'EDA', 'Data Visualization'] },
    { t: 'Generative AI Advanced Fine-Tuning for LLMs', i: 'Coursera', d: 'Jul 7, 2025', type: 'ibm', label: 'GenAI', img: 'img/badges/genai-finetuning.png', level: 'Intermediate', skills: ['Instruction-Tuning', 'DPO', 'PPO', 'Reinforcement Learning', 'Hugging Face'] },
    { t: 'Generative AI Language Modeling with Transformers', i: 'Coursera', d: 'Jul 7, 2025', type: 'ibm', label: 'GenAI', img: 'img/badges/genai-transformers.png', level: 'Intermediate', skills: ['GPT', 'LLMs', 'NLP', 'Language Translation', 'Generative AI'] },
    { t: 'Generative AI Foundational Models for NLP & Language Understanding', i: 'Coursera', d: 'May 31, 2025', type: 'ibm', label: 'NLP', img: 'img/badges/genai-nlp.png', level: 'Intermediate', skills: ['Generative AI for NLP', 'Seq2Seq', 'Word2Vec', 'N-Gram', 'Torchtext'] },
    { t: 'Generative AI and LLMs: Architecture and Data Preparation', i: 'Coursera', d: 'May 29, 2025', type: 'ibm', label: 'GenAI', img: 'img/badges/genai-architecture.png', level: 'Intermediate', skills: ['LLMs', 'Tokenization', 'NLP Data Loader', 'Hugging Face', 'PyTorch'] },
    { t: 'Generative AI in Action', i: 'IBM SkillsBuild', d: 'Dec 29, 2024', type: 'sb', label: 'GenAI', color: '#7cc4ff', img: 'img/badges/genai-action.png', level: 'Advanced', skills: ['Prompt Engineering', 'Foundation Models', 'Transformers', 'Tokenization', 'Sentiment Analysis'] },
    { t: 'Deep Learning with PyTorch', i: 'Coursera', d: 'May 27, 2025', type: 'ibm', label: 'DL', img: 'img/badges/dl-pytorch.png', level: 'Intermediate', skills: ['PyTorch', 'CNNs', 'Neural Networks', 'Activation Functions', 'Softmax Regression'] },
    { t: 'Machine Learning with Python (V2)', i: 'Coursera', d: 'Feb 25, 2025', type: 'ibm', label: 'ML', img: 'img/badges/ml-python.png', level: 'Intermediate', skills: ['Scikit-learn', 'Classification', 'Regression', 'Clustering', 'Decision Trees'] },
    { t: 'AWS Educate Machine Learning Foundations', i: 'Amazon Web Services', d: 'Jun 5, 2025', type: 'aws', label: 'AWS', img: 'img/badges/aws-ml.png', skills: ['AWS Cloud', 'ML'] },
    { t: 'Data Analysis with Python', i: 'Coursera', d: 'Feb 26, 2025', type: 'ibm', label: 'Data', img: 'img/badges/data-analysis.png', level: 'Intermediate', skills: ['Pandas', 'NumPy', 'SciPy', 'Scikit-learn'] },
    { t: 'Data Visualization with Python', i: 'Coursera', d: 'Feb 5, 2025', type: 'ibm', label: 'Viz', img: 'img/badges/data-viz.png', level: 'Intermediate', skills: ['Matplotlib', 'Seaborn', 'Folium', 'Jupyter Notebook'] },
    { t: 'Artificial Intelligence Fundamentals', i: 'IBM SkillsBuild', d: 'Dec 27, 2024', type: 'sb', label: 'AI', color: '#ff8fb8', img: 'img/badges/ai-fundamentals.png', level: 'Intermediate', skills: ['Machine Learning', 'NLP', 'Computer Vision', 'AI Ethics'] },
    { t: 'Data Science Methodology', i: 'Coursera', d: 'Feb 6, 2025', type: 'cog', label: 'DS', img: 'img/badges/ds-methodology.png', level: 'Foundational', skills: ['Data Science Methodology', 'Jupyter Notebook'] },
    { t: 'Tools for Data Science V2', i: 'Coursera', d: 'Feb 26, 2025', type: 'ibm', label: 'Tools', img: 'img/badges/tools-ds.png', level: 'Intermediate', skills: ['Jupyter Notebook', 'GitHub', 'Data Science Tools', 'Model Building Tools'] },
    { t: 'Data Science Orientation', i: 'Coursera', d: 'Jan 29, 2025', type: 'cog', label: 'DS', img: 'img/badges/ds-orientation.png', level: 'Foundational', skills: ['Data Science', 'Machine Learning', 'AI'] },
    { t: 'Getting Started with Artificial Intelligence', i: 'IBM SkillsBuild', d: 'Dec 29, 2024', type: 'sb', label: 'AI', color: '#6fe0d6', img: 'img/badges/getting-started-ai.png', level: 'Foundational', skills: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Generative AI'] },
  ];

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const card = (b) => `
    <${b.link ? `a href="${b.link}" target="_blank" rel="noopener"` : 'div'} class="badge-card${b.type === 'pro' ? ' featured' : ''}">
      ${b.img
        ? `<img class="badge-img" src="${b.img}" alt="" loading="lazy" width="170" height="170">`
        : `<div class="badge-icon ${b.type}"${b.color ? ` style="--sb:${b.color}"` : ''}>
        <span>${b.type === 'aws' ? 'aws' : 'IBM'}<small>${esc(b.label)}</small></span>
      </div>`}
      <div>
        <h4>${esc(b.t)}</h4><p>${esc(b.i)} · ${b.d}${b.level ? ` · ${b.level}` : ''}</p>
        ${b.skills ? `<ul class="badge-skills">${b.skills.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
      </div>
    </${b.link ? 'a' : 'div'}>`;

  const countEl = document.getElementById('badges-count');
  if (countEl) countEl.textContent = `${badges.length} earned`;

  // One full-width row, ordered by priority; content is duplicated so the loop is seamless.
  const html = badges.map(card).join('');
  wall.innerHTML = `<div class="badges-track">${html}${html.replace(/class="badge-card/g, 'aria-hidden="true" tabindex="-1" class="badge-card')}</div>`;
  const track = wall.firstElementChild;

  // JS-driven marquee: drifts at BASE px/s, and dragging, flicking, sideways
  // wheel or the arrow buttons add velocity that eases back to BASE.
  const BASE = 45;
  let offset = 0, velocity = BASE, half = 0, last = performance.now();
  let dragging = false, dragX = 0, dragT = 0, moved = 0, hovering = false;
  const measure = () => { half = track.scrollWidth / 2 + 9; };
  measure();
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);

  const tick = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!dragging) {
      const target = hovering ? 0 : BASE;
      velocity += (target - velocity) * Math.min(dt * 2.5, 1);
      offset += velocity * dt;
    }
    if (half) offset = ((offset % half) + half) % half;
    track.style.transform = `translateX(${-offset}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  wall.addEventListener('mouseenter', () => { hovering = true; });
  wall.addEventListener('mouseleave', () => { hovering = false; });

  wall.addEventListener('pointerdown', (e) => {
    dragging = true; moved = 0; dragX = e.clientX; dragT = performance.now(); velocity = 0;
    wall.classList.add('dragging');
    wall.setPointerCapture(e.pointerId);
  });
  wall.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragX, now = performance.now();
    offset -= dx;
    moved += Math.abs(dx);
    velocity = -dx / Math.max((now - dragT) / 1000, 0.008);
    dragX = e.clientX; dragT = now;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    wall.classList.remove('dragging');
    if (performance.now() - dragT > 80) velocity = 0; // held still before release: no fling
    velocity = Math.max(-4000, Math.min(4000, velocity));
  };
  wall.addEventListener('pointerup', endDrag);
  wall.addEventListener('pointercancel', endDrag);
  // a drag shouldn't count as a click on a certificate link
  wall.addEventListener('click', (e) => { if (moved > 6) e.preventDefault(); }, true);

  // sideways trackpad swipe or shift + wheel; plain vertical wheel still scrolls the page
  wall.addEventListener('wheel', (e) => {
    const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0);
    if (!dx) return;
    e.preventDefault();
    offset += dx;
  }, { passive: false });

  document.getElementById('badges-next')?.addEventListener('click', () => { velocity = 1600; });
  document.getElementById('badges-prev')?.addEventListener('click', () => { velocity = -1600; });
})();
