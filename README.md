# AI Info Hub

打开任一 HTML 页面即可浏览；顶部提供统一站点导航，无需构建或服务器。

- `ai-agent-model-timeline.html`：模型与 Agent 演进时间图
- `ai-model-comparison.html`：大模型对比
- `ai-agent-comparison.html`：Agent 产品对比
- `ai-knowledge-base.html`：AI 知识库实践与产品研究
- `ai-learning-index.html`：AI 学习工具与文章索引

## 新增页面

1. 在仓库根目录创建 HTML 页面。
2. 复制现有页面的 `site-header` 区块，在 `<head>` 引入 `assets/site-nav.css` 和 `assets/site-nav.js`（`defer`）。
3. 在 `assets/site-nav.js` 的 `pages` 数组追加页面路径和名称，所有页面的导航会同步更新，按文件名自动标记当前页面。
4. 更新各页 `site-header` 内的静态链接可同步无 JavaScript 时的后备导航；正常浏览仅需维护上述数组。

导航样式集中在 `assets/site-nav.css`，窄屏自动换行，打印时隐藏。页面和 `assets` 目录应一起复制或发布；导航使用相对路径，支持本地文件和静态托管。
