/* Filter the static list by vendor, product, alias or business tag. */
(() => {
  const tools = document.querySelector('[data-vendor-search]');
  if (!tools) return;
  const input = tools.querySelector('input');
  const count = tools.querySelector('output');
  const panel = document.querySelector('.vendors-panel');
  const entries = [...document.querySelectorAll('.vendor-entry')];
  const index = new Map(entries.map(entry => [entry,
    `${entry.textContent} ${entry.dataset.aliases || ''} ${entry.dataset.tags || ''}`.toLocaleLowerCase(),
  ]));
  const empty = document.querySelector('[data-vendor-empty]');
  tools.hidden = false;

  const filter = () => {
    const terms = input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    entries.forEach(entry => {
      entry.hidden = !terms.every(term => index.get(entry).includes(term));
      if (!entry.hidden) visible++;
    });
    panel.hidden = visible === 0;
    panel.classList.toggle('is-single-column', visible === 1);
    count.textContent = `${visible} / ${entries.length} 条`;
    empty.hidden = visible !== 0;
  };
  input.addEventListener('input', filter);
  filter();
})();
