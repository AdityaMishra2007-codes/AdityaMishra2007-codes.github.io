document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('skills-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === 'light' ? 'Dark mode' : 'Light mode';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  }

  applyTheme(savedTheme || preferredTheme);

  themeToggle.addEventListener('click', () => {
    const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('skills-theme', nextTheme);
    applyTheme(nextTheme);
  });

  const cards = Array.from(document.querySelectorAll('.skill-card'));
  const titleEl = document.getElementById('detail-title');
  const descEl = document.getElementById('detail-description');
  const toolsEl = document.getElementById('tool-list');

  function updateDetail(card) {
    if (!card) return;
    const title = card.dataset.title || '';
    const desc = card.dataset.description || '';
    const tools = (card.dataset.tools || '').split(',').map(s => s.trim()).filter(Boolean);
    titleEl.textContent = title;
    descEl.textContent = desc;
    toolsEl.innerHTML = tools.map(t => `<span>${t}</span>`).join('');
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  }

  cards.forEach(card => {
    card.addEventListener('click', () => updateDetail(card));
  });

  // reveal cards and extra sections on scroll
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
  // reveal panel and any extra-section blocks
  const panel = document.querySelector('.skills-panel');
  if (panel) observer.observe(panel);
  document.querySelectorAll('.extra-section').forEach(s => observer.observe(s));

  // initialize detail from selected card (or first card)
  const initial = document.querySelector('.skill-card.selected') || cards[0];
  if (initial) updateDetail(initial);
});