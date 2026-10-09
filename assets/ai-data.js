/* Embedded data keeps these charts usable from local files, with no network dependency. */
(() => {
  const data = JSON.parse(document.getElementById('ai-data').textContent);
  const byId = id => document.getElementById(id);
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
  const number = value => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value);
  const displayValue = (point, divisor = 1) => `${point.relation === 'gt' ? '>' : point.relation === 'approx' ? '≈' : ''}${number(point.value / divisor)}`;
  const dateText = value => value.replaceAll('-', '.');
  const timestamp = date => Date.parse(`${date}T00:00:00Z`);
  const chartWidth = id => Math.max(280, Math.round(byId(id).getBoundingClientRect().width));
  const sourceLink = point => `<a href="${escapeHTML(point.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(point.provider)} ↗</a>`;
  const sourceAttributes = (point, label) => `href="${escapeHTML(point.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(label)}，查看${escapeHTML(point.provider)}来源（新窗口）"`;
  const scale = (maximum, intervals = 5) => {
    const rawStep = maximum / intervals;
    const base = 10 ** Math.floor(Math.log10(rawStep));
    const step = [1, 2, 2.5, 5, 10].find(value => value * base >= rawStep) * base;
    return { step, maximum: Math.ceil(maximum / step) * step };
  };
  const setPressed = (selector, key, selected) => {
    document.querySelectorAll(selector).forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset[key] === selected));
    });
  };
  let userScale = 'log';
  let companyView = 'valuation';

  function renderUsers() {
    const series = Object.entries(data.users).map(([id, entry]) => ({
      ...entry, id,
      points: [...entry.points].filter(point => point.date >= data.usersStart && point.date <= data.checkedOn).sort((a, b) => a.date.localeCompare(b.date)),
    }));
    const allPoints = series.flatMap(entry => entry.points);
    const width = chartWidth('users-chart'), height = 324;
    const left = 58, right = width - 24, top = 22, bottom = height - 40;
    const domainStart = timestamp(data.usersStart), domainEnd = timestamp(data.checkedOn);
    const x = date => left + (timestamp(date) - domainStart) / (domainEnd - domainStart) * (right - left);
    const isLog = userScale === 'log';
    const axisName = isLog ? '对数刻度' : '线性刻度';
    byId('users-context').innerHTML = `<strong>用户规模 · 万 · ${axisName}</strong><span class="chart-period">${dateText(data.usersStart).slice(0, 7)} — ${dateText(data.checkedOn).slice(0, 7)}</span>`;
    byId('users-legend').innerHTML = series.map(entry => `<li style="--series-color:${escapeHTML(entry.color)}"><span class="legend-line" aria-hidden="true"></span><span><strong>${escapeHTML(entry.name)}</strong><small>${escapeHTML(entry.metric)}</small></span></li>`).join('');
    byId('users-table-caption').textContent = '公开用户规模记录 · 按统计时间排序';
    byId('users-scope-notes').innerHTML = series.filter(entry => entry.note).map(entry => `<li><strong>${escapeHTML(entry.name)}</strong>：${escapeHTML(entry.note)}${entry.noteUrl ? ` ${sourceLink({ url: entry.noteUrl, provider: '说明来源' })}` : ''}</li>`).join('');
    const sourceRecords = series.flatMap(entry => entry.points.map(point => ({ ...point, brand: entry.name, color: entry.color })));
    (data.disclosures || []).forEach(point => {
      const entry = data.users[point.brand];
      sourceRecords.push({ ...point, brand: entry.name, color: entry.color, independent: true });
    });
    byId('users-rows').innerHTML = sourceRecords.sort((a, b) => a.date.localeCompare(b.date)).map(point => `<tr><th scope="row"><span class="table-brand" style="--series-color:${escapeHTML(point.color)}"><i aria-hidden="true"></i>${escapeHTML(point.brand)}</span></th><td><time datetime="${point.period || point.date}">${escapeHTML(point.timeLabel)}</time></td><td class="number">${escapeHTML(displayValue(point, 10000))}</td><td>${escapeHTML(point.metric)}${point.independent ? '<span class="source-basis">独立披露 · 不入趋势图</span>' : ''}</td><td><span class="source-basis">${point.tier === 'official' ? '官方披露' : '补充估算'}</span>${sourceLink(point)}</td></tr>`).join('');
    if (!allPoints.length) {
      byId('users-chart').textContent = '尚无可核实的用户规模记录。';
      return;
    }

    const minimum = Math.min(...allPoints.map(point => point.value));
    const maximum = Math.max(...allPoints.map(point => point.value));
    let ticks, y;
    if (isLog) {
      // Numeric ticks retain the actual user counts; only their spacing is logarithmic.
      const candidates = [];
      for (let power = Math.floor(Math.log10(minimum)) - 1; power <= Math.ceil(Math.log10(maximum)) + 1; power++) {
        for (const multiple of [1, 2, 5]) candidates.push(multiple * 10 ** power);
      }
      const floor = candidates.filter(value => value <= minimum / 1.15).at(-1);
      const ceiling = candidates.find(value => value >= maximum * 1.15);
      ticks = candidates.filter(value => value >= floor && value <= ceiling);
      y = value => bottom - (Math.log10(value) - Math.log10(floor)) / (Math.log10(ceiling) - Math.log10(floor)) * (bottom - top);
    } else {
      const axis = scale(maximum * 1.15);
      ticks = Array.from({ length: Math.round(axis.maximum / axis.step) + 1 }, (_, index) => index * axis.step);
      y = value => bottom - value / axis.maximum * (bottom - top);
    }
    let grid = ticks.map(value => `<line class="chart-grid" x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}"/><text class="chart-axis-label" x="${left - 8}" y="${y(value) + 3}" text-anchor="end">${number(value / 10000)}</text>`).join('');
    const tick = new Date(domainStart);
    const monthStep = width < 540 ? 6 : 3;
    while (tick.getTime() <= domainEnd) {
      const date = tick.toISOString().slice(0, 10);
      const label = date.slice(0, 7).replace('-', '.');
      if (tick.getUTCMonth() === 0) grid += `<line class="chart-grid year-boundary" x1="${x(date)}" y1="${top}" x2="${x(date)}" y2="${bottom}"/>`;
      grid += `<line class="chart-axis" x1="${x(date)}" y1="${bottom}" x2="${x(date)}" y2="${bottom + 4}"/><text class="chart-axis-label" x="${x(date)}" y="${bottom + 21}" text-anchor="middle">${label}</text>`;
      tick.setUTCMonth(tick.getUTCMonth() + monthStep);
    }
    const curves = series.map(entry => {
      const scopes = [...new Set(entry.points.map(point => point.scope))];
      const lines = scopes.map(scope => {
        const matching = entry.points.filter(point => point.scope === scope);
        if (matching.length < 2) return '';
        const coordinates = matching.map(point => `${x(point.date)},${y(point.value)}`).join(' ');
        return `<polyline class="chart-line" aria-hidden="true" data-scope="${escapeHTML(scope)}" points="${coordinates}"/>`;
      }).join('');
      const markers = entry.points.map(point => {
        const value = displayValue(point, 10000);
        const label = `${entry.name}，${point.timeLabel}，${point.metric} ${value} 万，${point.tier === 'official' ? '官方披露' : '第三方估算'}`;
        return `<a class="source-point" ${sourceAttributes(point, label)}><title>${escapeHTML(label)}</title><circle class="chart-point ${point.tier}" cx="${x(point.date)}" cy="${y(point.value)}" r="4"/></a>`;
      }).join('');
      return `<g class="users-series" data-brand="${escapeHTML(entry.id)}" style="--series-color:${escapeHTML(entry.color)}">${lines}${markers}</g>`;
    }).join('');
    byId('users-chart').innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="用户规模趋势图，${axisName}，单位万，时间从 2025 年 1 月开始"><title>${escapeHTML(series.map(entry => entry.name).join('、'))} 用户规模</title><desc>各品牌统计口径见图例，不能直接作人数排名。实心点为官方披露，空心点为第三方补充估算；大于号表示下限。虚线仅连接同范围记录，未披露时段不补零。点击数据点可查阅来源。</desc><g aria-hidden="true">${grid}</g>${curves}</svg>`;
  }

  function renderCompanies() {
    const records = [...data.companies[companyView]].sort((a, b) => b.value - a.value);
    const isMarketCap = companyView === 'marketCap';
    const title = isMarketCap ? '上市市值' : '融资估值';
    const width = chartWidth('company-chart'), height = 264;
    const left = 101, right = width - 55, top = 16, bottom = 226;
    const axis = scale(Math.max(...records.map(record => record.value)) * 1.05, 4);
    const x = value => left + value / axis.maximum * (right - left);
    const dates = [...new Set(records.map(record => record.date))];
    const period = dates.length === 1 ? `${dateText(dates[0])} 美股收盘` : '各公司披露日期';
    byId('company-context').innerHTML = `<strong>${title} · 十亿美元</strong><span class="chart-period">${period}</span>`;
    byId('company-note').textContent = isMarketCap ? '公司整体市值，包含非 AI 业务；历史快照，非实时行情。' : '融资估值按各自披露日期记录；“≈”表示近似值。';
    byId('company-table-caption').textContent = `${title} · 美元计价 · 十亿美元`;

    let grid = '';
    for (let value = 0; value <= axis.maximum; value += axis.step) {
      const pos = x(value);
      grid += `<line class="chart-grid" x1="${pos}" y1="${top}" x2="${pos}" y2="${bottom}"/><text class="chart-axis-label" x="${pos}" y="${bottom + 21}" text-anchor="middle">${number(value)}</text>`;
    }
    const rowHeight = (bottom - top) / records.length;
    const bars = records.map((record, index) => {
      const pos = top + rowHeight * (index + 0.5);
      const value = displayValue(record);
      const label = `${record.name}，${dateText(record.date)}，${record.basis} ${value} 十亿美元`;
      return `<a class="company-source" ${sourceAttributes(record, label)}><title>${escapeHTML(label)}</title><text class="company-name" x="0" y="${pos - 2}">${escapeHTML(record.name)}</text><text class="company-meta" x="0" y="${pos + 14}">${escapeHTML(isMarketCap ? record.ticker : dateText(record.date))}</text><rect class="company-bar" x="${left}" y="${pos - 11}" width="${x(record.value) - left}" height="18" rx="3"/><text class="company-value" x="${x(record.value) + 7}" y="${pos + 2}">${escapeHTML(value)}</text></a>`;
    }).join('');
    byId('company-chart').innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="${title}对照图，单位十亿美元"><title>${title}快照</title><desc>${escapeHTML(byId('company-note').textContent)}点击条形可查阅来源。</desc><g aria-hidden="true">${grid}</g>${bars}</svg>`;
    byId('company-rows').innerHTML = records.map(record => `<tr><th scope="row">${escapeHTML(record.name)}</th><td><time datetime="${record.date}">${dateText(record.date)}</time></td><td class="number">${escapeHTML(displayValue(record))}</td><td><span class="source-basis">${escapeHTML(record.basis)}</span>${sourceLink(record)}</td></tr>`).join('');
  }

  document.querySelectorAll('[data-user-scale]').forEach(button => {
    button.addEventListener('click', () => {
      userScale = button.dataset.userScale;
      setPressed('[data-user-scale]', 'userScale', userScale);
      renderUsers();
    });
  });
  document.querySelectorAll('[data-company-view]').forEach(button => {
    button.addEventListener('click', () => {
      companyView = button.dataset.companyView;
      setPressed('[data-company-view]', 'companyView', companyView);
      renderCompanies();
    });
  });

  const chartIds = ['users-chart', 'company-chart'].filter(id => byId(id));
  const renderCharts = () => {
    if (byId('users-chart')) renderUsers();
    if (byId('company-chart')) renderCompanies();
  };
  renderCharts();
  // Observe the frame width, not the page height, so opening source tables does not redraw charts.
  if ('ResizeObserver' in window) {
    let previousWidths = '';
    new ResizeObserver(() => {
      const widths = chartIds.map(chartWidth).join(':');
      if (widths === previousWidths) return;
      previousWidths = widths;
      renderCharts();
    }).observe(document.querySelector('.data-grid'));
  } else {
    window.addEventListener('resize', renderCharts);
  }
})();
