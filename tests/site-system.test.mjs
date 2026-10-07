import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const pageNames = [
  'ai-agent-model-timeline.html',
  'ai-model-comparison.html',
  'ai-agent-comparison.html',
  'ai-knowledge-base.html',
  'ai-learning-index.html',
  'ops-agent.html',
  'market-memo.html',
  'life.html',
];

const pages = await Promise.all(
  pageNames.map(async name => [name, await readFile(new URL(name, root), 'utf8')]),
);
const siteNav = await readFile(new URL('assets/site-nav.js', root), 'utf8');

for (const [name, html] of pages) {
  assert.match(html, /<link rel="icon" href="assets\/site-mark\.svg">/, `${name} must expose the shared site mark as its favicon`);
  assert.match(html, /<link rel="stylesheet" href="assets\/site-nav\.css">/, `${name} must load the shared site shell`);
  assert.match(html, /<script src="assets\/site-nav\.js" defer><\/script>/, `${name} must load the shared site behavior`);
  assert.equal((html.match(/class="site-back-top"/g) ?? []).length, 1, `${name} must render one shared back-to-top control`);
  assert.equal((html.match(/href="#top"/g) ?? []).length, 1, `${name} must not duplicate the back-to-top control in its footer`);
}

assert.match(siteNav, /href: 'ai-knowledge-base\.html', label: '知识库'/);
assert.match(siteNav, /href: 'ai-learning-index\.html', label: '学习收藏'/);
assert.match(siteNav, /href: 'ops-agent\.html', label: '运维智能体'/);
assert.match(siteNav, /href: 'market-memo\.html', label: '随手记录'/);

const knowledgePage = pages.find(([name]) => name === 'ai-knowledge-base.html')[1];
const learningPage = pages.find(([name]) => name === 'ai-learning-index.html')[1];
const opsAgentPage = pages.find(([name]) => name === 'ops-agent.html')[1];
const memoPage = pages.find(([name]) => name === 'market-memo.html')[1];
assert.match(knowledgePage, /<title>知识库｜AI Info Hub<\/title>/);
assert.match(learningPage, /<title>学习收藏｜AI Info Hub<\/title>/);
assert.match(opsAgentPage, /<title>运维智能体｜AI Info Hub<\/title>/);
assert.match(opsAgentPage, /<link rel="stylesheet" href="assets\/ops-agent\.css">/);
assert.match(opsAgentPage, /id="problems"/);
assert.match(opsAgentPage, /id="questions"/);
assert.match(opsAgentPage, /id="vision"/);
assert.match(memoPage, /<title>随手记录｜AI Info Hub<\/title>/);
assert.match(memoPage, /<link rel="stylesheet" href="assets\/market-memo\.css">/, 'market-memo must load its page layout');

for (const name of ['ai-model-comparison.html', 'ai-agent-comparison.html']) {
  const html = pages.find(([pageName]) => pageName === name)[1];
  assert.match(html, /<link rel="stylesheet" href="assets\/comparison\.css">/, `${name} must reuse the comparison layout`);
  assert.doesNotMatch(html, /<style>[\s\S]*?\.catalog\{/, `${name} must not duplicate the comparison layout inline`);
}

const mark = await readFile(new URL('assets/site-mark.svg', root), 'utf8');
assert.match(mark, /<svg[^>]+viewBox="0 0 32 32"/);
assert.match(mark, /#00647f/i);
assert.match(mark, /#f5a016/i);

console.log('shared site identity and layout contracts: ok');
