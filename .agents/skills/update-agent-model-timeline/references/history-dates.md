# 历史日期核验笔记

核验日：2026-10-09。下表保存当前采用的事件口径与原始证据，供历史补漏或日期冲突时读取。不是完整型号清单，也不代替后续联网核验；若有更明确的原始证据，应同步修正日期、来源与标签。

| 节点 | 已采用口径 | 核验依据 |
| --- | --- | --- |
| GPT-3 | 2020-05-28 技术报告；2020-06-11 API 私测 | [原始报告](https://openai.com/index/language-models-are-few-shot-learners/)、[API 公告](https://openai.com/index/openai-api/)。这是两个不同阶段，不能合并成无状态的“正式上线”。 |
| 原始 Codex | 2021-08-10 API 私测 | [原文](https://openai.com/index/openai-codex/)；区别于 2025 年的同名 Agent 产品。 |
| GPT-3.5 | 2022-11-30 产品搭载；2023-03-01 Turbo API | [ChatGPT 原文](https://openai.com/index/chatgpt/)、[同期官方发布帖](https://community.openai.com/t/introducing-chatgpt-and-whisper-apis/80485/1)。API 博客当前显示的 2024-04-24 是更新日。 |
| DALL·E 2 / 3 | 2022-04-13 技术报告；2023-10-19 ChatGPT 可用 | [DALL·E 2 报告](https://openai.com/index/hierarchical-text-conditional-image-generation-with-clip-latents/)、[DALL·E 3 产品公告](https://openai.com/index/dall-e-3-is-now-available-in-chatgpt-plus-and-enterprise/)。不把这些日期称为最初预告日。 |
| Claude 3.5 Sonnet | 2024-06-20 API 可用 | [AWS 同期公告](https://aws.amazon.com/about-aws/whats-new/2024/06/anthropic-claude-3-5-sonnet-model-bedrock/)明确 Bedrock 当日正式可用；[Anthropic 当前公告页](https://www.anthropic.com/news/claude-3-5-sonnet)标为 6 月 21 日。当前节点采用平台可用口径，不能只照后一日期覆盖。 |
| Claude 3.5 Haiku | 2024-11-04 API 可用 | [AWS 可用公告](https://aws.amazon.com/about-aws/whats-new/2024/11/anthropics-claude-3-5-haiku-model-amazon-bedrock/)；10 月 22 日是提前预告，型号中的 20241022 也不是该平台可用日。 |
| Qwen-VL / Qwen-Audio | 2023-08-22 VL 权重；2023-11-30 Audio 权重 | 以 [VL 仓库 News](https://github.com/QwenLM/Qwen-VL#news-and-updates)和 [Audio 仓库 News](https://github.com/QwenLM/Qwen-Audio#news-and-updates)为据；Audio 报告于 11 月 15 日公开，两种事件不能互换。 |
| Qwen2.5-VL / Omni | 2025-01-26 / 2025-03-27 博客公告口径 | [VL 原文](https://qwenlm.github.io/blog/qwen2.5-vl/)、[Omni 原文](https://qwenlm.github.io/blog/qwen2.5-omni/)。若改用仓库权重开放日期，需核实原文并明确事件口径，不能从快照名推断。 |
| GLM-10B / GLM-130B / ChatGLM3 | 2021-06 / 2022-08 / 2023-10，月份精度 | [团队报告 v2，图 1](https://arxiv.org/pdf/2406.12793v2#page=2)。设置 `datePrecision: "month"`；GLM-130B 后续论文日期不替代权重开放月份。 |
| GLM-4 | 2024-01-16 模型发布 | [官方活动回顾](https://www.zhipuai.cn/zh/news/8)正文明确活动日期，网页归档日为 2024-04-21。 |
| Moonshot-v1 / Kimi Latest | 2024-01-31 API 公测；2025-02-17 滚动别名 | [官方回顾](https://platform.kimi.com/blog/posts/kimi-latest)发表于 2025-02-17，但正文回顾 v1 公测日期。Latest 是滚动更新的视觉模型 API 别名，不能当成固定权重版本。 |
| DeepSeek-Coder / LLM | 2023-11-02 / 2023-11-29 早期仓库记录 | [Coder 初始提交](https://github.com/deepseek-ai/DeepSeek-Coder/commit/a4ba628dfdc2e56f1fd6cdd86df103ce4d3df73e)、[LLM 早期提交](https://github.com/deepseek-ai/DeepSeek-LLM/commit/f8b3d77beb4449d77932eccc6abe08826ad3c608)对应文档已有模型与下载说明。提交时间不能单独证明所有平台的上线日；后续报告日期也不能替代该早期记录。 |
| MiniMax 早期模型 | abab 1：2022-04 内部使用；abab 5.5：2023-05；Speech-01：2023-11；abab 6：2024-01；Hailuo-01 / Music-01：2024-08 | [正式招股书 PDF 第 211 页](https://www1.hkexnews.hk/listedco/listconews/sehk/2025/1231/2025123100025.pdf#page=211)（印刷页 201）说明内部使用；[第 212 页](https://www1.hkexnews.hk/listedco/listconews/sehk/2025/1231/2025123100025.pdf#page=212)（印刷页 202）为月份表，已核对原始版面。均保留月份精度；2024 年 9 月伙伴日不是首次发布月份。 |

核验具体节点时，优先复用上述原始资料和现有事件来源；只有资料缺失、口径不符或出现新的证据时，再扩展搜索。
