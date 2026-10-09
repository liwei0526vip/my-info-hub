# 用户规模数据源

## 查找顺序

1. 厂商原始公告、业绩报告、监管披露。保留现有官方披露，记录统计时点及披露日期。
2. 专业统计机构原始报告或授权导出：全球 App 优先 Sensor Tower / Similarweb，国内 App 使用 QuestMobile。先核实范围与历史覆盖，不能跨机构、跨地域拼接。
3. AICPB 原榜、认证账号或联合发布方，以及保留原表和月份的研报，仅作补充估算。注明引用链与 PDF 页码；引用同一榜单不算独立交叉验证。
4. 媒体汇总只作线索。未追溯原表的数字不入图，留存 [待核记录](source-review.json)。

`third-party` 是统计主体的属性，不是网页是否由机构自己发布。官方产品公告应填 `official`；AICPB 原文仍填 `third-party`。

## 专业来源与接入条件

| 来源 | 原始入口 | 接入条件 |
| --- | --- | --- |
| Sensor Tower | [App Performance Insights](https://sensortower.com/product/mobile-app/app-performance-insights)、[State of AI 2026](https://sensortower.com/blog/state-of-ai-2026) | 面板和模型估算，App Store / Google Play；完整数据需相应付费权限。核实国内安卓商店覆盖，不把 App + Web 的 True Audience 混入 App MAU。data.ai 已并入 Sensor Tower，不算独立复核机构。 |
| Similarweb | [App Active Users API](https://docs.similarweb.com/api-v5/api-reference/app-analysis-api/app-active-users)、[MAU 定义](https://support.similarweb.com/hc/en-us/articles/6450621690769-Monthly-Active-Users) | 需要 API key 和数据额度；固定 `app_id`、`country`、`store`、`granularity` 与版本。按设备估算，不等于独立自然人数。2026-09-01 改模型并回填37个月，旧版 `apps_legacy_v1` 与新版不能拼接。 |
| QuestMobile | [TRUTH](https://www.questmobile.com.cn/products/truth/)、[研究报告](https://www.questmobile.com.cn/research/reports/) | 国内移动端统计，用原报告核实日期、产品、指标与单位；不能直接替换全球 App 系列。报告图题和正文月份冲突时先核原图，无法确认则不用。 |

截至2026-10-09，尚未取得覆盖当前品牌、2025年起、同口径的完整专业历史序列。当前图表保留9个官方披露点与41个 AICPB 补充估算点；5个仅媒体引用的点已撤下并留存待核，不能用更多采样点代替更好的来源。

已核对的替代候选见 [source-review.json](source-review.json)：

- [Similarweb 原文](https://aisearch.similarweb.com/blog/claude-vs-chatgpt/)的 App 段落：全球 iOS + Android Claude MAU，2025.06 为730万、2026.05 为1.039亿；原文披露于2026-09-08。尚缺完整月序列和估算版本，不能替换或接入 AICPB 曲线。
- [QuestMobile 2026一季度报告](https://www.questmobile.com.cn/research/report/2046482337382842370/)正文：2026.03 国内 DeepSeek App MAU 为1.27亿，披露于2026-04-21。不同地域范围，仅作候选。

有授权导出数据时，先保留原文件及查询参数，核实整个历史版本；保持官方 WAU 与累计用户，另行评估 App 估算系列。现有 `merge` 会拒绝直接混入新的统计机构或 `scope`，整体来源迁移需单独核验后修改，不能靠 `--replace-existing` 绕过。

## 当前各品牌

| 品牌 | 主要统计口径 | 优先入口与注意事项 |
| --- | --- | --- |
| Codex | 官方周活 WAU | [OpenAI 新闻](https://openai.com/news/)、下方已核实公告；不要收录 ChatGPT 总人数，2025 年暂无已核实的同口径绝对人数。 |
| Claude | AICPB App MAU | [Anthropic 新闻](https://www.anthropic.com/news)补查官方数字；缺失时用[AICPB Claude](https://www.aicpb.com/zh/product/Claude-by-Anthropic/appid1D6F33BC9)及历史应用榜。Claude Code 倍增、收入和网页访问量不能替代 App 月活。 |
| GLM | AICPB 智谱清言 App MAU | [AICPB 智谱清言](https://www.aicpb.com/zh/product/智谱清言-一站式解放AI生产力/appid1D6F37CE9)及历史应用榜；z.ai 网站、ZCode、API 客户是其它产品/范围。 |
| Kimi | AICPB Kimi App MAU | [AICPB Kimi](https://www.aicpb.com/zh/product/Kimi/appid1D6F332E1)及历史应用榜；不混入官网访问量、付费用户增速、QuestMobile 国内移动端统计。 |
| DeepSeek | AICPB DeepSeek App MAU | [AICPB 应用榜](https://www.aicpb.com/zh/ai-rankings/products/china-ai-rankings/apps)及历史发布；2025 年不同机构数字差异较大，不拼接。 |
| MiniMax | 官方旗下产品累计用户 | [MiniMax 新闻](https://www.minimax.io/news)、[港交所披露](https://www.hkexnews.hk/)。累计范围包含海螺、Talkie / 星野等，不是 MiniMax Agent 活跃人数，不与 App MAU 接线。 |

## AICPB 历史档案

[AI产品榜认证搜狐号](https://mp.sohu.com/profile?xpt=M2UyMTJlNmYtMDhkMy00MTY0LTk5MTctOGNjOTE5OTViNGQ3)在简介中标明“AI产品榜官方搜狐号”。历史榜单有数字表格和原图，比只展示最新月份的产品页更适合补查。

| 统计月份 | 发布页 / 原表引用 | 来源页面日期 |
| --- | --- | --- |
| 2025.03 | [沃垠AI联合发布](https://www.sohu.com/a/879787950_122082871) | 2025-04-04 |
| 2025.12 | [第17期应用榜](https://www.sohu.com/a/972297205_122031644) | 2026-01-04 |
| 2026.01 | [第18期应用榜](https://www.sohu.com/a/983095647_122031644) | 2026-02-03 |
| 2026.02 | [第19期应用榜转载（待核原始发布，未入图）](https://m.sohu.com/a/993719558_121948415) | 2026-03-07 |
| 2026.03 | [第20期应用榜](https://www.sohu.com/a/1005139027_122031644) | 2026-04-03 |
| 2026.04 | [第21期应用榜](https://www.sohu.com/a/1018891415_122031644) | 2026-05-06 |
| 2026.05 | [第22期应用榜](https://www.sohu.com/a/1031478355_122031644) | 2026-06-03 |
| 2026.06 | [第23期应用榜](https://www.sohu.com/a/1045101655_122031644) | 2026-07-03 |
| 2026.07 | [第24期应用榜](https://www.sohu.com/a/1058083664_122031644) | 2026-08-03 |
| 2026.08 | [第25期应用榜](https://www.sohu.com/a/1071354827_122031644) | 2026-09-03 |

- 查找缺月：`"AI产品榜" "应用榜" "YYYY年M月" "品牌"`，优先原账号与联合发布方；没有正文数字就查原图或带原表的研报。
- 2026.02 当前链接为转载，四个点已移至待核记录。找到原始发布页并核对表头、数字、脚注和日期后才恢复；多个转载重复同一张表，不构成独立验证。
- 含 `Web` 的网站榜是访问量，不能用作 App 月活；同一发布页还含下载、订阅收入等表格，必须核对表头。
- 原表脚注说明 App 范围包含全球 iOS、海外 Google Play 和国内安卓市场；“国内总榜”是产品榜单分类，不能据此把数字写成“中国境内用户”。按当期实际脚注核实，范围有变须分开处理。
- 产品页的“最新”可能仍指旧月份；网页核对日期不能当作统计月份。榜单未出现某产品，只说明本表未列出，不代表 0。
- 所有第三方数字保留其估算性质；小数精度来自原表，不代表独立人数已准确去重。不要从月环比推算缺月。

## 可复查的官方与研报锚点

- Codex：[2026-03-19 超200万周活](https://openai.com/index/openai-to-acquire-astral/)、[04-08 300万](https://openai.com/index/next-phase-of-enterprise-ai/)、[04-21 超400万](https://openai.com/index/scaling-codex-to-enterprises-worldwide/)、[05-14 再次披露超400万](https://openai.com/index/work-with-codex-from-anywhere/)、[06-02 超500万](https://openai.com/index/codex-for-knowledge-work/)、[07-09 超500万](https://openai.com/index/chatgpt-for-your-most-ambitious-work/)。重复下限不是精确不变的用户数。
- MiniMax：[招股书](https://www1.hkexnews.hk/listedco/listconews/sehk/2025/1231/2025123100025.pdf#page=250)2025-09-30 累计超2.12亿；[2025年度业绩](https://www.hkexnews.hk/listedco/listconews/sehk/2026/0302/2026030202837.pdf#page=2)年末超2.36亿；[2026-08-26中期业绩发布稿](https://www.prnasia.com/story/545325-1.shtml)“迄今”累计超3亿。后一个日期不能倒填成半年报期末6月30日。
- 2025.01：[国元证券引用 AICPB](https://pdf.dfcfw.com/pdf/H3_AP202502181643194579_1.pdf?1739888737000.pdf=#page=7)第7页；Claude 1月的[Backlinko引用](https://backlinko.com/claude-users)未追溯原表，已移至待核记录；该文下载量摘要与正文有单位不一致。
- 2025.02：[民生证券引用原榜](https://pdf.dfcfw.com/pdf/H3_AP202503091644194683_1.pdf%3F1741481049000.pdf#page=3)第3页，DeepSeek 61.81M、Kimi 26.22M、智谱清言 7.92M，报告正文日期2025-03-08；文件名中的03-09是上传线索，不能代替报告日期。
- 2025.05：[国元证券引用](https://pdf.dfcfw.com/pdf/H3_AP202506091687670639_1.pdf?1749487224000.pdf=#page=8)第8页，DeepSeek 100.17M、Kimi 24.05M、智谱清言 8.38M，披露2025-06-09。第6页 Claude 的1778是订阅收入，不是月活。
- 2025.11：[爱建证券引用原榜](https://pdf.dfcfw.com/pdf/H3_AP202512121799042477_1.pdf?1765568313000.pdf=#page=12)第12页，DeepSeek 69.37M、Kimi 24.82M，披露2025-12-12；该报告下一页标题写月活，但原图表头为网站访问量，以原图表头为准。

不能核实的月份保持缺口。可以在本文件记下已查但不适用的来源及理由，以免下次重复搜索；不要把缺口解释为厂商一定没有披露。

## 时间图迁移评估（2026-10-09）

12条旧小注的原文与逐条判断留存于 [timeline-migration.json](timeline-migration.json)。8条已在趋势系列，按产品、日期、范围和数值去重；Codex 2026-02-02 的过去一个月使用人数超过100万，经 [OpenAI 原文](https://openai.com/index/introducing-the-codex-app/) What’s next 段落核实，收于 `disclosures`，不接入 WAU 曲线，也不标为2026年1月自然月 MAU。

千问3条继续遵循用户此前移除要求，保存评估但不恢复展示。两条阿里巴巴原文分别公布 App 月活超1亿、全平台月活超3亿，AICPB 另报2026.06 App 月活251.13M；统计范围和提供方不同，不能据此连接成增减趋势。以后只有用户明确要求重新关注，才重新评估展示方式。
