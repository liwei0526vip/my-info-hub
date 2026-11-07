(() => {
  const button = document.querySelector('[data-copy-address]');
  const address = button && document.getElementById(button.dataset.copyAddress);
  const status = document.querySelector('.geer-copy-status');
  if (!button || !address || !status) return;

  const copySelection = () => {
    const selection = window.getSelection();
    if (!selection) return false;
    const range = document.createRange();
    range.selectNodeContents(address);
    selection.removeAllRanges();
    selection.addRange(range);
    const copied = document.execCommand('copy');
    if (copied) selection.removeAllRanges();
    return copied;
  };

  button.hidden = false;
  button.addEventListener('click', async () => {
    status.textContent = '';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(address.textContent.trim());
      } else if (!copySelection()) {
        throw new Error('Copy unavailable');
      }
      status.textContent = '地址已复制';
    } catch {
      status.textContent = '复制未成功，请选中地址手动复制。';
    }
  });
})();
