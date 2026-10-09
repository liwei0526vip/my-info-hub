---
name: update-ai-user-scale
description: "补充、核验本项目 ai-user-scale.html 的用户规模历史数据，优先官方披露与专业统计机构，追溯第三方原始榜单；不用于模型演进事件、估值或市值更新。"
---

# 更新 AI 用户规模

维护 `ai-user-scale.html` 中 `#ai-data` JSON 的 `users`、`disclosures` 及对应来源说明。沿用现有品牌、配色和图表；千问已移除，不自行恢复。保留其它未提交改动，不顺带更新时间图、公司估值或市值。

## 数据源与口径

- 先读 [数据源](references/sources.md)，运行下方 `audit`。官方披露优先保留；全球 App 数据优先核查 Sensor Tower、Similarweb，国内 App 核查 QuestMobile 原始报告。AICPB 原榜和保留原表的研报仅作补充估算，媒体汇总只作线索。
- 打开来源正文或榜单图片，核实产品、统计期、数值、单位、范围和披露日期。搜索摘要仅作线索；图片表格要看清对应行、表头与脚注。找不到原表时说明缺口，不从曲线位置读出精确数值。
- `official` 指产品厂商披露；AICPB 自己发布也属于 `third-party`。转载平台不是统计机构，`provider` 写实际机构及必要的引用链。
- 当前 Claude、GLM、Kimi、DeepSeek 为 AICPB App 月活补充估算，Codex 为官方周活，MiniMax 为旗下产品累计用户。另一机构的数字不能接入现有曲线；更换来源须核实完整历史的产品、地域、终端、指标、去重方式和数据版本，并整体迁移对应系列。国内数据不替代全球数据。
- 相同来源、日期、数值与口径的记录去重。可靠但统计窗口不同的历史人数收于 `disclosures`，仅显示在来源表，不入趋势图、不改变品牌图例；例如 Codex 的“过去一个月使用人数”不能当周活或自然月 MAU。
- 阅读 [待核与替代候选](references/source-review.json) 避免恢复已撤下的弱引用。仅有媒体转述、未核原表的点留在待核记录，不入图；候选也不直接导入。取得专业平台权限或导出数据前，不声称已用其替换。
- 不把访问次数、下载量、注册量、付费人数、API 开发者、增长比例当作活跃用户；不把 ChatGPT 当 Codex、Claude App 当 Claude Code、MiniMax 全产品当 MiniMax Agent。
- 数据缺失留空；不补零、插值、沿用上月、从环比倒推或填入预测。保留披露的 `>` 下限和近似性质，同一数字在新日期再次披露可保留，但不代表实际用户数未增长。

## 写入

每个已核实点整理为 JSON 数组中的一项：

```json
[{"brand":"codex","date":"2026-04-21","value":4000000,"relation":"gt","tier":"official","metric":"周活用户（WAU）","scope":"codex-wau","timeLabel":"2026.04.21 披露","provider":"OpenAI","url":"https://openai.com/index/scaling-codex-to-enterprises-worldwide/","publishedOn":"2026-04-21","verifiedOn":"2026-10-09","sourceNote":"正文公布每周使用 Codex 的开发者超过 400 万。"}]
```

- `value` 存原始人数/账户/设备计数，整数；`M` 乘 1,000,000，`万`乘 10,000。图表显示单位为万，不能把换算后的万再存入 `value`。
- 月活点加 `period: "YYYY-MM"`，`date` 为该月最后一天，`timeLabel` 为 `YYYY.MM`；时点披露用对应统计日期，无统计日期才用披露日期。`publishedOn` 仅在可核实时填写，不能用它替换统计月份。
- 新增点填写 `verifiedOn` 和一句 `sourceNote`，说明正文或表格位置、单位；研报保留页码。未确认的来源时间不要猜测。`relation` 为 `eq / gt / approx`，`tier` 为 `official / third-party`。
- `scope` 沿用同一系列；新增机构、终端、地域、时间窗口、去重方式或数据版本须重新判断可比性。脚本只做结构检查，不能替代来源核验。

在仓库根目录运行（Python 3 标准库，无额外依赖）：

```bash
python3 .agents/skills/update-ai-user-scale/scripts/update_user_scale.py audit
python3 .agents/skills/update-ai-user-scale/scripts/update_user_scale.py merge /tmp/verified-users.json
python3 .agents/skills/update-ai-user-scale/scripts/update_user_scale.py merge /tmp/verified-users.json --write
```

独立披露使用 `merge /tmp/verified-users.json --disclosures` 预览，核实后加 `--write`。不要用该选项绕过趋势系列的口径检查；已属于曲线的范围不能重复放入独立披露。

默认预览；相同记录跳过，冲突拒绝。确需修正已核实的旧点才用 `--replace-existing`；更新核对日期可加 `--checked-on YYYY-MM-DD`。批次全部校验成功才写入，只替换用户数据及指定的核对日期。可用全局 `--page PATH` 检查临时副本。

## 检查与汇报

- 写入后运行 `audit`、`python3 -m unittest discover -s tests -p 'test_ai_user_scale.py'` 和 `git diff --check`。涉及图表交互再检查对应 JavaScript 与行为。
- 确认品牌和统计口径未变、同一品牌、日期与范围无重复、来源可追溯，估值市值页面和现有布局保留；汇报新增点、覆盖月份及仍存在的缺口。仅按用户要求提交、推送或发布。
