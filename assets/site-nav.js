/* Add future pages here. Relative paths also work when opened from disk. */
(() => {
  const pages = [
    { href: 'ai-agent-model-timeline.html', label: '演进时间图' },
    { href: 'ai-model-comparison.html', label: '大模型对比' },
    { href: 'ai-agent-comparison.html', label: 'Agent对比' },
    { href: 'ai-knowledge-base.html', label: 'AI 知识库' },
  ];
  const host = document.querySelector('[data-site-nav]');
  if (!host) return;
  const current = decodeURIComponent(location.pathname).split('/').pop();
  const fragment = document.createDocumentFragment();
  pages.forEach(({ href, label }) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (href === current) link.setAttribute('aria-current', 'page');
    fragment.append(link);
  });
  host.replaceChildren(fragment);
})();
