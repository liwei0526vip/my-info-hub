/* Shared site identity and navigation. Relative paths work when opened from disk. */
(() => {
  const pages = [
    { href: 'ai-agent-model-timeline.html', label: '演进时间图' },
    { href: 'ai-model-comparison.html', label: '大模型对比' },
    { href: 'ai-agent-comparison.html', label: 'Agent对比' },
    { href: 'ai-knowledge-base.html', label: '知识库' },
    { href: 'ai-learning-index.html', label: '学习收藏' },
  ];
  const currentFile = decodeURIComponent(location.pathname).split('/').pop() || 'index.html';
  const current = currentFile === 'index.html' ? 'ai-agent-model-timeline.html' : currentFile;

  const wordmark = document.querySelector('.site-wordmark');
  if (wordmark) {
    const home = document.createElement('a');
    home.className = 'site-brand';
    home.href = 'ai-agent-model-timeline.html';
    home.setAttribute('aria-label', 'AI Info Hub 首页');

    const mark = document.createElement('img');
    mark.className = 'site-brand-mark';
    mark.src = 'assets/site-mark.svg';
    mark.alt = '';
    mark.width = 32;
    mark.height = 32;

    const name = document.createElement('span');
    name.className = 'site-brand-name';
    name.textContent = 'AI INFO HUB';
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
