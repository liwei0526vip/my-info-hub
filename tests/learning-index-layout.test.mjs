import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../ai-learning-index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../assets/learning-index.css', import.meta.url), 'utf8');
const siteCss = await readFile(new URL('../assets/site-nav.css', import.meta.url), 'utf8');

const js = await readFile(new URL('../assets/learning-index.js', import.meta.url), 'utf8');

const toolsGroup = html.match(/<section class="resource-group" data-group="tools"[\s\S]*?<\/section>/)?.[0] ?? '';
const workflowGroup = html.match(/<section class="resource-group" data-group="workflow"[\s\S]*?<\/section>/)?.[0] ?? '';
const agentGroup = html.match(/<section class="resource-group" data-group="agent"[\s\S]*?<\/section>/)?.[0] ?? '';
const readingGroup = html.match(/<section class="resource-group" data-group="reading"[\s\S]*?<\/section>/)?.[0] ?? '';

assert.match(toolsGroup, /href="https:\/\/github\.com\/tw93\/Kaku"/);
assert.match(toolsGroup, /href="https:\/\/github\.com\/tw93\/Mole"/);
assert.match(workflowGroup, /href="https:\/\/github\.com\/tw93\/Waza"/);
assert.match(workflowGroup, /href="https:\/\/github\.com\/tw93\/Kami"/);
assert.match(readingGroup, /href="https:\/\/github\.com\/tw93\/Weekly"/);
assert.match(toolsGroup, /<h2 id="heading-tools">编程工具<\/h2>\s*<span>7<\/span>/);
assert.match(agentGroup, /<h2 id="heading-agent">Agent \/ Harness<\/h2>\s*<span>6<\/span>/);
assert.match(readingGroup, /<h2 id="heading-reading">基础文章<\/h2>\s*<span>8<\/span>/);
assert.match(html, /id="result-count"[^>]*>31 项<\/p>/);

assert.doesNotMatch(
  html,
  /class="index-mark"/,
  'the compact learning-index header must not contain the decorative index graphic',
);

const hero = html.match(/<header class="hero page-shell">([\s\S]*?)<\/header>/)?.[1] ?? '';
assert.match(hero, /<div class="hero-title">/);
assert.match(hero, /<h1>收藏<\/h1>/);
assert.doesNotMatch(hero, /<br\s*\/?>/);
assert.match(hero, /<p class="intro">[^<]+<\/p>/);

assert.equal(html.match(/data-category=/g)?.length, 31, 'all 31 collected entries carry data-category');
assert.ok(html.match(/<nav class="collection-directory"/g)?.length === 4, 'four groups render as directory navs');

assert.match(js, /querySelectorAll\('\.collection-directory a'\)/, 'filtering must target directory cells');
assert.match(js, /\.collection-directory a:not\(\[hidden\]\)/, 'group counts must count visible cells');
assert.match(js, /cell-pad/, 'layout must append placeholder cells to complete the last row');
assert.match(js, /cell-col-first[\s\S]*cell-row-first/, 'cells get grid position classes for dividers');

assert.match(
  siteCss,
  /\.shell,\.page-shell,\.site-inner\{width:calc\(100% - var\(--site-gutter\)\);max-width:none;margin-inline:auto\}/,
  'content must use the shared site shell and fluid viewport gutters',
);
assert.match(css, /\.collection-directory\{--nav-accent:var\(--blue\);display:grid;grid-template-columns:repeat\(6,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:1019px\)[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
assert.match(css, /@media\(max-width:679px\)[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css, /\.collection-directory a\[hidden\]\{display:none\}/);
assert.match(css, /\.collection-directory \.cell-pad\{background:repeating-linear-gradient/);

console.log('learning-index directory layout: ok');
