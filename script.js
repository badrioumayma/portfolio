// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.setAttribute('data-theme', storedTheme);

themeToggle.addEventListener('click', () => {
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const current = root.getAttribute('data-theme') || (prefersLight ? 'light' : 'dark');
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

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach(sec => sectionObserver.observe(sec));

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
    { t: 'IBM AI Engineering Professional Certificate', i: 'Coursera · 13 courses', d: 'Jul 9, 2025', type: 'pro', label: 'AI Eng', link: 'certificates/ibm-ai-engineering.pdf', skills: ['Deep Learning', 'LLMs', 'Fine-Tuning', 'RAG', 'LangChain'] },
    { t: 'IBM Data Science Professional Certificate', i: 'Coursera · 12 courses', d: 'Mar 1, 2025', type: 'pro', label: 'Data Sci', link: 'certificates/ibm-data-science.pdf', skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'] },
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
    { t: 'Data Science Methodology', i: 'Coursera', d: 'Feb 6, 2025', type: 'cog', label: 'DS', skills: ['CRISP-DM', 'Problem Framing', 'Data Modeling'] },
    { t: 'Tools for Data Science V2', i: 'Coursera', d: 'Feb 26, 2025', type: 'ibm', label: 'Tools', img: 'img/badges/tools-ds.png', level: 'Intermediate', skills: ['Jupyter Notebook', 'GitHub', 'Data Science Tools', 'Model Building Tools'] },
    { t: 'Data Science Orientation', i: 'Coursera', d: 'Jan 29, 2025', type: 'cog', label: 'DS', img: 'img/badges/ds-orientation.png', level: 'Foundational', skills: ['Data Science', 'Machine Learning', 'AI'] },
    { t: 'Getting Started with Artificial Intelligence', i: 'IBM SkillsBuild', d: 'Dec 29, 2024', type: 'sb', label: 'AI', color: '#6fe0d6', img: 'img/badges/getting-started-ai.png', level: 'Foundational', skills: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Generative AI'] },
  ];

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const card = (b) => `
    <${b.link ? `a href="${b.link}" target="_blank" rel="noopener"` : 'div'} class="badge-card${b.type === 'pro' ? ' featured' : ''}">
      ${b.img
        ? `<img class="badge-img" src="${b.img}" alt="" loading="lazy" width="64" height="64">`
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
  wall.innerHTML = `<div class="badges-track" style="--dur:${badges.length * 5}s">${html}${html.replace(/class="badge-card/g, 'aria-hidden="true" tabindex="-1" class="badge-card')}</div>`;
})();
