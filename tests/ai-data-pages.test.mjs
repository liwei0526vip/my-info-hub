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
  const buttons = [...html.matchAll(/<button[^>]*data-(user-scale|company-view)="([^"]+)"[^>]*>/g)].map(([, key, value]) => ({
    dataset: { [key === 'user-scale' ? 'userScale' : 'companyView']: value },
    attrs: {},
    addEventListener(_type, fn) { this.click = fn; },
    setAttribute(key, value) { this.attrs[key] = value; },
  }));
  const grid = {};
  const document = {
    getElementById: id => nodes.get(id) ?? null,
    querySelectorAll: selector => buttons.filter(button => selector === '[data-user-scale]' ? button.dataset.userScale : button.dataset.companyView),
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
  for (const page of pages) {
    for (const width of [320, 900, 1800]) {
      for (const observe of [false, true]) {
        const mounted = mount(page, width, observe);
        const id = page.data.users ? 'users-chart' : 'company-chart';
        const rowId = page.data.users ? 'users-rows' : 'company-rows';
        assert.ok(!mounted.nodes.has(page.data.users ? 'company-chart' : 'users-chart'));
        for (const button of mounted.buttons) {
          button.click();
          const svg = mounted.nodes.get(id).innerHTML;
          assert.doesNotMatch(svg, /NaN|undefined/);
          assert.equal(button.attrs['aria-pressed'], 'true');
          const records = page.data.users ? Object.values(page.data.users).flatMap(entry => entry.points) : page.data.companies[button.dataset.companyView];
          const disclosures = page.data.disclosures ?? [];
          assert.equal((mounted.nodes.get(rowId).innerHTML.match(/<tr>/g) ?? []).length, records.length + disclosures.length);
          assert.equal((svg.match(page.data.users ? /class="source-point"/g : /class="company-source"/g) ?? []).length, records.length);
          if (page.data.users) {
            assert.match(svg, button.dataset.userScale === 'log' ? /对数刻度/ : /线性刻度/);
            for (const record of disclosures) {
              assert.ok(mounted.nodes.get(rowId).innerHTML.includes(record.metric));
              assert.ok(!svg.includes(record.scope));
            }
          }
          else for (const record of records) assert.ok(svg.includes(record.name));
        }
        mounted.resize(640);
        assert.match(mounted.nodes.get(id).innerHTML, /viewBox="0 0 640 /);
        assert.deepEqual(JSON.parse(mounted.nodes.get('ai-data').textContent), page.data);
      }
    }
  }
});

test('independent disclosures remain readable without any trend points', () => {
  const page = pages.find(page => page.data.users);
  const data = JSON.parse(page.json);
  for (const entry of Object.values(data.users)) entry.points = [];
  const mounted = mount({ ...page, json: JSON.stringify(data) }, 900, false);
  assert.match(mounted.nodes.get('users-chart').textContent, /尚无可核实/);
  assert.equal((mounted.nodes.get('users-rows').innerHTML.match(/<tr>/g) ?? []).length, data.disclosures.length);
  assert.match(mounted.nodes.get('users-rows').innerHTML, /独立披露/);
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
