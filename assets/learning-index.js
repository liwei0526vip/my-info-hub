(() => {
  const search = document.querySelector('#resource-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.collection-directory a')];
  const groups = [...document.querySelectorAll('.resource-group')];
  const directories = [...document.querySelectorAll('.collection-directory')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const clear = document.querySelector('#clear-search');
  let activeCategory = 'all';

  const normalize = value => value.trim().toLocaleLowerCase('zh-CN');
  const columnCount = () => {
    const width = window.innerWidth;
    if (width >= 1020) return 6;
    return width >= 680 ? 3 : 2;
  };

  function relayout() {
    const cols = columnCount();
    directories.forEach(directory => {
      directory.querySelectorAll('.cell-pad').forEach(pad => pad.remove());
      const group = directory.closest('.resource-group');
      if (group && group.hidden) return;
      const visible = [...directory.querySelectorAll('a')].filter(link => !link.hidden);
      const pads = (cols - (visible.length % cols)) % cols;
      for (let index = 0; index < pads; index += 1) {
        const pad = document.createElement('span');
        pad.className = 'cell-pad';
        pad.setAttribute('aria-hidden', 'true');
        directory.appendChild(pad);
      }
      [...directory.children].forEach((child, index) => {
        child.classList.toggle('cell-col-first', index % cols === 0);
        child.classList.toggle('cell-row-first', index < cols);
      });
    });
  }

  function update() {
    const query = normalize(search.value);
    let visibleCount = 0;

    cards.forEach(card => {
      const inCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize((card.dataset.search ?? '') + ' ' + card.textContent).includes(query);
      const visible = inCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    groups.forEach(group => {
      const visibleCards = [...group.querySelectorAll('.collection-directory a:not([hidden])')];
      group.hidden = visibleCards.length === 0;
      group.querySelector('.group-heading > span').textContent = String(visibleCards.length);
    });

    count.textContent = `${visibleCount} 项`;
    empty.hidden = visibleCount !== 0;
    relayout();
  }

  filters.forEach(button => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.filter;
      filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    });
  });

  search.addEventListener('input', update);
  search.addEventListener('keydown', event => {
    if (event.key === 'Escape' && search.value) {
      search.value = '';
      update();
    }
  });

  clear.addEventListener('click', () => {
    activeCategory = 'all';
    search.value = '';
    filters.forEach(item => item.setAttribute('aria-pressed', String(item.dataset.filter === 'all')));
    update();
    search.focus();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(relayout, 120);
  });

  update();
})();
