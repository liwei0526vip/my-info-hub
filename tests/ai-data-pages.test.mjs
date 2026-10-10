import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const chartScript = await readFile(new URL('assets/ai-data.js', root), 'utf8');
const navScript = await readFile(new URL('assets/site-nav.js', root), 'utf8');
const pages = await Promise.all(['ai-user-scale.html', 'ai-company-value.html'].map(async name => {
  const html = await readFile(new URL(name, root), 'utf8');
  const json = html.match(/<script type="application\/json" id="ai-data">([\s\S]*?)<\/script>/)[1];
  return { name, html, json, data: JSON.parse(json) };
}));

function mount({ html, json }, initialWidth, observe) {
  let width = initialWidth;
  let resize;
  const nodes = new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [id, {
    innerHTML: '', textContent: '', getBoundingClientRect: () => ({ width }),
  }]));
  nodes.get('ai-data').textContent = json;
  const camel = key => key.replace(/-(.)/g, (_, char) => char.toUpperCase());
  const buttons = [...html.matchAll(/<button([^>]*)>/g)].map(([, attrs]) => {
    const dataset = {};
    for (const [, key, value] of attrs.matchAll(/data-([a-z-]+)="([^"]*)"/g)) dataset[camel(key)] = value;
    return {
      dataset,
      attrs: {},
      addEventListener(_type, fn) { this.click = fn; },
      setAttribute(key, value) { this.attrs[key] = value; },
    };
  });
  const grid = {};
  const document = {
    getElementById: id => nodes.get(id) ?? null,
    querySelectorAll: selector => {
      const match = selector.match(/^\[data-([a-z-]+)(?:="([^"]+)")?\]$/);
      if (!match) return [];
      const [, attr, value] = match;
      const prop = camel(attr);
      return buttons.filter(button => button.dataset[prop] !== undefined && (value === undefined || button.dataset[prop] === value));
    },
    querySelector: selector => selector === '.data-grid' ? grid : null,
  };
  const window = { addEventListener(_type, fn) { resize = fn; } };
  class ResizeObserver {
    constructor(fn) { resize = fn; }
    observe(node) { assert.equal(node, grid); }
  }
  if (observe) window.ResizeObserver = ResizeObserver;
  vm.runInNewContext(chartScript, { document, window, ResizeObserver, Intl, Date });
  return { nodes, buttons, resize(newWidth) { width = newWidth; resize(); } };
}

test('AI directory links to two separate data pages', async () => {
  const html = await readFile(new URL('ai.html', root), 'utf8');
  const directory = html.match(/<nav class="ai-directory"[^>]*>([\s\S]*?)<\/nav>/)[1];
  for (const { name } of pages) assert.match(directory, new RegExp(`href="${name}"`));
  assert.doesNotMatch(directory, /ai-data\.html/);
  assert.ok(pages[0].data.users && !pages[0].data.companies);
  assert.ok(pages[1].data.companies && !pages[1].data.users);
});

test('each page renders and switches its own chart without the other section', () => {
  const metricKeyOf = entry => (/周活/.test(entry.metric) ? 'wau' : /累计/.test(entry.metric) ? 'cumulative' : 'mau');
  const userKeys = ['mau', 'wau', 'cumulative'];
  for (const page of pages) {
    const isUsersPage = Boolean(page.data.users);
    const chartIds = isUsersPage ? userKeys.map(key => `${key}-chart`) : ['listed-chart', 'unlisted-chart'];
    for (const width of [320, 900, 1800]) {
      for (const observe of [false, true]) {
        const mounted = mount(page, width, observe);
        assert.ok(isUsersPage ? !mounted.nodes.has('listed-chart') : !mounted.nodes.has('mau-chart'));
        if (isUsersPage) {
          for (const key of userKeys) {
            assert.ok(!mounted.nodes.has(`${key}-rows`) && !mounted.nodes.has(`${key}-note`));
            const svg = mounted.nodes.get(`${key}-chart`).innerHTML;
            const visible = Object.values(page.data.users).filter(entry => metricKeyOf(entry) === key).flatMap(entry => entry.points);
            assert.doesNotMatch(svg, /NaN|undefined/);
            assert.equal((svg.match(/class="source-point"/g) ?? []).length, visible.length);
            assert.match(svg, /线性刻度/);
            assert.doesNotMatch(svg, /对数刻度/);
            assert.doesNotMatch(mounted.nodes.get(`${key}-legend`).innerHTML, /<small>/);
          }
        }
        else {
          assert.equal(mounted.buttons.length, 0);
          for (const key of ['listed', 'unlisted']) {
            const svg = mounted.nodes.get(`${key}-chart`).innerHTML;
            const records = page.data.companies[key].flatMap(entry => entry.points);
            assert.ok(!mounted.nodes.has(`${key}-rows`) && !mounted.nodes.has(`${key}-note`));
            assert.doesNotMatch(svg, /NaN|undefined/);
            assert.equal((svg.match(/class="source-point"/g) ?? []).length, records.length);
            assert.match(svg, /线性刻度/);
            assert.doesNotMatch(svg, /对数刻度/);
            assert.match(svg, /亿美元/);
            assert.doesNotMatch(svg, /十亿美元/);
            assert.doesNotMatch(mounted.nodes.get(`${key}-legend`).innerHTML, /<small>/);
            for (const entry of page.data.companies[key]) assert.ok(svg.includes(entry.name));
          }
        }
        mounted.resize(640);
        for (const id of chartIds) assert.match(mounted.nodes.get(id).innerHTML, /viewBox="0 0 640 /);
        assert.deepEqual(JSON.parse(mounted.nodes.get('ai-data').textContent), page.data);
      }
    }
  }
});

test('hover titles stay brand-only and empty charts keep the fallback text', () => {
  const page = pages.find(page => page.data.users);
  const metricKeyOf = entry => (/周活/.test(entry.metric) ? 'wau' : /累计/.test(entry.metric) ? 'cumulative' : 'mau');
  const headings = { mau: 'App 月活', wau: '周活（WAU）', cumulative: '累计用户' };
  const mounted = mount(page, 900, false);
  for (const key of ['mau', 'wau', 'cumulative']) {
    const names = new Set(Object.values(page.data.users).filter(entry => metricKeyOf(entry) === key).map(entry => entry.name));
    const titles = [...mounted.nodes.get(`${key}-chart`).innerHTML.matchAll(/<title>([^<]*)<\/title>/g)].map(([, title]) => title);
    assert.ok(titles.length > 1);
    for (const title of titles) assert.ok(names.has(title) || title === headings[key], `unexpected title: ${title}`);
  }
  const data = JSON.parse(page.json);
  for (const entry of Object.values(data.users)) entry.points = [];
  const emptied = mount({ ...page, json: JSON.stringify(data) }, 900, false);
  for (const key of ['mau', 'wau', 'cumulative']) assert.match(emptied.nodes.get(`${key}-chart`).textContent, /尚无可核实/);
  const companyPage = pages.find(candidate => candidate.data.companies);
  const companyHeadings = { listed: '上市市值趋势', unlisted: '未上市估值趋势' };
  const companyMounted = mount(companyPage, 900, false);
  for (const key of ['listed', 'unlisted']) {
    const names = new Set(companyPage.data.companies[key].map(entry => entry.name));
    const titles = [...companyMounted.nodes.get(`${key}-chart`).innerHTML.matchAll(/<title>([^<]*)<\/title>/g)].map(([, title]) => title);
    assert.ok(titles.length > 1);
    for (const title of titles) assert.ok(names.has(title) || title === companyHeadings[key], `unexpected title: ${title}`);
  }
});

test('data pages select AI in the main navigation without adding their own entries', () => {
  for (const { name } of pages) {
    const host = { replaceChildren(fragment) { this.links = fragment.links; } };
    const backTop = { setAttribute() {}, classList: { add() {}, toggle() {} } };
    const document = {
      querySelector: selector => selector === '[data-site-nav]' ? host : selector === '.site-back-top' ? backTop : null,
      createDocumentFragment: () => ({ links: [], append(link) { this.links.push(link); } }),
      createElement: () => ({ attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } }),
    };
    vm.runInNewContext(navScript, { document, location: { pathname: `/site/${name}` }, window: { scrollY: 0, addEventListener() {} } });
    assert.equal(host.links.find(link => link.attrs['aria-current'] === 'page').href, 'ai.html');
    assert.ok(host.links.every(link => !['ai-data.html', ...pages.map(page => page.name)].includes(link.href)));
  }
});
