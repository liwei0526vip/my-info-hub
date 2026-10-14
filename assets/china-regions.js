/* Compact province/city reference with stable columns and a searchable hierarchy. */
(() => {
  const data = JSON.parse(document.getElementById('regions-data').textContent);
  const byId = id => document.getElementById(id);
  const table = byId('regions-table');
  const body = table.querySelector('tbody');
  const tableWrap = document.querySelector('.cr-table-wrap');
  const tableHint = byId('regions-table-hint');
  const heads = [...table.querySelectorAll('th[data-sort]')];
  const searchInput = byId('regions-search');
  const toggleAll = byId('toggle-all');

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const number = (value, digits = 2) => new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: digits, maximumFractionDigits: digits,
  }).format(value);
  // Small values retain precision, including Macau's area and Sansha's population.
  const scaled = value => {
    if (value === null || value === undefined) return '—';
    if (value > 0 && value < 0.01) return number(value, value < 0.001 ? 4 : 3);
    return number(value, 2);
  };
  const fmtPop = wan => scaled(wan == null ? null : wan / 1000);
  const fmtArea = km2 => scaled(km2 == null ? null : km2 / 10000);
  const fmtGDP = yi => scaled(yi == null ? null : yi / 10000);
  const popTitle = (value, note = '') => value == null ? '未列示人口'
    : `${number(value, 1)} 万人${note ? ` · ${note}` : ''}`;
  const areaTitle = value => value == null ? '未列示面积' : `${number(value)} 平方公里`;

  const REGION_ORDER = ['华北', '东北', '华东', '中南', '西南', '西北', '港澳台'];
  const model = data.provinces.map(p => {
    const capitalLabel = p.cap === '—' ? '' : p.level === '省' ? '省会' : p.level === '自治区' ? '首府' : '';
    return {
      ...p,
      cities: data.cities.filter(c => c.p === p.n).map(c => ({
        ...c, capitalLabel: c.n.replace(/市$/, '') === p.cap ? capitalLabel : '',
      })),
    };
  });
  const typeCounts = data.cities.reduce((counts, city) => {
    counts[city.t] = (counts[city.t] ?? 0) + 1;
    return counts;
  }, {});
  byId('cr-overview').textContent = `${data.provinces.length} 个省级行政区 · ${data.cities.length} 个地级行政区`
    + `（${Object.entries(typeCounts).map(([type, count]) => `${type} ${count}`).join('、')}）`;

  const state = {
    search: '', region: '全部', sort: { key: 'gdp', dir: -1 },
    expanded: new Set(), searchCollapsed: new Set(),
  };
  const provinceMatches = (p, query) => [p.n, p.abbr, p.region].some(value => value.toLowerCase().includes(query));
  const cityMatches = (p, query) => !query || provinceMatches(p, query) ? p.cities
    : p.cities.filter(c => [c.n, c.s, c.t].some(value => value.toLowerCase().includes(query)));
  const visibleProvinces = () => {
    const query = state.search.toLowerCase();
    return model.filter(p => (state.region === '全部' || p.region === state.region)
      && (!query || provinceMatches(p, query) || cityMatches(p, query).length > 0));
  };
  const isOpen = (p, matches = cityMatches(p, state.search.toLowerCase())) => matches.length > 0
    && (state.search ? !state.searchCollapsed.has(p.n) : state.expanded.has(p.n));
  const setOpen = (p, open) => {
    if (state.search) open ? state.searchCollapsed.delete(p.n) : state.searchCollapsed.add(p.n);
    else open ? state.expanded.add(p.n) : state.expanded.delete(p.n);
  };
  const ordered = (rows, key, dir) => rows.sort((a, b) => {
    const va = a[key], vb = b[key];
    if (va == null || vb == null) return va == null && vb == null ? 0 : va == null ? 1 : -1;
    return dir * (typeof va === 'string' ? va.localeCompare(vb, 'zh-CN') : va - vb);
  });
  const gdpCell = (value, year) => value == null ? '<span class="cr-sub">—</span>'
    : `<span class="cr-gdp"><span class="cr-gdp-value">${fmtGDP(value)}</span>`
      + `${year ? `<span class="cr-year${year < 2018 ? ' cr-year--old' : ''}">${year}</span>` : ''}</span>`;

  const shortNames = {
    '内蒙古自治区': '内蒙古', '广西壮族自治区': '广西', '西藏自治区': '西藏',
    '宁夏回族自治区': '宁夏', '新疆维吾尔自治区': '新疆',
    '香港特别行政区': '香港', '澳门特别行政区': '澳门',
    '巴音郭楞蒙古自治州': '巴音郭楞', '海西蒙古族藏族自治州': '海西',
    '玉树藏族自治州': '玉树',
  };
  const chartName = row => shortNames[row.n] ?? row.n.replace(/[省市]$/, '');
  const gdpYear = p => Number(p.gdpNote.match(/\d{4}/)?.[0]) || null;
  const metrics = [
    { key: 'pop', label: '人口', unit: '千万人', format: fmtPop, note: '2020 七普' },
    { key: 'area', label: '面积', unit: '万 km²', format: fmtArea, note: '土地面积' },
    { key: 'gdp', label: 'GDP', unit: '万亿元', format: fmtGDP, note: '2025' },
  ];

  function renderRankings() {
    // Municipalities also enter city rankings; prefectures retain the table's scope.
    const cityRows = [...model.flatMap(p => p.cities), ...data.provinces.filter(p => p.level === '直辖市')
      .map(p => ({ ...p, p: p.n, t: p.level, year: gdpYear(p) }))];
    const scopes = [
      { key: 'province', label: '省份', rows: data.provinces },
      { key: 'city', label: '城市', rows: cityRows },
    ];
    byId('regions-rankings').innerHTML = metrics.flatMap(metric => scopes.map(scope => {
      const id = `cr-ranking-${scope.key}-${metric.key}`;
      const rows = ordered(scope.rows.filter(row => Number.isFinite(row[metric.key]) && row[metric.key] > 0), metric.key, -1).slice(0, 10);
      const maximum = rows[0]?.[metric.key] ?? 1;
      const note = metric.key === 'gdp' && scope.key === 'city' ? '年份随数值' : metric.note;
      const list = rows.map((row, index) => {
        const value = metric.format(row[metric.key]);
        const year = metric.key === 'gdp' ? (scope.key === 'province' ? gdpYear(row) : row.year) : null;
        const detail = metric.key === 'pop' ? popTitle(row.pop, row.popNote || '2020年七普')
          : metric.key === 'area' ? areaTitle(row.area)
            : `${number(row.gdp)} 亿元${year ? ` · ${year} 年` : ''}${row.gdpNote ? ` · ${row.gdpNote}` : ''}`;
        const location = scope.key === 'city' ? `${row.t}${row.t !== '直辖市' ? ` · ${row.p}` : ''}${row.capitalLabel ? ` · ${row.capitalLabel}` : ''}` : row.level;
        const title = `${row.n} · ${location} · ${detail}`;
        return `<li${row.capitalLabel ? ' class="is-capital"' : ''} data-name="${escapeHTML(row.n)}" data-value="${row[metric.key]}" aria-label="${escapeHTML(`第 ${index + 1} 名，${title}`)}">
          <span class="cr-rank-number" aria-hidden="true">${index + 1}</span>
          <span class="cr-chart-name" title="${escapeHTML(title)}">${escapeHTML(chartName(row))}</span>
          <span class="cr-chart-track" aria-hidden="true"><span class="cr-chart-bar" style="width:${(row[metric.key] / maximum * 100).toFixed(2)}%"></span></span>
          <span class="cr-chart-value" title="${escapeHTML(detail)}">${value}${metric.key === 'gdp' && scope.key === 'city' && year ? `<span class="cr-chart-year">${year}</span>` : ''}</span>
        </li>`;
      }).join('');
      return `<figure class="cr-chart cr-chart--${metric.key}${scope.key === 'city' && metric.key === 'gdp' ? ' cr-chart--years' : ''}" data-chart-scope="${scope.key}" data-chart-metric="${metric.key}" aria-labelledby="${id}" aria-describedby="${id}-note">
        <figcaption><h2 id="${id}">${scope.label}${metric.label}前十</h2><span class="cr-chart-scope">${scope.key === 'city' ? '地级＋直辖市' : '省级行政区'}</span></figcaption>
        <p class="cr-chart-note" id="${id}-note">${note} · ${metric.unit}</p>
        <ol class="cr-chart-list">${list}</ol>
      </figure>`;
    })).join('');
  }

  function syncTableOverflow() {
    const height = table.querySelector('thead').getBoundingClientRect().height;
    tableWrap.style.setProperty('--cr-header-height', `${height}px`);
    const overflowing = tableWrap.scrollWidth > tableWrap.clientWidth;
    tableWrap.classList.toggle('has-overflow', overflowing);
    tableHint.hidden = !overflowing || body.querySelector('.cr-empty') !== null;
  }

  function render() {
    const query = state.search.toLowerCase();
    const { key, dir } = state.sort;
    const provinces = ordered(visibleProvinces(), key, dir);
    const fragment = [];
    let shownCities = 0;

    for (const p of provinces) {
      const matches = cityMatches(p, query);
      const open = isOpen(p, matches);
      const expandable = p.cities.length > 0;
      const name = `<span class="cr-toggle" aria-hidden="true">${expandable ? '▸' : ''}</span>`
        + `<span class="cr-province-name">${escapeHTML(p.n)}</span><span class="cr-abbr">${escapeHTML(p.abbr)}</span>`;
      const nameTitle = `${p.n}（${p.abbr}） · ${p.level}${expandable ? ` · ${p.cities.length} 个地级行政区` : ''}`;
      const nameCell = expandable
        ? `<button type="button" class="cr-province-button" aria-expanded="${open}" aria-label="${escapeHTML(`${open ? '收起' : '展开'}${p.n}下辖的 ${p.cities.length} 个地级行政区`)}" title="${escapeHTML(nameTitle)}">${name}</button>`
        : `<span class="cr-province-label" title="${escapeHTML(nameTitle)}">${name}</span>`;
      fragment.push(`<tr class="cr-prov${expandable ? ' is-expandable' : ''}" data-prov="${escapeHTML(p.n)}"${expandable ? ` aria-expanded="${open}"` : ''}>
        <td class="cr-name">${nameCell}</td>
        <td class="cr-location">${escapeHTML(p.region)}</td>
        <td class="num" title="${escapeHTML(popTitle(p.pop, p.popNote))}">${fmtPop(p.pop)}</td>
        <td class="num" title="${escapeHTML(areaTitle(p.area))}">${fmtArea(p.area)}</td>
        <td class="num" title="${escapeHTML(p.gdpNote)}">${gdpCell(p.gdp, 2025)}</td>
      </tr>`);
      if (!open) continue;
      shownCities += matches.length;
      for (const c of ordered([...matches], key, dir)) {
        const typeTitle = `${c.t}${c.subs ? ` · 区县组成：${c.subs}` : ''}`;
        const gdpTitle = c.gdp == null ? '未公布 GDP' : `${number(c.gdp)} 亿元${c.year ? ` · ${c.year} 年` : ''}`;
        const capitalBadge = c.capitalLabel ? `<span class="cr-capital-badge" title="${escapeHTML(`${p.n}${c.capitalLabel}`)}">${c.capitalLabel}</span>` : '';
        const typeBadge = c.t === '地级市' ? '' : `<span class="cr-city-type" title="${escapeHTML(typeTitle)}">${escapeHTML(c.t)}</span>`;
        fragment.push(`<tr class="cr-city${c.capitalLabel ? ' cr-city--capital' : ''}" data-parent="${escapeHTML(p.n)}" data-city="${escapeHTML(c.n)}">
          <td class="cr-name"><span class="cr-name-line"><span class="cr-city-name" title="${escapeHTML(`${c.n} · ${typeTitle}`)}">${escapeHTML(c.n)}</span>${capitalBadge}${typeBadge}</span></td>
          <td class="cr-location" title="驻地：${escapeHTML(c.s)}">${escapeHTML(c.s)}</td>
          <td class="num" title="${escapeHTML(popTitle(c.pop))}">${fmtPop(c.pop)}</td>
          <td class="num" title="${escapeHTML(areaTitle(c.area))}">${fmtArea(c.area)}</td>
          <td class="num" title="${escapeHTML(gdpTitle)}">${gdpCell(c.gdp, c.year)}</td>
        </tr>`);
      }
    }

    body.innerHTML = fragment.length ? fragment.join('') : '<tr><td class="cr-empty" colspan="5">没有匹配的省份或城市。</td></tr>';
    byId('regions-count').innerHTML = `显示 <strong>${provinces.length}</strong> 省级${shownCities ? ` · <strong>${shownCities}</strong> 地级` : ''}`;
    const expandable = provinces.filter(p => cityMatches(p, query).length > 0);
    const allOpen = expandable.length > 0 && expandable.every(p => isOpen(p));
    toggleAll.disabled = expandable.length === 0;
    toggleAll.textContent = allOpen ? '收起全部' : '展开全部';
    toggleAll.setAttribute('aria-pressed', String(allOpen));
    heads.forEach(head => {
      const active = head.dataset.sort === state.sort.key;
      head.classList.toggle('is-sorted', active);
      head.setAttribute('aria-sort', active ? (dir === 1 ? 'ascending' : 'descending') : 'none');
      head.querySelector('.cr-sort-icon').textContent = active ? (dir === 1 ? '↑' : '↓') : '↕';
      const next = active ? -dir : head.classList.contains('is-numeric') ? -1 : 1;
      const label = { n: '省份和城市名称', pop: '人口', area: '面积', gdp: 'GDP' }[head.dataset.sort];
      head.querySelector('button').setAttribute('aria-label', `按${label}${next === 1 ? '升序' : '降序'}排列`);
    });
    syncTableOverflow();
  }

  const chipHost = byId('region-chips');
  chipHost.append(...['全部', ...REGION_ORDER].map(region => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cr-chip';
    button.textContent = region;
    button.dataset.region = region;
    button.setAttribute('aria-pressed', String(region === '全部'));
    button.addEventListener('click', () => {
      state.region = region;
      chipHost.querySelectorAll('.cr-chip').forEach(chip => chip.setAttribute('aria-pressed', String(chip === button)));
      render();
    });
    return button;
  }));
  searchInput.addEventListener('input', event => {
    state.search = event.target.value.trim();
    state.searchCollapsed.clear();
    render();
  });
  toggleAll.addEventListener('click', () => {
    const expandable = visibleProvinces().filter(p => cityMatches(p, state.search.toLowerCase()).length > 0);
    const allOpen = expandable.length > 0 && expandable.every(p => isOpen(p));
    expandable.forEach(p => setOpen(p, !allOpen));
    render();
  });
  body.addEventListener('click', event => {
    const row = event.target.closest('tr.cr-prov.is-expandable');
    if (!row) return;
    const p = model.find(item => item.n === row.dataset.prov);
    const restoreFocus = event.target.closest('.cr-province-button') !== null;
    setOpen(p, !isOpen(p));
    render();
    if (restoreFocus) [...body.querySelectorAll('tr.cr-prov')].find(item => item.dataset.prov === p.n)
      ?.querySelector('.cr-province-button')?.focus({ preventScroll: true });
  });
  heads.forEach(head => head.addEventListener('click', () => {
    const key = head.dataset.sort;
    state.sort.dir = state.sort.key === key ? -state.sort.dir : head.classList.contains('is-numeric') ? -1 : 1;
    state.sort.key = key;
    render();
  }));

  new ResizeObserver(syncTableOverflow).observe(tableWrap);
  renderRankings();
  render();
})();
