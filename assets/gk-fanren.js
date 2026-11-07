/* 凡人修仙传页交互：元婴名帖按阵营筛选。 */
(() => {
  const wall = document.querySelector('.fr-wall');
  const filterBar = document.querySelector('.fr-filter');
  if (!wall || !filterBar) return;
  const npcs = Array.from(wall.querySelectorAll('.fr-npc'));

  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    filterBar.querySelectorAll('button').forEach((b) => b.classList.toggle('is-on', b === btn));
    const key = btn.dataset.filter;
    npcs.forEach((npc) => npc.classList.toggle('is-hidden', key !== 'all' && npc.dataset.group !== key));
  });
})();
