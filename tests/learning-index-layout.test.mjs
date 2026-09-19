import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../ai-learning-index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../assets/learning-index.css', import.meta.url), 'utf8');

assert.doesNotMatch(
  html,
  /class="index-mark"/,
  'the compact learning-index header must not contain the decorative index graphic',
);

const hero = html.match(/<header class="hero page-shell">([\s\S]*?)<\/header>/)?.[1] ?? '';
assert.match(hero, /<div class="hero-title">/);
assert.match(hero, /<h1>AI 学习索引<\/h1>/);
assert.doesNotMatch(hero, /<br\s*\/?>/);
assert.match(hero, /<p class="intro">[^<]+<\/p>/);

assert.match(
  css,
  /\.page-shell\{width:calc\(100% - clamp\(24px,3vw,64px\)\);margin-inline:auto\}/,
  'content must use the same fluid viewport gutters as the other pages',
);
assert.match(css, /\.resource-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:1200px\)[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:850px\)[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.resource-grid\{grid-template-columns:1fr\}/);

console.log('learning-index compact and responsive layout: ok');
