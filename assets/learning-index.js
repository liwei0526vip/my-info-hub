(() => {
  const search = document.querySelector('#resource-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.resource-card')];
  const groups = [...document.querySelectorAll('.resource-group')];
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  const clear = document.querySelector('#clear-search');
  let activeCategory = 'all';

  const normalize = value => value.trim().toLocaleLowerCase('zh-CN');

  function update() {
    const query = normalize(search.value);
    let visibleCount = 0;

    cards.forEach(card => {
      const inCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      const matchesQuery = !query || normalize(card.dataset.search + ' ' + card.textContent).includes(query);
      const visible = inCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    groups.forEach(group => {
      const visibleCards = [...group.querySelectorAll('.resource-card:not([hidden])')];
      group.hidden = visibleCards.length === 0;
      group.querySelector('.group-heading > span').textContent = String(visibleCards.length);
    });

    count.textContent = `${visibleCount} 项`;
    empty.hidden = visibleCount !== 0;
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
})();
