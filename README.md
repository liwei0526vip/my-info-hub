# 知行簿

打开任一 HTML 页面即可浏览；顶部提供 AI、随笔、思考、拾零、生活、收藏、学习七个主导航入口，无需构建或服务器。首页 `index.html` 链接至 AI 导航页，AI 专题入口统一收于该页。

- `ai-model-timeline.html`：模型演进时间图（入口收于 AI 页）
- `ai-agent-timeline.html`：Agent 演进时间图（入口收于 AI 页）
- `ai.html`：AI（模型对比、Agent学习、AI知识库、运维智能体、模型演进、Agent 演进、用户规模、估值市值导航与学习路线）
- `ai-user-scale.html`：用户规模（2025 年起的同图趋势，附统计口径与来源；入口收于 AI 页）
- `ai-company-value.html`：估值市值（厂商融资估值与上市市值快照，附日期与来源；入口收于 AI 页）
- `ai-model-comparison.html`：模型对比（入口收于 AI 页）
- `agent.html`：Agent学习（Harness Engineering 笔记与关注 Agent：Codex、Claude Code、Pi Agent、DSH；入口收于 AI 页）
- `ai-knowledge-base.html`：AI知识库（实践与产品研究；入口收于 AI 页）
- `ai-learning-index.html`：收藏（工具、工作流、课程与文章索引）
- `ops-agent.html`：运维智能体（按所提供资料逐页摘录核心信息；入口收于 AI 页）
- `ops-agent-backup-2026-10-09.html`：运维智能体原页面完整备份（含原版样式；入口在运维智能体页）
- `market-memo.html`：随笔（想法、线索与讨论，留待后续整理总结）
- `thoughts.html`：思考（认同的话摘录与待学习主题：第一性原理、向上管理）
- `general-knowledge.html`：拾零（非技术、非生活的零碎知识记录，分类待定）
- `security-vendors.html`：网安厂商速览（网关蓝图及国内扩展厂商的核心产品或业务速查，统一列表与业务标签、双栏紧凑布局，支持搜索并附官方链接；入口收于拾零页）
- `gk-countries.html`：全球国家概览（195 国国旗、首都、所在洲、面积与人口速查，支持搜索、洲筛选与排序，附面积、人口前十图表与军力、GDP 前十榜单；入口收于拾零页）
- `china-regions.html`：中国省份城市（34 个省级行政区与 333 个地级行政区的人口、面积、GDP 速查，可搜索、筛选、排序；入口收于拾零页）
- `henan.html`：河南省城市（17 个省辖市及济源的下辖区县、人口、面积与 GDP，支持排序和逐市展开区县，附城市人口、面积与 GDP TOP5 图表；入口收于拾零页）
- `shaanxi.html`：陕西省城市（10 个城市的区县、2025 年末人口、面积与 2025 年 GDP，支持排序和逐市展开区县，附三项 TOP5 图表；汉中 GDP 准确总量暂缺，以“—”显示；入口收于拾零页，与河南页共用展示样式和交互）
- `xian.html`：西安城市概览（认识西安、城市发展、游览西安三大板块；包括全市指标、历史文化、13 个区县对比及 TOP5、产业高校、功能区、年度变化曲线、地铁、景点、美食合并速览（12 条已运营地铁与起讫站、四类景点名称与精简看点，含回民街、洒金桥，及特色美食名称）；区县表支持排序；单位、年份和统计口径随表注明）
- `life.html`：生活（日常做饭菜单与食物热量、主要成分记录）
- `learning.html`：学习（按主题组织图解与说明，含 Linux 系统启动及章节索引）
- `linux-boot.html`：Linux 系统启动图解（UEFI 到登录的六阶段流程、initramfs 根文件系统交接、systemd 依赖与并行，以及实机观察命令与自测；入口收于学习页）
- `pqc.html`：抗量子（量子威胁、后量子密码标准、混合迁移与密码敏捷性通用笔记，暂不加入导航）

## 新增页面

1. 在仓库根目录创建 HTML 页面。
2. 复制现有页面的 `site-header` 区块，在 `<head>` 引入 `assets/site-nav.css` 和 `assets/site-nav.js`（`defer`）。
3. 主页面在 `assets/site-nav.js` 的 `pages` 数组追加路径和名称；AI 专题子页面只添加到 `ai.html` 的专题导航，并在 `aiDetailPages` 中登记归属；拾零专题子页面添加到 `general-knowledge.html` 的专题导航，并在 `gkDetailPages` 中登记归属。学习专题子页面添加到 `learning.html` 的学习索引，并在 `learningDetailPages` 中登记归属。专题子页面不加入主导航。
4. 更新各页 `site-header` 内的静态链接可同步无 JavaScript 时的后备导航；正常浏览仅需维护上述数组。

导航样式集中在 `assets/site-nav.css`，窄屏自动换行，打印时隐藏。页面和 `assets` 目录应一起复制或发布；导航使用相对路径，支持本地文件和静态托管。

## 更新时间演进图

使用项目技能 [$update-agent-model-timeline](.agents/skills/update-agent-model-timeline/SKILL.md)，按当前日期核验官方发布记录，补充模型与 Agent 关键节点。技能包含官方来源索引与只读校验脚本；更新后校验日期、品牌引用、重复记录和页面脚本。
