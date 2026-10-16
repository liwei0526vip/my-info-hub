/* Sortable Xi'an district reference with editorial context and local campus links. */
(() => {
  const byId = id => document.getElementById(id);
  const data = JSON.parse(byId('xian-data').textContent);
  const body = byId('xian-district-rows');
  const table = byId('xian-district-table');
  const wrap = document.querySelector('.xa-table-wrap');
  const heads = [...table.querySelectorAll('th[data-sort]')];
  const state = { sort: { key: 'gdp', dir: -1 }, expanded: new Set() };
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const number = (value, digits = 2) => new Intl.NumberFormat('zh-CN', { useGrouping: false, maximumFractionDigits: digits }).format(value);
  const formats = { pop: value => number(value), area: value => number(value), gdp: value => number(value) };
  const units = { pop: '万人', area: '平方公里', gdp: '亿元' };
  const sort = (key, dir) => [...data.districts].sort((a, b) => dir * (typeof a[key] === 'string' ? a[key].localeCompare(b[key], 'zh-CN') : a[key] - b[key]));
  const link = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}</a>`;

  function syncOverflow() {
    const overflow = wrap.scrollWidth > wrap.clientWidth;
    wrap.classList.toggle('has-overflow', overflow);
    wrap.style.setProperty('--cr-header-height', `${table.querySelector('thead').getBoundingClientRect().height}px`);
    byId('xian-table-hint').hidden = !overflow;
  }

  function renderDistricts() {
    const ranked = state.sort.key !== 'n';
    const ranks = new Map(sort(state.sort.key, -1).map((district, i) => [district.id, i + 1]));
    const metricLabel = { pop: '人口', area: '面积', gdp: 'GDP' }[state.sort.key];
    byId('xian-rank-label').textContent = ranked ? '排名' : '序号';
    byId('xian-rank-heading').setAttribute('title', ranked ? `按${metricLabel}从高到低排名` : '按当前区县名称顺序编号');
    body.innerHTML = sort(state.sort.key, state.sort.dir).map((district, i) => {
      const open = state.expanded.has(district.n);
      const rank = ranked ? ranks.get(district.id) : i + 1;
      const row = `<tr class="xa-district-row" data-district="${escape(district.n)}" aria-expanded="${open}">
        <td class="xa-rank-cell"><span class="xa-rank-badge${ranked && rank <= 3 ? ` xa-rank-badge--${rank}` : ''}"${ranked ? ` title="${metricLabel}第 ${rank} 名"` : ''}>${rank}</span></td>
        <td class="cr-name"><button class="cr-province-button xa-district-button" type="button" aria-expanded="${open}" aria-controls="xian-detail-${district.id}" aria-label="${open ? '收起' : '展开'}${escape(district.n)}资料"><span class="cr-toggle" aria-hidden="true">▸</span>${escape(district.n)}</button></td>
        <td class="num" title="${number(district.pop)}万人 · 2024 年末常住人口">${formats.pop(district.pop)}</td>
        <td class="num" title="${number(district.area)}平方公里 · 行政区划面积，2023 年数据">${formats.area(district.area)}</td>
        <td class="num xa-gdp-value" title="${number(district.gdp)}亿元 · 2024 年">${formats.gdp(district.gdp)}</td>
        <td class="xa-focus">${escape(district.focus)}</td>
      </tr>`;
      const campuses = data.universities.flatMap(school => school.campuses.filter(campus => campus.district === district.n).map(campus => `${school.short}·${campus.name}`));
      const details = `<tr class="xa-detail-row" id="xian-detail-${district.id}"${open ? '' : ' hidden'}><td colspan="6"><dl class="xa-detail"><dt>区域特点</dt><dd>${escape(district.about)}</dd>${campuses.length ? `<dt>代表高校</dt><dd>${escape(campuses.join('、'))}</dd>` : ''}</dl><p class="xa-data-links">${link(data.metricSource, '人口与 GDP 原表 ↗')}${link(data.areaSource, '面积原表 ↗')}${link(data.contextSource, '产业布局参考 ↗')}</p></td></tr>`;
      return row + details;
    }).join('');
    heads.forEach(head => {
      const active = head.dataset.sort === state.sort.key;
      head.classList.toggle('is-sorted', active);
      head.setAttribute('aria-sort', active ? state.sort.dir === 1 ? 'ascending' : 'descending' : 'none');
      head.querySelector('.cr-sort-icon').textContent = active ? state.sort.dir === 1 ? '↑' : '↓' : '↕';
      const label = { n: '区县', pop: '人口', area: '面积', gdp: 'GDP' }[head.dataset.sort];
      const next = active ? -state.sort.dir : head.dataset.sort === 'n' ? 1 : -1;
      head.querySelector('button').setAttribute('aria-label', `按${label}${next === 1 ? '升序' : '降序'}排列`);
    });
    syncOverflow();
  }

  function renderRankings() {
    byId('xian-rankings').innerHTML = [
      { key: 'pop', label: '人口', note: '2024 年末', icon: 'people' },
      { key: 'area', label: '面积', note: '2023 年', icon: 'map' },
      { key: 'gdp', label: 'GDP', note: '2024 年', icon: 'chart' },
    ].map(metric => {
      const districts = sort(metric.key, -1).slice(0, 5);
      const maximum = districts[0][metric.key];
      return `<figure class="cr-chart cr-chart--${metric.key}" aria-labelledby="xa-ranking-${metric.key}"><figcaption><svg class="xa-ranking-icon" aria-hidden="true"><use href="#xa-icon-${metric.icon}"/></svg><h2 id="xa-ranking-${metric.key}">${metric.label} TOP5</h2><span class="cr-chart-note">${units[metric.key]}</span></figcaption><ol class="cr-chart-list">${districts.map((district, i) => `<li data-name="${escape(district.n)}" aria-label="第 ${i + 1} 名，${escape(district.n)}，${formats[metric.key](district[metric.key])}${units[metric.key]}"><span class="cr-rank-number" aria-hidden="true">${i + 1}</span><span class="cr-chart-name">${escape(district.n)}</span><span class="cr-chart-track" aria-hidden="true"><span class="cr-chart-bar" style="width:${(district[metric.key] / maximum * 100).toFixed(2)}%"></span></span><span class="cr-chart-value" title="${number(district[metric.key])}${units[metric.key]}">${formats[metric.key](district[metric.key])}</span></li>`).join('')}</ol><p class="xa-ranking-year">${metric.note}</p></figure>`;
    }).join('');
  }

  byId('xian-industry-rows').innerHTML = data.industries.map(item => `<tr><td>${link(item.source, item.name)}<small>${escape(item.description)}</small></td><td>${escape(item.examples.join('、'))}</td><td>${escape(item.zones.join('、'))}</td></tr>`).join('');
  byId('xian-university-rows').innerHTML = data.universities.map(school => `<tr><td>${link(school.url, school.name)}<small class="xa-school-meta"><span>${escape(school.short)}</span>${(school.programs || []).map(program => `<span class="xa-school-badge xa-school-badge--${escape(program)}" title="${escape(program)}工程高校">${escape(program)}</span>`).join('')}</small></td><td>${escape(school.fields)}</td><td>${school.campuses.map(campus => `<span class="xa-campus">${escape(campus.name)} · ${escape(campus.district)}</span>`).join('')}</td></tr>`).join('');
  byId('xian-zones').innerHTML = data.zones.map(zone => `<dt>${link(zone.url, zone.name)}</dt><dd>${escape(zone.focus)}</dd>`).join('');
  byId('xian-sources').innerHTML = data.sources.map(source => `<li>${link(source.url, source.label)}</li>`).join('');
  heads.forEach(head => head.addEventListener('click', () => {
    const key = head.dataset.sort;
    state.sort.dir = state.sort.key === key ? -state.sort.dir : key === 'n' ? 1 : -1;
    state.sort.key = key;
    renderDistricts();
  }));
  body.addEventListener('click', event => {
    const row = event.target.closest('.xa-district-row');
    if (!row) return;
    const name = row.dataset.district;
    const restoreFocus = Boolean(event.target.closest('.xa-district-button'));
    state.expanded.has(name) ? state.expanded.delete(name) : state.expanded.add(name);
    renderDistricts();
    if (restoreFocus) [...body.querySelectorAll('.xa-district-row')].find(row => row.dataset.district === name)?.querySelector('button')?.focus({ preventScroll: true });
  });
  new ResizeObserver(syncOverflow).observe(wrap);
  window.addEventListener('resize', syncOverflow);
  renderDistricts();
  renderRankings();
})();
