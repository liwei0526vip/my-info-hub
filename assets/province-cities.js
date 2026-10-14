/* City indicators with sortable metrics and expandable district/county lists. */
(() => {
  const data = JSON.parse(document.getElementById('province-cities-data').textContent);
  const byId = id => document.getElementById(id);
  const table = byId('province-cities-table');
  const body = byId('province-cities-rows');
  const wrap = document.querySelector('.pc-table-wrap');
  const heads = [...table.querySelectorAll('th[data-sort]')];
  const state = { sort: { key: 'gdp', dir: -1 }, expanded: new Set() };
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const number = (value, digits = 2) => new Intl.NumberFormat('zh-CN', {
    useGrouping: false, maximumFractionDigits: digits,
  }).format(value);
  const units = { pop: '万人', area: '万平方公里', gdp: '亿元' };
  const format = {
    pop: value => number(value, 1),
    area: value => number(value / 10000),
    gdp: value => number(value, 1),
  };
  const display = (key, value) => value == null ? '—' : format[key](value);
  const metricText = (key, value) => `${display(key, value)}${units[key]}`;
  const exactText = (key, value) => value == null ? '未公布准确数值' : key === 'pop' ? `${number(value, 4)}万人`
    : key === 'area' ? `${number(value)}平方公里` : `${number(value)}亿元`;
  const populationBasis = data.populationBasis || '七普';
  const isOpen = city => state.expanded.has(city.n);
  const setOpen = (city, open) => open ? state.expanded.add(city.n) : state.expanded.delete(city.n);
  const ordered = (cities, key, dir) => [...cities].sort((a, b) => {
    const va = a[key], vb = b[key];
    if (va == null || vb == null) return va == null && vb == null ? 0 : va == null ? 1 : -1;
    return dir * (typeof va === 'string' ? va.localeCompare(vb, 'zh-CN') : va - vb);
  });
  const shortGroup = { '市辖区': '区', '县级市': '市', '县': '县', '街道': '街道', '镇': '镇' };
  const composition = city => city.groups.map(group => `${group.names.length}${shortGroup[group.label]}`).join(' · ');

  function syncOverflow() {
    const height = table.querySelector('thead').getBoundingClientRect().height;
    wrap.style.setProperty('--cr-header-height', `${height}px`);
    const overflowing = wrap.scrollWidth > wrap.clientWidth;
    wrap.classList.toggle('has-overflow', overflowing);
    byId('province-cities-table-hint').hidden = !overflowing || Boolean(body.querySelector('.cr-empty'));
  }

  function render() {
    const cities = ordered(data.cities, state.sort.key, state.sort.dir);
    const fragment = [];
    for (const city of cities) {
      const open = isOpen(city);
      fragment.push(`<tr class="pc-city-row${city.capital ? ' cr-city--capital' : ''}" data-city="${escapeHTML(city.n)}" aria-expanded="${open}">
        <td class="cr-name"><button class="cr-province-button pc-city-button" type="button" aria-expanded="${open}" aria-label="${escapeHTML(`${open ? '收起' : '展开'}${city.n}${city.direct ? '街道与镇' : '下辖区县'}`)}"><span class="cr-toggle" aria-hidden="true">▸</span><span class="cr-city-name">${escapeHTML(city.n)}</span>${city.capital ? '<span class="cr-capital-badge">省会</span>' : city.direct ? '<span class="pc-direct">省直辖</span>' : ''}</button></td>
        <td class="pc-composition"><span class="pc-composition-count">${escapeHTML(composition(city))}</span></td>
        <td class="num" title="${escapeHTML(`${exactText('pop', city.pop)} · ${city.popYear} 年${populationBasis}`)}">${display('pop', city.pop)}</td>
        <td class="num" title="${escapeHTML(`${exactText('area', city.area)} · ${city.areaNote}`)}">${display('area', city.area)}</td>
        <td class="num" title="${escapeHTML(`${exactText('gdp', city.gdp)} · ${city.gdpYear} 年${city.gdpNote ? ` · ${city.gdpNote}` : ''}`)}">${display('gdp', city.gdp)}</td>
      </tr>`);
      if (!open) continue;
      const groups = city.groups.map(group => `<div class="pc-division-group"><dt>${escapeHTML(group.label)} <span>${group.names.length}</span></dt><dd>${group.names.map(name => `<span class="pc-division-name">${escapeHTML(name)}</span>`).join('')}</dd></div>`).join('');
      fragment.push(`<tr class="pc-divisions-row" data-parent="${escapeHTML(city.n)}"><td colspan="5"><dl class="pc-divisions">${groups}</dl><a class="pc-city-source" href="${escapeHTML(city.source)}" target="_blank" rel="noopener noreferrer">${escapeHTML(city.n)}${escapeHTML(data.divisionSourceLabel || '官方市情')} ↗</a></td></tr>`);
    }
    body.innerHTML = fragment.length ? fragment.join('') : '<tr><td class="cr-empty" colspan="5">暂未记录城市资料。</td></tr>';
    heads.forEach(head => {
      const active = head.dataset.sort === state.sort.key;
      const { dir } = state.sort;
      head.classList.toggle('is-sorted', active);
      head.setAttribute('aria-sort', active ? (dir === 1 ? 'ascending' : 'descending') : 'none');
      head.querySelector('.cr-sort-icon').textContent = active ? (dir === 1 ? '↑' : '↓') : '↕';
      const next = active ? -dir : head.classList.contains('is-numeric') ? -1 : 1;
      const label = { n: '城市名称', pop: '人口', area: '面积', gdp: 'GDP' }[head.dataset.sort];
      head.querySelector('button').setAttribute('aria-label', `按${label}${next === 1 ? '升序' : '降序'}排列`);
    });
    syncOverflow();
  }

  function renderRankings() {
    const metrics = [
      { key: 'pop', label: '人口', note: data.populationNote || '2020 年七普' },
      { key: 'area', label: '面积', note: '土地面积' },
      { key: 'gdp', label: 'GDP', note: data.gdpNote || '2024 年' },
    ];
    byId('province-cities-rankings').innerHTML = metrics.map(metric => {
      const available = data.cities.filter(city => Number.isFinite(city[metric.key]));
      const cities = ordered(available, metric.key, -1).slice(0, 5);
      const maximum = cities[0]?.[metric.key] || 1;
      const scope = available.length === data.cities.length ? '全省城市' : `已公布 ${available.length} 市`;
      const list = cities.map((city, index) => `<li${city.capital ? ' class="is-capital"' : ''} data-name="${escapeHTML(city.n)}" data-value="${city[metric.key]}" aria-label="${escapeHTML(`第 ${index + 1} 名，${city.n}，${metric.label} ${metricText(metric.key, city[metric.key])}`)}"><span class="cr-rank-number" aria-hidden="true">${index + 1}</span><span class="cr-chart-name" title="${escapeHTML(city.n)}">${escapeHTML(city.n.replace(/市$/, ''))}</span><span class="cr-chart-track" aria-hidden="true"><span class="cr-chart-bar" style="width:${(city[metric.key] / maximum * 100).toFixed(2)}%"></span></span><span class="cr-chart-value" title="${escapeHTML(`${exactText(metric.key, city[metric.key])} · ${metric.note}`)}">${format[metric.key](city[metric.key])}</span></li>`).join('');
      return `<figure class="cr-chart cr-chart--${metric.key}" data-metric="${metric.key}" aria-labelledby="pc-ranking-${metric.key}" aria-describedby="pc-ranking-${metric.key}-note"><figcaption><h2 id="pc-ranking-${metric.key}">城市${metric.label} TOP5</h2><span class="cr-chart-scope">${scope}</span></figcaption><p class="cr-chart-note" id="pc-ranking-${metric.key}-note">${metric.note} · ${units[metric.key]}</p><ol class="cr-chart-list">${list}</ol></figure>`;
    }).join('');
  }

  heads.forEach(head => head.addEventListener('click', () => {
    const key = head.dataset.sort;
    state.sort.dir = state.sort.key === key ? -state.sort.dir : head.classList.contains('is-numeric') ? -1 : 1;
    state.sort.key = key; render();
  }));
  body.addEventListener('click', event => {
    const row = event.target.closest('.pc-city-row');
    if (!row) return;
    const city = data.cities.find(city => city.n === row.dataset.city);
    const restoreFocus = Boolean(event.target.closest('.pc-city-button'));
    setOpen(city, !isOpen(city)); render();
    if (restoreFocus) [...body.querySelectorAll('.pc-city-row')].find(row => row.dataset.city === city.n)?.querySelector('button')?.focus({ preventScroll: true });
  });
  byId('province-cities-count').textContent = `${data.cities.length} 个城市`;
  byId('province-cities-sources').innerHTML = data.sources.map(source => `<li><a href="${escapeHTML(source.url)}"${source.url.startsWith('https://') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(source.label)}</a></li>`).join('');
  new ResizeObserver(syncOverflow).observe(wrap);
  window.addEventListener('resize', syncOverflow);
  renderRankings(); render();
})();
