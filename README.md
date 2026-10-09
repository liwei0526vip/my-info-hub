# 知行簿

打开任一 HTML 页面即可浏览；顶部提供统一站点导航，无需构建或服务器。首页 `index.html` 链接至 AI 导航页。

- `ai-model-timeline.html`：模型演进时间图（入口收于 AI 页）
- `ai-agent-timeline.html`：Agent 演进时间图（入口收于 AI 页）
- `ai.html`：AI（模型演进、Agent 演进、用户规模、估值市值导航与学习路线）
- `ai-user-scale.html`：用户规模（2025 年起的同图趋势，附统计口径与来源；入口收于 AI 页）
- `ai-company-value.html`：估值市值（厂商融资估值与上市市值快照，附日期与来源；入口收于 AI 页）
- `ai-model-comparison.html`：大模型对比
- `agent.html`：Agent 工程主题（Harness Engineering 笔记与关注 Agent：Codex、Claude Code、Pi Agent、DSH）
- `ai-knowledge-base.html`：AI 知识库实践与产品研究
- `ai-learning-index.html`：收藏（工具、工作流、课程与文章索引）
- `ops-agent.html`：运维智能体白皮书精读与产品思考
- `market-memo.html`：随笔（想法、线索与讨论，留待后续整理总结）
- `thoughts.html`：思考（待学习主题：第一性原理、向上管理）
- `life.html`：生活（日常做饭菜单与食物热量、主要成分记录）

## 新增页面

1. 在仓库根目录创建 HTML 页面。
2. 复制现有页面的 `site-header` 区块，在 `<head>` 引入 `assets/site-nav.css` 和 `assets/site-nav.js`（`defer`）。
3. 主页面在 `assets/site-nav.js` 的 `pages` 数组追加路径和名称；AI 专题子页面只添加到 `ai.html` 的专题导航，并在 `aiDetailPages` 中登记归属，不加入主导航。
4. 更新各页 `site-header` 内的静态链接可同步无 JavaScript 时的后备导航；正常浏览仅需维护上述数组。

导航样式集中在 `assets/site-nav.css`，窄屏自动换行，打印时隐藏。页面和 `assets` 目录应一起复制或发布；导航使用相对路径，支持本地文件和静态托管。

## 更新时间演进图

使用项目技能 [$update-agent-model-timeline](.agents/skills/update-agent-model-timeline/SKILL.md)，按当前日期核验官方发布记录，补充模型与 Agent 关键节点。技能包含官方来源索引与只读校验脚本；更新后校验日期、品牌引用、重复记录和页面脚本。
