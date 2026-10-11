/* china-regions: one drill-down table — provinces expand to their cities. */
(() => {
  const data = JSON.parse(document.getElementById('regions-data').textContent);
  const byId = id => document.getElementById(id);

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const number = (value, digits = 2) => new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(value);
  // Values below the 2-decimal floor (澳门面积、三沙人口) keep extra precision instead of collapsing to 0.00.
  const scaled = value => {
    if (value === null || value === undefined) return '—';
    if (value > 0 && value < 0.01) return number(value, value < 0.001 ? 4 : 3);
    return number(value, 2);
  };
  const fmtPop = wan => scaled(wan === null ? null : wan / 1000);          // 万 → 千万
  const fmtArea = km2 => scaled(km2 === null ? null : km2 / 10000);        // km² → 万 km²
  const fmtGDP = yi => scaled(yi === null ? null : yi / 10000);            // 亿元 → 万亿元

  const REGION_ORDER = ['华北', '东北', '华东', '中南', '西南', '西北', '港澳台'];
  const model = data.provinces.map(p => ({
    ...p,
    cities: data.cities.filter(c => c.p === p.n),
  }));

  // Overview line: counts derive from the dataset, never hardcoded.
  const typeCounts = data.cities.reduce((acc, c) => {
    acc[c.t] = (acc[c.t] ?? 0) + 1;
    return acc;
  }, {});
  byId('cr-overview').textContent =
    `${data.provinces.length} 个省级行政区 · ${data.cities.length} 个地级行政区`
    + `（${Object.entries(typeCounts).map(([t, n]) => `${t} ${n}`).join('、')}）`;

  /* ---------- state ---------- */

  const state = {
    search: '',
    region: '全部',
    sort: { key: 'gdp', dir: -1 },
    expanded: new Set(),
  };

  /* ---------- region chips ---------- */

  const chipHost = byId('region-chips');
  chipHost.append(...['全部', ...REGION_ORDER].map(region => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cr-chip';
    button.textContent = region;
    button.setAttribute('aria-pressed', String(region === '全部'));
    button.addEventListener('click', () => {
      state.region = region;
      chipHost.querySelectorAll('.cr-chip').forEach(chip =>
        chip.setAttribute('aria-pressed', String(chip === button)));
      render();
    });
    return button;
  }));

  byId('regions-search').addEventListener('input', event => {
    state.search = event.target.value.trim();
    render();
  });

  const toggleAll = byId('toggle-all');
  toggleAll.addEventListener('click', () => {
    const withCities = visibleProvinces().filter(p => p.cities.length);
    const allOpen = withCities.length > 0 && withCities.every(p => state.expanded.has(p.n));
    withCities.forEach(p => (allOpen ? state.expanded.delete(p.n) : state.expanded.add(p.n)));
    render();
  });

  /* ---------- filtering and sorting ---------- */

  function visibleProvinces() {
    const search = state.search.toLowerCase();
    return model.filter(p =>
      (state.region === '全部' || p.region === state.region)
      && (!search
        || [p.n, p.abbr, p.region].some(v => String(v).toLowerCase().includes(search))
        || p.cities.some(c => [c.n, c.s, c.t].some(v => String(v).toLowerCase().includes(search)))));
  }

  const cityMatches = (p, search) => !search
    ? p.cities
    : p.cities.filter(c => [c.n, c.s, c.t].some(v => String(v).toLowerCase().includes(search)));

  const provValue = key => p => (key === 'n' ? p.n : key === 'region' ? REGION_ORDER.indexOf(p.region) : (p[key] ?? -1));
  const cityValue = key => c => (key === 'n' ? c.n : key === 'region' ? c.s : (c[key] ?? -1));
  const ordered = (rows, key, dir, valueOf) => rows.sort((a, b) => {
    const va = valueOf(a), vb = valueOf(b);
    const cmp = typeof va === 'string' ? va.localeCompare(vb, 'zh-CN') : (va || 0) - (vb || 0);
    return dir === 1 ? cmp : -cmp;
  });

  /* ---------- rendering ---------- */

  const flagged = p => p.region === '港澳台';
  const gdpCell = (value, year) => value === null || value === undefined
    ? '<span class="cr-sub">—</span>'
    : `${scaled(value / 10000)}${year ? `<span class="cr-year${year < 2018 ? ' cr-year--old' : ''}">${year}</span>` : ''}`;

  function render() {
    const search = state.search.toLowerCase();
    const { key, dir } = state.sort;
    const provinces = ordered([...visibleProvinces()], key, dir, provValue(key));

    const body = byId('regions-table').querySelector('tbody');
    const fragment = [];
    let shownCities = 0;

    for (const p of provinces) {
      const matching = cityMatches(p, search);
      const isSearching = Boolean(search);
      const open = p.cities.length > 0 && (isSearching ? matching.length > 0 || state.expanded.has(p.n) : state.expanded.has(p.n));
      fragment.push(`
      <tr class="cr-prov${p.cities.length ? ' is-expandable' : ''}" data-prov="${escapeHTML(p.n)}"
          ${p.cities.length ? `aria-expanded="${open}"` : ''}>
        <td class="cr-name">${p.cities.length ? '<span class="cr-toggle" aria-hidden="true">▸</span>' : ''}${escapeHTML(p.n)}${flagged(p) ? '<span class="cr-flag"> ＊</span>' : ''}</td>
        <td>${escapeHTML(p.abbr)}</td>
        <td class="cr-sub">${escapeHTML(p.region)}</td>
        <td class="num"${flagged(p) ? ` title="${escapeHTML(p.popNote)}"` : ''}>${fmtPop(p.pop)}</td>
        <td class="num">${fmtArea(p.area)}</td>
        <td class="num"${flagged(p) ? ` title="${escapeHTML(p.gdpNote)}"` : ''}>${fmtGDP(p.gdp)}</td>
      </tr>`);
      if (open) {
        shownCities += matching.length;
        for (const c of ordered([...matching], key, dir, cityValue(key))) {
          fragment.push(`
      <tr class="cr-city">
        <td class="cr-name"><span class="cr-city-name">${escapeHTML(c.n)}</span></td>
        <td>${escapeHTML(c.t)}${c.subs ? `<span class="cr-sub"> · ${escapeHTML(c.subs)}</span>` : ''}</td>
        <td class="cr-sub">${escapeHTML(c.s)}</td>
        <td class="num">${fmtPop(c.pop)}</td>
        <td class="num">${fmtArea(c.area)}</td>
        <td class="num">${gdpCell(c.gdp, c.year)}</td>
      </tr>`);
        }
      }
    }

    body.innerHTML = fragment.length ? fragment.join('') : '<tr><td class="cr-empty" colspan="6">没有匹配的省份或城市。</td></tr>';
    byId('regions-count').textContent = `（${provinces.length} 省${shownCities ? ` · ${shownCities} 城市` : ''}）`;
    toggleAll.textContent = provinces.some(p => p.cities.length && !state.expanded.has(p.n)) ? '展开全部' : '收起全部';
    toggleAll.setAttribute('aria-pressed', String(provinces.length > 0 && provinces.every(p => !p.cities.length || state.expanded.has(p.n))));
  }

  /* ---------- expand on row click ---------- */

  byId('regions-table').querySelector('tbody').addEventListener('click', event => {
    const row = event.target.closest('tr.cr-prov');
    if (!row || !row.classList.contains('is-expandable')) return;
    const name = row.dataset.prov;
    state.expanded.has(name) ? state.expanded.delete(name) : state.expanded.add(name);
    render();
  });

  /* ---------- sorting ---------- */

  const table = byId('regions-table');
  table.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', () => {
    const key = th.dataset.sort;
    state.sort.dir = state.sort.key === key ? -state.sort.dir : (th.classList.contains('is-numeric') ? -1 : 1);
    state.sort.key = key;
    table.querySelectorAll('th[data-sort]').forEach(header => {
      if (header.dataset.sort === state.sort.key) header.setAttribute('aria-sort', state.sort.dir === 1 ? 'ascending' : 'descending');
      else header.removeAttribute('aria-sort');
    });
    render();
  }));
  table.querySelector(`th[data-sort="${state.sort.key}"]`).setAttribute('aria-sort', 'descending');

  render();
})();
