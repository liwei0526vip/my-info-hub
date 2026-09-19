import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../ai-learning-index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../assets/learning-index.css', import.meta.url), 'utf8');
const siteCss = await readFile(new URL('../assets/site-nav.css', import.meta.url), 'utf8');

const toolsGroup = html.match(/<section class="resource-group" data-group="tools"[\s\S]*?<\/section>/)?.[0] ?? '';
const workflowGroup = html.match(/<section class="resource-group" data-group="workflow"[\s\S]*?<\/section>/)?.[0] ?? '';

assert.match(toolsGroup, /href="https:\/\/github\.com\/tw93\/Kaku"/);
assert.match(workflowGroup, /href="https:\/\/github\.com\/tw93\/Waza"/);
assert.match(workflowGroup, /href="https:\/\/github\.com\/tw93\/Kami"/);
assert.match(html, /id="result-count"[^>]*>22 项<\/p>/);

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
  siteCss,
  /\.shell,\.page-shell,\.site-inner\{width:calc\(100% - var\(--site-gutter\)\);max-width:none;margin-inline:auto\}/,
  'content must use the shared site shell and fluid viewport gutters',
);
assert.match(css, /\.resource-grid\{display:grid;grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:1200px\)[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:850px\)[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.resource-grid\{grid-template-columns:1fr\}/);

console.log('learning-index compact and responsive layout: ok');
