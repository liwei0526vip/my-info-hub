/* Shared rendering for the separate model and Agent timelines. */
(() => {
  const events = JSON.parse(document.getElementById('timeline-data').textContent);
  const products = JSON.parse(document.getElementById('timeline-products').textContent);
  const kind = document.body.dataset.timelineKind;
  const productIds = new Set(products.map(product => product.id));
  const yearFilter = document.getElementById('year-filter');
  const charts = document.getElementById('charts');
  const chartShell = document.querySelector('.compare-shell');
  const empty = document.getElementById('empty-comparison');
  let timeOrder = 'desc';
  let selectedYear = 'all';

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));
  const pageEvents = events.filter(event => productIds.has(event.brand) && event.kind === kind);
  const years = [...new Set(pageEvents.map(event => event.date.slice(0, 4)))].sort().reverse();
  const recentYears = years.slice(0, 3);
  const earlierThan = recentYears.at(-1);
  const options = [{ value: 'all', label: '全部' }, ...recentYears.map(year => ({ value: year, label: year }))];
  if (years.length > recentYears.length) options.push({ value: 'earlier', label: '更早', title: `${earlierThan} 年以前` });
  yearFilter.innerHTML = options.map(option => `<button type="button" data-year="${option.value}" aria-pressed="${option.value === selectedYear}"${option.title ? ` title="${option.title}" aria-label="${option.title}"` : ''}>${option.label}</button>`).join('');

  function eventCard(event) {
    return `<article class="event event-${escapeHTML(event.kind)}" data-kind="${escapeHTML(event.kind)}" data-date="${escapeHTML(event.date)}"><div class="event-top"><time datetime="${escapeHTML(event.date)}">${escapeHTML(event.date.replaceAll('-', '.'))}</time>${event.tag === '发布' ? '' : `<span class="tag">${escapeHTML(event.tag)}</span>`}</div><h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.desc)}</p><a class="source" href="${escapeHTML(event.source)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(event.title)}：查看官方来源">官方来源 ↗</a></article>`;
  }

  function render() {
    const descending = timeOrder === 'desc';
    const filtered = pageEvents.filter(event => selectedYear === 'all' ||
      (selectedYear === 'earlier' ? event.date.slice(0, 4) < earlierThan : event.date.startsWith(selectedYear)))
      .sort((a, b) => (descending ? -1 : 1) * a.date.localeCompare(b.date));
    const months = [...new Set(filtered.map(event => event.date.slice(0, 7)))];
    const grouped = new Map();
    for (const event of filtered) {
      const key = `${event.date.slice(0, 7)}:${event.brand}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(event);
    }
    charts.style.setProperty('--products', Math.max(1, products.length));
    const nextOrder = descending ? '最早在前' : '最新在前';
    let content = `<div class="comparison-head"><div class="axis-heading"><button class="axis-sort" id="time-order" type="button" aria-label="按年月排序，当前${descending ? '最新在前' : '最早在前'}，点击切换为${nextOrder}" title="切换为${nextOrder}">年月 <span aria-hidden="true">${descending ? '↓' : '↑'}</span></button></div>` +
      products.map(product => `<header class="product-heading" id="${escapeHTML(product.id)}"><small>${escapeHTML(product.company)}</small><h2>${escapeHTML(product.name)}</h2></header>`).join('') + '</div>';
    let priorYear = '';
    for (const month of months) {
      const year = month.slice(0, 4);
      const isNew = year !== priorYear;
      content += `<section class="month-row ${isNew ? 'year-divider' : ''}" aria-label="${year}年${Number(month.slice(5))}月"><div class="month-label">${isNew ? '<i class="year-start"></i>' : ''}<strong>${year}</strong><span>${month.slice(5)} 月</span></div>`;
      for (const product of products) {
        const items = grouped.get(`${month}:${product.id}`) ?? [];
        content += `<div class="stream" data-product="${escapeHTML(product.id)}" data-name="${escapeHTML(product.name)}" aria-label="${escapeHTML(product.name)} ${month}">${items.length ? items.map(eventCard).join('') : '<div class="month-empty">无收录节点</div>'}</div>`;
      }
      content += '</section>';
      priorYear = year;
    }
    charts.innerHTML = content;
    chartShell.hidden = filtered.length === 0;
    empty.hidden = filtered.length > 0;
    empty.textContent = '当前年份没有收录事件，请更换年份。';
  }

  charts.addEventListener('click', event => {
    if (!event.target.closest('#time-order')) return;
    timeOrder = timeOrder === 'desc' ? 'asc' : 'desc';
    render();
    document.getElementById('time-order').focus({ preventScroll: true });
  });
  yearFilter.addEventListener('click', event => {
    const button = event.target.closest('button[data-year]');
    if (!button || selectedYear === button.dataset.year) return;
    selectedYear = button.dataset.year;
    yearFilter.querySelectorAll('button[data-year]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  });
  render();
})();
