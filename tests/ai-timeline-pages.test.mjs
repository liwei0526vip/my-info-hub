import assert from 'node:assert/strict';
import { readFile, readlink } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const script = await readFile(new URL('assets/ai-timeline.js', root), 'utf8');
const navScript = await readFile(new URL('assets/site-nav.js', root), 'utf8');
const pages = await Promise.all(['model', 'agent'].map(async kind => {
  const name = `ai-${kind}-timeline.html`;
  const html = await readFile(new URL(name, root), 'utf8');
  const json = id => html.match(new RegExp(`<script id="${id}" type="application/json">([\\s\\S]*?)</script>`))[1];
  return { name, kind, html, products: JSON.parse(json('timeline-products')), events: JSON.parse(json('timeline-data')) };
}));

function mount(page) {
  let buttons = [];
  const nodes = new Map(['year-filter', 'charts', 'empty-comparison', 'timeline-data', 'timeline-products', 'time-order'].map(id => [id, {
    innerHTML: '', textContent: '',
    style: { setProperty() {} },
    addEventListener(key, fn) { this[key] = fn; },
    focus(options) { this.focused = options; },
  }]));
  const filter = nodes.get('year-filter');
  Object.defineProperty(filter, 'innerHTML', {
    set(html) {
      buttons = [...html.matchAll(/<button([^>]*)>(.*?)<\/button>/g)].map(([, attrs, label]) => ({
        dataset: { year: attrs.match(/data-year="([^"]+)"/)[1] }, label,
        attrs: Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
        setAttribute(key, value) { this.attrs[key] = value; },
      }));
    },
  });
  filter.querySelectorAll = () => buttons;
  nodes.get('timeline-data').textContent = JSON.stringify(page.events);
  nodes.get('timeline-products').textContent = JSON.stringify(page.products);
  const shell = {};
  const document = {
    body: { dataset: { timelineKind: page.kind } },
    getElementById: id => nodes.get(id),
    querySelector: selector => selector === '.compare-shell' ? shell : null,
  };
  vm.runInNewContext(script, { document });
  return {
    nodes, shell, get buttons() { return buttons; },
    select(year) {
      const button = buttons.find(button => button.dataset.year === year);
      assert.ok(button, `year filter must expose ${year}`);
      filter.click({ target: { closest: () => button } });
    },
    sort() { nodes.get('charts').click({ target: { closest: selector => selector === '#time-order' } }); },
  };
}

test('AI directory exposes separate timelines with disjoint kinds and retained source links', async () => {
  const directory = (await readFile(new URL('ai.html', root), 'utf8')).match(/<nav class="ai-directory"[^>]*>([\s\S]*?)<\/nav>/)[1];
  for (const page of pages) {
    assert.ok(directory.includes(`href="${page.name}"`));
    assert.ok(page.events.length > 0);
    assert.ok(page.events.every(event => event.kind === page.kind && /^https:\/\//.test(event.source)));
    assert.equal(new Set(page.events.map(event => `${event.brand}:${event.date}:${event.title}`)).size, page.events.length);
    assert.ok(page.products.every(product => page.events.some(event => event.brand === product.id)));
    assert.ok(!page.html.includes('data-kind="all"'));
    assert.ok(!page.html.includes('timeline-user-history'));
    const hero = page.html.match(/<header class="timeline-hero[^>]*>([\s\S]*?)<\/header>/)[1];
    assert.match(hero, /id="year-filter"/);
    assert.doesNotMatch(page.html, /timeline-toolbar|<select/);
  }
  assert.deepEqual(pages[0].products.map(product => product.id), pages[1].products.map(product => product.id));
  assert.doesNotMatch(directory, /ai-agent-model-timeline/);
});

test('both timelines default to all, group older years, and retain date sorting', () => {
  for (const page of pages) {
      const mounted = mount(page);
      const output = () => mounted.nodes.get('charts').innerHTML;
      const dates = () => [...output().matchAll(/<article[^>]*data-date="([^"]+)"/g)].map(match => match[1]);
      const months = () => [...output().matchAll(/<section class="month-row[^>]*aria-label="(\d+)年(\d+)月"/g)].map(([, year, month]) => `${year}-${month.padStart(2, '0')}`);
      const check = (events, descending) => {
        assert.deepEqual(dates().sort(), events.map(event => event.date).sort());
        const expectedMonths = [...new Set(events.map(event => event.date.slice(0, 7)))].sort();
        assert.deepEqual(months(), descending ? expectedMonths.reverse() : expectedMonths);
        for (const [, stream] of output().matchAll(/<div class="stream"[^>]*>([\s\S]*?)(?=<\/div><\/section>|<\/div><div class="stream")/g)) {
          const values = [...stream.matchAll(/data-date="([^"]+)"/g)].map(match => match[1]);
          assert.deepEqual(values, descending ? [...values].sort().reverse() : [...values].sort());
        }
        assert.doesNotMatch(output(), /NaN|undefined/);
        assert.equal(mounted.shell.hidden, events.length === 0);
        assert.equal(mounted.nodes.get('empty-comparison').hidden, events.length > 0);
      };
      check(page.events, true);
      assert.deepEqual(mounted.buttons.map(button => button.label), ['全部', '2026', '2025', '2024', '更早']);
      assert.equal(mounted.buttons.find(button => button.attrs['aria-pressed'] === 'true').dataset.year, 'all');
      assert.equal(mounted.buttons.at(-1).attrs['aria-label'], '2024 年以前');
      assert.ok(output().includes('当前最新在前'));
      for (const event of page.events) assert.ok(output().includes(event.source.replaceAll('&', '&amp;')));
      mounted.sort();
      check(page.events, false);
      assert.ok(output().includes('当前最早在前'));
      assert.equal(mounted.nodes.get('time-order').focused.preventScroll, true);
      for (const year of ['2026', '2025', '2024', 'earlier']) {
        mounted.select(year);
        check(page.events.filter(event => year === 'earlier' ? event.date.slice(0, 4) < '2024' : event.date.startsWith(year)), false);
        const selected = mounted.buttons.filter(button => button.attrs['aria-pressed'] === 'true');
        assert.equal(selected.length, 1);
        assert.equal(selected[0].dataset.year, year);
      }
      mounted.select('all');
      mounted.sort();
      check(page.events, true);
      assert.deepEqual(JSON.parse(mounted.nodes.get('timeline-data').textContent), page.events);
  }
});

test('year options follow new records and an empty timeline remains readable', () => {
  const page = pages[0];
  const advanced = mount({ ...page, events: [...page.events, { ...page.events[0], date: '2027-01-01' }] });
  assert.deepEqual(advanced.buttons.map(button => button.label), ['全部', '2027', '2026', '2025', '更早']);
  advanced.select('earlier');
  const dates = [...advanced.nodes.get('charts').innerHTML.matchAll(/<article[^>]*data-date="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(dates.sort(), page.events.filter(event => event.date < '2025-01-01').map(event => event.date).sort());
  const empty = mount({ ...page, events: [] });
  assert.deepEqual(empty.buttons.map(button => button.label), ['全部']);
  assert.equal(empty.shell.hidden, true);
  assert.equal(empty.nodes.get('empty-comparison').hidden, false);
  assert.match(empty.nodes.get('empty-comparison').textContent, /没有收录事件/);
});

test('timeline navigation selects AI and sends the site brand to the AI directory', async () => {
  for (const name of [...pages.map(page => page.name), 'index.html']) {
    const host = { replaceChildren(fragment) { this.links = fragment.children; } };
    const wordmark = { replaceChildren(link) { this.link = link; } };
    const backTop = { setAttribute() {}, classList: { add() {}, toggle() {} } };
    const document = {
      querySelector: selector => selector === '[data-site-nav]' ? host : selector === '.site-wordmark' ? wordmark : selector === '.site-back-top' ? backTop : null,
      createDocumentFragment: () => ({ children: [], append(child) { this.children.push(child); } }),
      createElement: () => ({ attrs: {}, setAttribute(key, value) { this.attrs[key] = value; }, append() {} }),
    };
    vm.runInNewContext(navScript, { document, location: { pathname: `/site/${name}` }, window: { scrollY: 0, addEventListener() {} } });
    assert.equal(host.links.find(link => link.attrs['aria-current'] === 'page').href, 'ai.html');
    assert.ok(host.links.every(link => !link.href.includes('timeline')));
    assert.equal(wordmark.link.href, 'ai.html');
  }
  const index = await readFile(new URL('index.html', root), 'utf8');
  assert.equal(await readlink(new URL('index.html', root)), 'ai.html');
  assert.equal(index, await readFile(new URL('ai.html', root), 'utf8'));
});
