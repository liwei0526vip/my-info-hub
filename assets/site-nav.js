/* Shared site identity and navigation. Relative paths work when opened from disk. */
(() => {
  const pages = [
    { href: 'ai.html', label: 'AI' },
    { href: 'market-memo.html', label: '随笔' },
    { href: 'thoughts.html', label: '思考' },
    { href: 'life.html', label: '生活' },
    { href: 'ai-learning-index.html', label: '收藏' },
  ];
  const currentFile = decodeURIComponent(location.pathname).split('/').pop() || 'index.html';
  const aiDetailPages = [
    'ai-model-comparison.html', 'agent.html', 'ai-knowledge-base.html', 'ops-agent.html',
    'ai-model-timeline.html', 'ai-agent-timeline.html', 'ai-user-scale.html', 'ai-company-value.html',
  ];
  const current = currentFile === 'index.html' || aiDetailPages.includes(currentFile) ? 'ai.html' : currentFile;

  const wordmark = document.querySelector('.site-wordmark');
  if (wordmark) {
    const home = document.createElement('a');
    home.className = 'site-brand';
    home.href = 'ai.html';
    home.setAttribute('aria-label', '知行簿 首页');

    const mark = document.createElement('img');
    mark.className = 'site-brand-mark';
    mark.src = 'assets/site-mark.svg';
    mark.alt = '';
    mark.width = 32;
    mark.height = 32;

    const name = document.createElement('span');
    name.className = 'site-brand-name';
    name.textContent = '知行簿';
    home.append(mark, name);
    wordmark.replaceChildren(home);
  }

  const host = document.querySelector('[data-site-nav]');
  if (host) {
    const fragment = document.createDocumentFragment();
    pages.forEach(({ href, label }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if (href === current) link.setAttribute('aria-current', 'page');
      fragment.append(link);
    });
    host.replaceChildren(fragment);
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.classList.add('site-footer');
    footer.querySelectorAll('a[href="#top"]').forEach(link => link.classList.add('footer-top-link'));
  }

  let backTop = document.querySelector('.site-back-top');
  if (!backTop) {
    backTop = document.createElement('a');
    backTop.className = 'site-back-top';
    backTop.href = '#top';
    document.body.append(backTop);
  }
  backTop.textContent = '↑';
  backTop.setAttribute('aria-label', '返回页面顶部');
  backTop.setAttribute('title', '返回顶部');
  backTop.classList.add('is-managed');

  const syncBackTop = () => backTop.classList.toggle('is-visible', window.scrollY > 420);
  syncBackTop();
  window.addEventListener('scroll', syncBackTop, { passive: true });
})();
