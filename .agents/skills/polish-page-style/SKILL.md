---
name: polish-page-style
description: "优化和美化本项目 HTML 页面的排版与样式：按站点设计令牌（assets/design-tokens.css）统一颜色语义、字号与间距节奏，并按信息形态套用 callout、状态徽标、键值块、时间线四个通用组件。用于用户说 美化/优化排版/样式/这页好看点 时；不改页面内容与信息、不动站点导航与 JS 行为、不落地暗色模式、不批量翻新存量页面（点名哪页改哪页）。"
---

# 页面排版美化

把单页的排版收敛到站点令牌和通用组件上，视觉与全站一致，改动只落在样式层。用户本次的明确要求优先于以下默认约定。

## 资产入口

- 基础识别色与字体：[assets/site-nav.css](../../../assets/site-nav.css) 的 `:root`（`--ink/--muted/--blue/--amber/--bg/--paper/--line/--pale/--green/--warm/--brown` 与 `--body/--display/--mono`），是全站唯一来源，不在别处重复定义。
- 语义层与组件：[assets/design-tokens.css](../../../assets/design-tokens.css)（`--faint/--line-soft/--err/--ok-bg` 等语义色、圆角 `--radius-*`、间距 `--sp-*`、字号 `--fs-*` 阶梯，及 `site-callout/site-badge/site-kv/site-timeline` 四组件）。
- 页面引用顺序：`site-nav.css` → `design-tokens.css` → 页面自有 CSS。改造某页时若它尚未引入 `design-tokens.css`，在 `site-nav.css` 之后补一行 link。
- 页面特有强调色（如 `--geer-orange`、`--life-protein`）保留在页面 CSS 中，不提升为站点令牌，也不在本 skill 里改动其取值。

## 排版规范

- 文字三级：主信息 `--ink`；说明、次级信息 `--muted`；弱化、空态、表格“—”用 `--faint`。不再新造灰色。
- 分隔线两级：区块边框 `--line`；表内行线、列表分隔、卡片内部用 `--line-soft`。
- 语义场景：结论与链接 `--blue`；成功、已支持 `--green`（浅底 `--ok-bg`）；提醒 `--brown`（浅底 `--warm`）；错误、不支持 `--err`（浅底 `--err-soft`）。文字用琥珀时用 `--amber-deep`，不用 `--amber`。
- 字号走阶梯：说明 11–12、正文 13–14、引导 16、区块标题 18、页题 28；不小于 10。
- 间距走 `--sp-1…--sp-6`（4px 节奏）；圆角：标签 `--radius-xs`、按钮小件 `--radius-s`、面板 `--radius-m`、大件 `--radius-l`。
- 同页改造中遇到的硬编码色 / 魔法数，值与令牌一致的改为引用变量；不一致的保留原值不动（可能是页面特有 accent），不趁机改视觉。

## 组件按信息形态选用

- 结论、注意事项、警告 → `site-callout`（默认蓝 / `--ok` 绿 / `--warn` 棕 / `--err` 红四态）。不加 callout 时不要把加粗当提示用。
- 对比表里的支持 / 不支持 / 部分支持 → `site-badge--ok/--no/--warn`（自带 ✓ ✗ ! 前缀）。仅用于“结论列”，数据数值表沿用既有“重点仅文字色”约定，不加徽章。
- 页头、卡片的成对元数据 → `site-kv`（`dl > div > dt+dd`，默认双列，长值用 `.site-kv--wide` 通栏）。
- 历程、阶段、步骤 → `site-timeline` 竖排（`li` 内 `site-tl-when/-title/-text`，关键节点加 `site-tl-hi`）。
- 需要流程图、时序图等图表时不用本 skill：可用本机 `answer-me-with-html` 的 `am render` 生成单文件页后提取 SVG 嵌入，先征得用户同意。

## 操作流程

1. 读目标页与其 CSS，对照规范列出差距（文字层级、行线、硬编码色、字号跳跃、可用组件的信息块）。
2. 改造优先级：替换为令牌引用 > 调整字号间距 > 给既有 HTML 套组件类。优先改 CSS，少动 HTML 结构；套组件类允许调整最小范围的标签结构。
3. 不改页面文字内容与信息本身、不动 `site-nav.*`、不动 JS 行为、不加暗色落地。
4. 浏览器截图自检：桌面宽度和 ≤520px 窄屏各一张，确认无视觉回归、组件显示正常。
5. 汇报改动点与截图结论，不自行提交。

## 完成检查

- 新写样式只引用令牌变量，无新的硬编码色与魔法数（页面特有 accent 除外）。
- 新类名带页面前缀（如 `geer-`、`life-`），通用样式只用四个 `site-*` 组件，不在页面 CSS 里重复定义它们。
- `git diff --check` 无空白问题；被改页面 link 顺序正确；未引入新依赖或 JS。
