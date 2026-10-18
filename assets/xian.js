/* Xi'an overview, development and travel with sourced references and district comparisons. */
(() => {
  const byId = id => document.getElementById(id);
  const data = JSON.parse(byId('xian-data').textContent);
  const body = byId('xian-district-rows');
  const table = byId('xian-district-table');
  const wrap = document.querySelector('.xa-table-wrap');
  const heads = [...table.querySelectorAll('th[data-sort]')];
  const state = { sort: { key: 'gdp', dir: -1 } };
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
      const rank = ranked ? ranks.get(district.id) : i + 1;
      return `<tr class="xa-district-row">
        <td class="xa-rank-cell"><span class="xa-rank-badge${ranked && rank <= 3 ? ` xa-rank-badge--${rank}` : ''}"${ranked ? ` title="${metricLabel}第 ${rank} 名"` : ''}>${rank}</span></td>
        <th scope="row" class="cr-name">${escape(district.n)}</th>
        <td class="num" title="${number(district.pop)}万人 · 2024 年末常住人口">${formats.pop(district.pop)}</td>
        <td class="num" title="${number(district.area)}平方公里 · 行政区划面积，2023 年数据">${formats.area(district.area)}</td>
        <td class="num xa-gdp-value" title="${number(district.gdp)}亿元 · 2024 年">${formats.gdp(district.gdp)}</td>
        <td class="xa-focus">${escape(district.focus)}</td>
      </tr>`;
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
      return `<figure class="cr-chart cr-chart--${metric.key}" aria-labelledby="xa-ranking-${metric.key}"><figcaption><svg class="xa-ranking-icon" aria-hidden="true"><use href="#xa-icon-${metric.icon}"/></svg><h4 id="xa-ranking-${metric.key}">${metric.label} TOP5</h4><span class="cr-chart-note">${units[metric.key]}</span></figcaption><ol class="cr-chart-list">${districts.map((district, i) => `<li data-name="${escape(district.n)}" aria-label="第 ${i + 1} 名，${escape(district.n)}，${formats[metric.key](district[metric.key])}${units[metric.key]}"><span class="cr-rank-number" aria-hidden="true">${i + 1}</span><span class="cr-chart-name">${escape(district.n)}</span><span class="cr-chart-track" aria-hidden="true"><span class="cr-chart-bar" style="width:${(district[metric.key] / maximum * 100).toFixed(2)}%"></span></span><span class="cr-chart-value" title="${number(district[metric.key])}${units[metric.key]}">${formats[metric.key](district[metric.key])}</span></li>`).join('')}</ol><p class="xa-ranking-year">${metric.note}</p></figure>`;
    }).join('');
  }

  function renderChanges() {
    const series = [...data.annualSeries].sort((a, b) => a.year - b.year);
    const first = series[0];
    const last = series[series.length - 1];
    const metrics = [
      { key: 'pop', name: '常住人口', unit: '万人 · 年末', delta: `较 ${first.year} 年增加 ${number(last.pop - first.pop)}`, padding: 1 },
      { key: 'growth', name: 'GDP 实际增速', unit: '% · 不变价', delta: '官方同比增速 · 按不变价计算', padding: 0.1 },
      { key: 'urban', name: '城镇化率', unit: '% · 年末', delta: `较 ${first.year} 年提高 ${number(last.urban - first.urban)} 个百分点`, padding: 0.1 },
    ];
    byId('xian-trends').innerHTML = metrics.map(metric => {
      const values = series.map(row => row[metric.key]);
      const padding = Math.max((Math.max(...values) - Math.min(...values)) * 0.3, metric.padding);
      const low = Math.min(...values) - padding;
      const high = Math.max(...values) + padding;
      const y = value => 112 - (value - low) / (high - low) * 76;
      const points = series.map((row, i) => ({ x: 80 + i / (series.length - 1) * 230, y: y(row[metric.key]), row }));
      const grid = [low, (low + high) / 2, high].map(value => `<line x1="55" y1="${y(value).toFixed(2)}" x2="338" y2="${y(value).toFixed(2)}" class="xa-trend-grid"/><text x="46" y="${(y(value) + 3).toFixed(2)}" class="xa-trend-tick" text-anchor="end">${number(value)}</text>`).join('');
      const description = series.map(row => `${row.year} 年 ${number(row[metric.key])}`).join('，');
      return `<figure class="xa-trend xa-trend--${metric.key}" aria-labelledby="xa-trend-${metric.key}"><figcaption><h4 id="xa-trend-${metric.key}">${metric.name}</h4><span>${metric.unit}</span></figcaption><svg viewBox="0 0 360 150" width="360" height="150" role="img" aria-labelledby="xa-trend-title-${metric.key}"><title id="xa-trend-title-${metric.key}">${metric.name}（${metric.unit}）：${description}。纵轴分别缩放。</title>${grid}<polyline class="xa-trend-line" points="${points.map(point => `${point.x},${point.y.toFixed(2)}`).join(' ')}"/>${points.map(point => `<circle class="xa-trend-point" cx="${point.x}" cy="${point.y.toFixed(2)}" r="3.5"/><text class="xa-trend-value" x="${point.x}" y="${(point.y - 10).toFixed(2)}" text-anchor="middle">${number(point.row[metric.key])}</text><text class="xa-trend-year" x="${point.x}" y="136" text-anchor="middle">${point.row.year}</text>`).join('')}</svg><p>${metric.delta}</p></figure>`;
    }).join('');
    byId('xian-annual-rows').innerHTML = series.map(row => `<tr><th scope="row">${link(row.source, row.year)}</th><td class="num">${number(row.pop)}</td><td class="num">${number(row.gdp)}</td><td class="num">${number(row.growth)}</td><td class="num">${number(row.urban)}</td></tr>`).join('');
  }

  function renderSights() {
    byId('xian-sight-rows').innerHTML = data.sightGroups.map(group => {
      const sights = data.sights.filter(sight => sight.category === group.id);
      return `<section class="xa-sight-category" id="sights-${escape(group.id)}" aria-labelledby="sights-${escape(group.id)}-heading">
        <h4 class="xa-sight-heading" id="sights-${escape(group.id)}-heading">${escape(group.name)}<small>${sights.length} 处</small></h4>
        <dl class="xa-sight-list">
          ${sights.map(sight => `<div class="xa-sight-item" id="xian-sight-${escape(sight.id)}"><dt class="xa-sight-name">${link(sight.url, sight.name)}</dt><dd>${escape(sight.focus)}</dd></div>`).join('')}
        </dl>
      </section>`;
    }).join('');
  }

  byId('xian-history').innerHTML = data.history.map(item => `<li><span class="xa-history-period">${escape(item.period)}</span><h4>${link(item.source, item.name)}</h4><p>${escape(item.summary)}</p><small>${escape(item.trace)}</small></li>`).join('');
  byId('xian-culture').innerHTML = data.culture.map(item => `<div><dt>${link(item.source, item.name)}</dt><dd>${escape(item.summary)}</dd></div>`).join('');
  byId('xian-metro-count').textContent = data.metroLines.length;
  byId('xian-transport-checked').textContent = data.transportCheckedOn.replaceAll('-', '.');
  byId('xian-transport-checked').setAttribute('datetime', data.transportCheckedOn);
  byId('xian-metro-lines').innerHTML = data.metroLines.map(line => `<li id="xian-metro-line-${line.line}"><span class="xa-metro-line">${number(line.line)} 号线</span><span>${line.circular ? '环线' : `${escape(line.from)} — ${escape(line.to)}`}</span></li>`).join('');
  byId('xian-industry-rows').innerHTML = data.industries.map(item => `<tr><td>${link(item.source, item.name)}<small>${escape(item.description)}</small></td><td>${escape(item.examples.join('、'))}</td><td>${escape(item.zones.join('、'))}</td></tr>`).join('');
  byId('xian-university-rows').innerHTML = data.universities.map(school => `<tr><td>${link(school.url, school.name)}<small class="xa-school-meta"><span>${escape(school.short)}</span>${(school.programs || []).map(program => `<span class="xa-school-badge xa-school-badge--${escape(program)}" title="${escape(program)}工程高校">${escape(program)}</span>`).join('')}</small></td><td>${escape(school.fields)}</td><td>${school.campuses.map(campus => `<span class="xa-campus">${escape(campus.name)} · ${escape(campus.district)}</span>`).join('')}</td></tr>`).join('');
  byId('xian-food-list').innerHTML = data.foods.map(food => `<li id="xian-food-${escape(food.id)}">${link(food.url, food.name)}</li>`).join('');
  byId('xian-zones').innerHTML = data.zones.map(zone => `<div class="xa-zone"><dt>${link(zone.url, zone.name)}</dt><dd>${escape(zone.focus)}</dd></div>`).join('');
  byId('xian-sources').innerHTML = data.sources.map(source => `<li>${link(source.url, source.label)}</li>`).join('');
  heads.forEach(head => head.addEventListener('click', () => {
    const key = head.dataset.sort;
    state.sort.dir = state.sort.key === key ? -state.sort.dir : key === 'n' ? 1 : -1;
    state.sort.key = key;
    renderDistricts();
  }));
  new ResizeObserver(syncOverflow).observe(wrap);
  window.addEventListener('resize', syncOverflow);
  renderDistricts();
  renderRankings();
  renderChanges();
  renderSights();
})();
