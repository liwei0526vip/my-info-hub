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
  // [year, month, 0] resolves to the last day of that month, keeping the domain on month boundaries.
  const lastDateParts = dates => {
    const [year, month] = dates.reduce((max, date) => date > max ? date : max).split('-').map(Number);
    return [year, month, 0];
  };
  const chartWidth = id => Math.max(280, Math.round(byId(id).getBoundingClientRect().width));
  const sourceLink = point => `<a href="${escapeHTML(point.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(point.provider)} ↗</a>`;
  const sourceAttributes = (point, label) => `href="${escapeHTML(point.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(label)}，查看${escapeHTML(point.provider)}来源（新窗口）"`;
  const scale = (maximum, intervals = 5) => {
    const rawStep = maximum / intervals;
    const base = 10 ** Math.floor(Math.log10(rawStep));
    const step = [1, 2, 2.5, 5, 10].find(value => value * base >= rawStep) * base;
    return { step, maximum: Math.ceil(maximum / step) * step };
  };
  // Month-label spacing shared by all trend charts: about one label per 85px of chart width.
  const monthStepFor = (width, startISO, endISO) => {
    const months = (Number(endISO.slice(0, 4)) * 12 + Number(endISO.slice(5, 7))) - (Number(startISO.slice(0, 4)) * 12 + Number(startISO.slice(5, 7)));
    const maxLabels = Math.min(12, Math.max(3, Math.floor(width / 85)));
    return [1, 2, 3, 4, 6, 12].find(step => months / step <= maxLabels) ?? 12;
  };
  // One chart per statistical basis; brands sharing a metric stay comparable on the same chart.
  const userCharts = {
    mau: { heading: 'App 月活' },
    wau: { heading: '周活（WAU）' },
    cumulative: { heading: '累计用户' },
  };
  const metricKeyOf = entry => (/周活/.test(entry.metric) ? 'wau' : /累计/.test(entry.metric) ? 'cumulative' : 'mau');

  function renderUserChart(key) {
    const chart = userCharts[key];
    const allSeries = Object.entries(data.users).map(([id, entry]) => ({
      ...entry, id,
      points: [...entry.points].filter(point => point.date >= data.usersStart && point.date <= data.checkedOn).sort((a, b) => a.date.localeCompare(b.date)),
    }));
    const series = allSeries.filter(entry => metricKeyOf(entry) === key);
    const allPoints = series.flatMap(entry => entry.points);
    const width = chartWidth(`${key}-chart`), height = 324;
    const left = 58, right = width - 24, top = 22, bottom = height - 40;
    // The time domain hugs this chart's records; empty charts fall back to the checked window.
    const dates = allPoints.map(point => point.date);
    const startISO = dates.length ? `${dates.reduce((min, date) => date < min ? date : min).slice(0, 7)}-01` : data.usersStart;
    const endISO = dates.length ? new Date(Date.UTC(...lastDateParts(dates))).toISOString().slice(0, 10) : data.checkedOn;
    const domainStart = timestamp(startISO), domainEnd = timestamp(endISO);
    const x = date => left + (timestamp(date) - domainStart) / (domainEnd - domainStart) * (right - left);
    // The panel heading already names the chart, so only the period stays visible here.
    byId(`${key}-context`).innerHTML = `<span class="chart-period">${dateText(startISO).slice(0, 7)} — ${dateText(endISO).slice(0, 7)}</span>`;
    byId(`${key}-legend`).innerHTML = series.map(entry => `<li style="--series-color:${escapeHTML(entry.color)}"><span class="legend-line" aria-hidden="true"></span><strong>${escapeHTML(entry.name)}</strong></li>`).join('');
    if (!allPoints.length) {
      byId(`${key}-chart`).textContent = '尚无可核实的用户规模记录。';
      return;
    }

    const axis = scale(Math.max(...allPoints.map(point => point.value)) * 1.15);
    const ticks = Array.from({ length: Math.round(axis.maximum / axis.step) + 1 }, (_, index) => index * axis.step);
    const y = value => bottom - value / axis.maximum * (bottom - top);
    let grid = ticks.map(value => `<line class="chart-grid" x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}"/><text class="chart-axis-label" x="${left - 8}" y="${y(value) + 3}" text-anchor="end">${number(value / 10000)}</text>`).join('');
    const tick = new Date(domainStart);
    const monthStep = monthStepFor(width, startISO, endISO);
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
        return `<a class="source-point" ${sourceAttributes(point, label)}><title>${escapeHTML(entry.name)}</title><circle class="chart-point ${point.tier}" cx="${x(point.date)}" cy="${y(point.value)}" r="4"/></a>`;
      }).join('');
      // Group titles keep the visible hover text to the brand name; the links' aria-labels still carry full context for screen readers.
      return `<g class="users-series" data-brand="${escapeHTML(entry.id)}" style="--series-color:${escapeHTML(entry.color)}"><title>${escapeHTML(entry.name)}</title>${lines}${markers}</g>`;
    }).join('');
    byId(`${key}-chart`).innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="${chart.heading}趋势图，线性刻度，单位万，时间从 ${dateText(startISO).slice(0, 7)} 起"><title>${escapeHTML(chart.heading)}</title><desc>各品牌统计口径见页面说明。实心点为官方披露，空心点为第三方补充估算；大于号表示下限。虚线仅连接同范围记录，未披露时段不补零。点击数据点可查阅来源。</desc><g aria-hidden="true">${grid}</g>${curves}</svg>`;
  }

  // Company trends: listed market caps and unlisted funding valuations, one chart each on the same page.
  const companyCharts = {
    listed: {
      title: '上市市值趋势',
      desc: '智谱（2513.HK）上市后的市值关键节点，港元市值按 ≈7.8 折算美元；历史快照，非实时行情。空心点为近似折算，点击数据点可查阅来源。',
    },
    unlisted: {
      title: '未上市估值趋势',
      desc: '未上市模型公司的融资估值，按各自披露日期定位；空心点为报道值或近似折算，虚线仅连接相邻披露，未披露时段不补值。点击数据点可查阅来源。',
    },
  };

  function renderCompanyChart(key) {
    const chart = companyCharts[key];
    const series = data.companies[key].map(entry => ({ ...entry, points: [...entry.points].sort((a, b) => a.date.localeCompare(b.date)) }));
    byId(`${key}-legend`).innerHTML = series.map(entry => `<li style="--series-color:${escapeHTML(entry.color)}"><span class="legend-line" aria-hidden="true"></span><strong>${escapeHTML(entry.name)}</strong></li>`).join('');
    const records = series.flatMap(entry => entry.points.map(point => ({ ...point, name: entry.name, color: entry.color })));
    if (!records.length) {
      byId(`${key}-chart`).textContent = '尚无可核实的记录。';
      return;
    }
    const width = chartWidth(`${key}-chart`), height = 264;
    const left = 52, right = width - 14, top = 16, bottom = height - 34;
    const dates = records.map(record => record.date);
    const startISO = `${dates.reduce((min, date) => date < min ? date : min).slice(0, 7)}-01`;
    const endISO = new Date(Date.UTC(...lastDateParts(dates))).toISOString().slice(0, 10);
    const domainStart = timestamp(startISO), domainEnd = timestamp(endISO);
    const x = date => left + (timestamp(date) - domainStart) / (domainEnd - domainStart) * (right - left);
    const axis = scale(Math.max(...records.map(record => record.value)) * 1.15);
    const ticks = Array.from({ length: Math.round(axis.maximum / axis.step) + 1 }, (_, index) => index * axis.step);
    const y = value => bottom - value / axis.maximum * (bottom - top);
    // Chart essentials only: the panel heading names the chart, so the context line keeps just unit and period.
    byId(`${key}-context`).innerHTML = `<strong>亿美元</strong><span class="chart-period">${dateText(startISO).slice(0, 7)} — ${dateText(endISO).slice(0, 7)}</span>`;
    // Values are stored as USD billions; axis and hover values display in 亿美元 (×10).
    let grid = ticks.map(value => `<line class="chart-grid" x1="${left}" y1="${y(value)}" x2="${right}" y2="${y(value)}"/><text class="chart-axis-label" x="${left - 8}" y="${y(value) + 3}" text-anchor="end">${number(value * 10)}</text>`).join('');
    // Time labels thin out to what the width fits; no tick stubs or year boundaries.
    const monthStep = monthStepFor(width, startISO, endISO);
    const tick = new Date(domainStart);
    while (tick.getTime() <= domainEnd) {
      const date = tick.toISOString().slice(0, 10);
      const label = date.slice(0, 7).replace('-', '.');
      grid += `<text class="chart-axis-label" x="${x(date)}" y="${bottom + 18}" text-anchor="middle">${label}</text>`;
      tick.setUTCMonth(tick.getUTCMonth() + monthStep);
    }
    const curves = series.map(entry => {
      const coordinates = entry.points.map(point => `${x(point.date)},${y(point.value)}`).join(' ');
      const markers = entry.points.map(point => {
        const value = displayValue(point, 0.1);
        const label = `${entry.name}，${dateText(point.date)}，${point.basis} ${value} 亿美元`;
        return `<a class="source-point" ${sourceAttributes(point, label)}><title>${escapeHTML(entry.name)}</title><circle class="chart-point ${point.relation === 'eq' ? 'official' : ''}" cx="${x(point.date)}" cy="${y(point.value)}" r="4"/></a>`;
      }).join('');
      // Group titles keep the visible hover text to the company name; the links' aria-labels still carry full context for screen readers.
      return `<g class="users-series" style="--series-color:${escapeHTML(entry.color)}"><title>${escapeHTML(entry.name)}</title><polyline class="chart-line" aria-hidden="true" points="${coordinates}"/>${markers}</g>`;
    }).join('');
    byId(`${key}-chart`).innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="group" aria-label="${chart.title}，单位亿美元，线性刻度，时间从 ${dateText(startISO).slice(0, 7)} 起"><title>${escapeHTML(chart.title)}</title><desc>${escapeHTML(chart.desc)}</desc><g aria-hidden="true">${grid}</g>${curves}</svg>`;
  }

  const chartIds = [...Object.keys(userCharts), ...Object.keys(companyCharts)].map(key => `${key}-chart`).filter(id => byId(id));
  const renderCharts = () => {
    for (const key of Object.keys(userCharts)) if (byId(`${key}-chart`)) renderUserChart(key);
    for (const key of Object.keys(companyCharts)) if (byId(`${key}-chart`)) renderCompanyChart(key);
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
