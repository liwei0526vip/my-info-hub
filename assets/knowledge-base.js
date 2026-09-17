(() => {
  'use strict';
  const wireFilter = (prefix, tableClass, fields) => {
    const search = document.getElementById(`${prefix}-search`);
    const rows = [...document.querySelectorAll(`.${tableClass} tbody tr`)];
    const controls = fields.map(field => [field, document.getElementById(`${prefix}-${field}`)]);
    const apply = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      rows.forEach(row => {
        const match = row.dataset.search.toLocaleLowerCase().includes(query) &&
          controls.every(([field, control]) => control.value === 'all' || row.dataset[field] === control.value);
        row.hidden = !match;
        if (match) visible++;
      });
      document.getElementById(`${prefix}-count`).textContent = `显示 ${visible} / ${rows.length} 项`;
      document.getElementById(`${prefix}-empty`).hidden = visible > 0;
    };
    search.addEventListener('input', apply);
    controls.forEach(([, control]) => control.addEventListener('change', apply));
    document.getElementById(`${prefix}-reset`).addEventListener('click', () => {
      search.value = '';
      controls.forEach(([, control]) => { control.value = 'all'; });
      apply();
    });
    apply();
  };
  wireFilter('product', 'product-table', ['region', 'layer']);
  wireFilter('oss', 'oss-table', ['family']);
  const scenarioButtons = [...document.querySelectorAll('[data-scenario]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  scenarioButtons.forEach(button => button.addEventListener('click', () => {
    scenarioButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== button.dataset.scenario; });
  }));
  const nav = document.querySelector('.section-nav');
  const syncNavHeight = () => document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);
  syncNavHeight();
  if ('ResizeObserver' in window) new ResizeObserver(syncNavHeight).observe(nav);
  else window.addEventListener('resize', syncNavHeight);
})();
