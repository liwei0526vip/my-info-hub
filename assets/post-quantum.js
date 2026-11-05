/* Keep the reading position visible while all links still work without JS. */
(() => {
  const links = [...document.querySelectorAll('.pq-toc a[href^="#"]')];
  const targets = links.map(link => document.getElementById(link.hash.slice(1)));
  if (!links.length || targets.some(target => !target)) return;
  const navigation = links[0].closest('.pq-toc');

  const revealHashTarget = () => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(id)); }
    catch { return; }
    if (!target) return;
    for (let parent = target.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'DETAILS') parent.open = true;
    }
    window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };

  let scheduled = false;
  const update = () => {
    scheduled = false;
    let active = 0;
    const guideLine = 150;
    targets.forEach((target, index) => {
      if (target.getBoundingClientRect().top <= guideLine) active = index;
    });
    // Two reference sections share a row on wide screens; honor the selected one.
    const selected = links.findIndex(link => link.hash === window.location.hash);
    if (selected >= 0 && selected !== active &&
        Math.abs(targets[selected].getBoundingClientRect().top - targets[active].getBoundingClientRect().top) < 2) {
      active = selected;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      // Near the end, a requested chapter may not be able to reach the top.
      const requested = links.findIndex(link => link.hash === window.location.hash);
      const requestedTop = requested >= 0 ? targets[requested].getBoundingClientRect().top : -1;
      active = requestedTop >= 0 && requestedTop < window.innerHeight ? requested : targets.length - 1;
    }
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (navigation.scrollWidth > navigation.clientWidth) {
      const current = links[active].getBoundingClientRect();
      const bounds = navigation.getBoundingClientRect();
      if (current.left < bounds.left + 8) {
        navigation.scrollLeft += current.left - bounds.left - 8;
      } else if (current.right > bounds.right - 8) {
        navigation.scrollLeft += current.right - bounds.right + 8;
      }
    }
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  window.addEventListener('hashchange', revealHashTarget);
  document.querySelectorAll('.pq-fold').forEach(fold => fold.addEventListener('toggle', schedule));
  revealHashTarget();
  update();
})();
