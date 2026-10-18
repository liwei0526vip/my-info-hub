/* Keep the chapter index in sync with the chapter being read. */
(() => {
  const links = [...document.querySelectorAll('.boot-contents a')];
  const chapters = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  if (!chapters.length) return;

  let queued = false;
  const update = () => {
    const current = chapters.reduce((active, chapter) => chapter.getBoundingClientRect().top <= 150 ? chapter : active, chapters[0]);
    links.forEach(link => {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('hashchange', schedule);
  update();
})();
