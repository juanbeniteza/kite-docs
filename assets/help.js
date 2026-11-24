'use strict';
const settings = document.currentScript;
const base = settings.dataset.base;
const searchURL = settings.dataset.search;
for (const code of document.querySelectorAll('pre code')) {
  const actions = document.createElement('div'); actions.className = 'code-actions';
  const button = document.createElement('button'); button.type = 'button'; button.className = 'copy'; button.textContent = 'Copy code';
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(code.textContent); button.textContent = 'Copied'; }
    catch { button.textContent = 'Select code to copy'; const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
    setTimeout(() => { button.textContent = 'Copy code'; }, 2000);
  });
  actions.append(button); code.closest('pre').before(actions);
}
let index;
const search = document.getElementById('search'); const results = document.getElementById('results');
let revision = 0;
search.addEventListener('input', async () => {
  const current = ++revision; const query = search.value.trim().toLocaleLowerCase(); results.replaceChildren();
  if (!query) return;
  try {
    if (!index) { const response = await fetch(searchURL); if (!response.ok) throw Error('Search unavailable'); index = await response.json(); }
    if (revision !== current) return;
    const terms = query.split(/\s+/);
    const matches = index.filter(page => terms.every(term => (page.title + ' ' + page.text).toLocaleLowerCase().includes(term))).slice(0,12);
    if (!matches.length) results.textContent = 'No matches. Try a module or component name.';
    for (const page of matches) {
      const link = document.createElement('a'); link.href = base + page.url; link.textContent = page.title;
      const excerpt = document.createElement('small'); const position = page.text.toLocaleLowerCase().indexOf(terms[0]); excerpt.textContent = page.text.slice(Math.max(0,position-35),Math.max(0,position-35)+140).replace(/\s+/g,' ');
      link.append(excerpt); results.append(link);
    }
  } catch { if(revision === current) results.textContent = 'Search is unavailable. Use the navigation links below.'; }
});
