const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

test('provides a responsive viewport and document language', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
});

test('provides a keyboard skip link targeting main content', () => {
  assert.match(html, /<a class="skip-link" href="#main-content">Skip to main content<\/a>/);
  assert.match(html, /id="main-content" tabindex="-1"/);
  assert.match(html, /\.skip-link:focus\{transform:translateY\(0\)\}/);
});

test('provides a main navigation landmark and one primary heading', () => {
  assert.match(html, /<nav aria-label="Main navigation">/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
});

test('external links opened in a new tab use noopener protection', () => {
  const links = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].map(match => match[0]);
  assert.ok(links.length > 0, 'expected at least one external link');
  for (const link of links) {
    assert.match(link, /rel="[^"]*noopener[^"]*"/, link);
  }
});

test('supports reduced-motion preferences', () => {
  assert.match(html, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
