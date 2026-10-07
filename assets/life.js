(() => {
  const table = document.querySelector('#food-calories .calorie-table');
  if (!table) return;

  const section = table.closest('#food-calories');
  const per100Toggle = document.querySelector('#calorie-per-100');
  if (section && per100Toggle) {
    // Start with the compact view even when the browser restores form values.
    per100Toggle.checked = false;
    const updatePer100 = () => section.classList.toggle('show-per-100', per100Toggle.checked);
    updatePer100();
    per100Toggle.addEventListener('change', updatePer100);
    per100Toggle.disabled = false;
  }

  const metrics = {
    energy: { label: '热量', selector: '.energy-column .measure-per-100' },
    protein: { label: '蛋白质', selector: '.nutrient-grid > .measure-pair:nth-child(1) .measure-per-100' },
    fat: { label: '脂肪', selector: '.nutrient-grid > .measure-pair:nth-child(2) .measure-per-100' },
    carbs: { label: '碳水', selector: '.nutrient-grid > .measure-pair:nth-child(3) .measure-per-100' },
    fiber: { label: '纤维', selector: '.nutrient-grid > .measure-pair:nth-child(4) .measure-per-100' },
  };
  const buttons = [...table.querySelectorAll('[data-calorie-sort]')];
  const status = document.querySelector('#calorie-sort-status');
  const groups = [...table.tBodies].map(body => ({
    body,
    rows: [...body.rows].filter(row => row.classList.contains('food-record')),
    category: body.querySelector('.food-category-cell'),
  }));
  let activeKey = null;
  let direction = 'descending';

  function per100Value(row, selector) {
    const text = row.querySelector(selector)?.textContent.trim().replace(/^\/\s*/, '');
    if (!text) return null;
    const value = Number(text);
    return Number.isFinite(value) ? value : null;
  }

  function sortGroups(key) {
    const factor = direction === 'ascending' ? 1 : -1;
    groups.forEach(group => {
      const records = group.rows.map((row, index) => ({
        row,
        index,
        value: per100Value(row, metrics[key].selector),
      }));
      records.sort((a, b) => {
        if (a.value === null && b.value === null) return a.index - b.index;
        if (a.value === null) return 1;
        if (b.value === null) return -1;
        return factor * (a.value - b.value) || a.index - b.index;
      });
      if (!records.length) return;

      // Move the merged category label to the new first row of its own group.
      if (group.category) {
        group.category.remove();
        group.category.rowSpan = records.length;
        records[0].row.prepend(group.category);
      }
      group.body.append(...records.map(record => record.row));
    });
  }

  function updateButtons() {
    buttons.forEach(button => {
      const key = button.dataset.calorieSort;
      const active = key === activeKey;
      const next = active && direction === 'descending' ? '升序' : '降序';
      const current = direction === 'ascending' ? '升序' : '降序';
      const action = `按每百克${metrics[key].label}含量${next}排序`;
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? `当前${current}，${action}` : action);
      button.title = active ? `当前${current}，点击切换为${next}` : action;
      button.querySelector('.sort-indicator').textContent = active
        ? (direction === 'ascending' ? '↑' : '↓')
        : '↕';
    });
  }

  buttons.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      const key = button.dataset.calorieSort;
      direction = activeKey === key && direction === 'descending' ? 'ascending' : 'descending';
      activeKey = key;
      sortGroups(key);
      updateButtons();
      if (status) {
        const order = direction === 'ascending' ? '从低到高' : '从高到低';
        status.textContent = `已按每百克${metrics[key].label}含量，在各分类内${order}排序。`;
      }
    });
  });
  updateButtons();
})();
