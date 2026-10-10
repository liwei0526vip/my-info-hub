# 模型与 Agent 来源索引

索引更新：2026-10-10。按需使用以下入口；已收录事件的具体出处以页面卡片为准。

按当前 `timeline-products` 覆盖全部品牌。下面是查新入口；写入事件时优先使用具体公告或带日期锚点的链接。入口迁移时用官方新地址更新，不把抓取失败解释为事件不存在。

## 日常查新

| 品牌 | 模型公告与平台记录 | Agent 产品与工具 |
| --- | --- | --- |
| Claude | [Anthropic 公告](https://www.anthropic.com/news)、[平台发布记录](https://platform.claude.com/docs/en/release-notes/overview) | [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)、[Claude Apps / Cowork](https://support.claude.com/en/articles/12138966-release-notes) |
| Codex / OpenAI | [OpenAI 模型公告](https://openai.com/news/)、[API Changelog](https://developers.openai.com/api/docs/changelog) | [Codex Changelog](https://developers.openai.com/codex/changelog/)、[ChatGPT / Codex 产品记录](https://learn.chatgpt.com/docs/changelog)、[Codex releases](https://github.com/openai/codex/releases) |
| Qwen | [Qwen 博客](https://qwen.ai/blog)、[历史博客](https://qwenlm.github.io/blog/)、[Model Studio 新模型](https://www.alibabacloud.com/help/en/model-studio/newly-released-models) | [Qwen Code](https://github.com/QwenLM/qwen-code/releases)、[Qwen-Agent](https://github.com/QwenLM/Qwen-Agent) |
| GLM | [Z.AI 发布记录](https://docs.z.ai/release-notes/new-released)、[Z.AI 博客](https://z.ai/blog)、[官方模型仓库](https://github.com/zai-org) | [AutoGLM](https://github.com/zai-org/Open-AutoGLM)、[AutoClaw Changelog](https://autoclaw.z.ai/changelog/) |
| Kimi | [Kimi 博客](https://www.kimi.com/en/blog/)、[官方 API 博客](https://platform.kimi.com/blog) | [Kimi Work](https://www.kimi.com/en/help/kimi-work/release-notes)、[Kimi Code](https://www.kimi.com/code/docs/en/changelog.html) |
| DeepSeek | [API Changelog](https://api-docs.deepseek.com/updates/)、[官方模型仓库](https://github.com/deepseek-ai) | 同一 Changelog 中的兼容接口与工具调用；标签说明“接口 / 生态”，不要描述成独立 Agent 产品 |
| MiniMax | [中文公告](https://www.minimax.cn/news)、[模型发布记录](https://platform.minimax.io/docs/release-notes/models)、[官方模型仓库](https://github.com/MiniMax-AI) | [MiniMax Agent / Code Changelog](https://agent.minimax.io/docs/changelog)、[MiniMax Agent 公告](https://www.minimax.io/news/minimax-agent) |
| Gemini | [Gemini API Changelog](https://ai.google.dev/gemini-api/docs/changelog)、[DeepMind 模型页](https://deepmind.google/models/gemini/) | [Gemini CLI 仓库](https://github.com/google-gemini/gemini-cli)、[Antigravity 官网](https://antigravity.google) |
| Grok | [xAI 新闻](https://x.ai/news)、[xAI API Release Notes](https://docs.x.ai/developers/release-notes) | 同左（Grok Build、Grok Bot、Team Bots 等产品公告见 xAI 新闻） |

## 历史追溯

模型历史从 2020 年起补齐；各品牌按自己的实际发展记录，不补造早期节点。只在历史补漏或日期冲突时查下表，不在每次查新时重读全部资料。

| 品牌 | 固定原始资料 | 主要用途 |
| --- | --- | --- |
| OpenAI | [GPT-3 报告](https://openai.com/index/language-models-are-few-shot-learners/)、[2020 API 公告](https://openai.com/index/openai-api/)、[InstructGPT](https://openai.com/index/instruction-following/)、[GPT-3.5 API 同期官方发布帖](https://community.openai.com/t/introducing-chatgpt-and-whisper-apis/80485/1) | 预训练、指令对齐与 API 起点；避免把后续文章更新日当首发日。 |
| Claude | [首代公告](https://www.anthropic.com/news/introducing-claude)、[100K 上下文](https://www.anthropic.com/news/100k-context-windows)、[Sonnet 3.5 同期 Bedrock 公告](https://aws.amazon.com/about-aws/whats-new/2024/06/anthropic-claude-3-5-sonnet-model-bedrock/)、[Haiku 3.5 可用公告](https://aws.amazon.com/about-aws/whats-new/2024/11/anthropics-claude-3-5-haiku-model-amazon-bedrock/) | AWS 资料只用于证明对应平台的实际可用日期，不据此推定所有平台同时上线。 |
| Qwen | [初代仓库 News](https://github.com/QwenLM/Qwen#news-and-updates)、[Qwen-VL](https://github.com/QwenLM/Qwen-VL#news-and-updates)、[Qwen-Audio](https://github.com/QwenLM/Qwen-Audio#news-and-updates)、[历史博客](https://qwenlm.github.io/blog/) | 初代权重、视觉与音频路线；区分报告、权重和博客公告日期。 |
| GLM | [原始 GLM 论文](https://arxiv.org/abs/2103.10360)、[团队历史报告 v2，PDF 第 2 页](https://arxiv.org/pdf/2406.12793v2#page=2)、[GLM-130B 官方 News](https://github.com/zai-org/GLM-130B#news)、[GLM-4 官方活动回顾](https://www.zhipuai.cn/zh/news/8) | 2021 架构与 GLM-10B、GLM-130B、ChatGLM 各代；月份表和活动实际日期。 |
| Kimi | [Moonshot-v1 回顾与 Kimi Latest 说明](https://platform.kimi.com/blog/posts/kimi-latest)、[API 历史博客](https://platform.kimi.com/blog) | 早期 API 开放日期；稳定模型与滚动别名区别。 |
| DeepSeek | [Coder 初始仓库快照](https://github.com/deepseek-ai/DeepSeek-Coder/blob/a4ba628dfdc2e56f1fd6cdd86df103ce4d3df73e/README.md)、[LLM 早期快照](https://github.com/deepseek-ai/DeepSeek-LLM/blob/f8b3d77beb4449d77932eccc6abe08826ad3c608/README.md)、[MoE 原始论文](https://arxiv.org/abs/2401.06066)、[Math 原始论文](https://arxiv.org/abs/2402.03300) | 核对当时已有的模型与下载说明；固定 SHA，不用仓库最近修改日期反推首发。 |
| MiniMax | [正式招股书，PDF 第 211 页](https://www1.hkexnews.hk/listedco/listconews/sehk/2025/1231/2025123100025.pdf#page=211)、[模型月份表，第 212 页](https://www1.hkexnews.hk/listedco/listconews/sehk/2025/1231/2025123100025.pdf#page=212)、[abab 6.5 公告](https://www.minimax.io/news/abab65-series) | 早期 abab、Speech、视频与音乐模型；内部使用和公开可用分别记录。 |

具体日期差异与已采用口径见 [历史日期笔记](history-dates.md)。固定的是证据出处，后续可依据新原始证据修正，不能仅靠此索引认定事实一直有效。

## 日期与收录

- 优先选新模型家族、能力或部署形态显著改变、Agent 产品发布、关键协议与托管执行节点。补丁版本只在有实质变化时收录。
- 同一模型的新闻公告与平台上线日期不同，可以分别记录真正不同的事件，并在标题或标签中明确；不能把同一发布拆成重复节点。
- GitHub release 发布时间可证明该版本公开发布；普通提交只证明文档或代码当时已有对应内容，不能单靠时间戳认定所有平台上线。核对提交内容、模型下载说明和同期公告。
- 年份、精确日期与 Beta / GA 状态以原文为准。保留受限访问、预览、实验模型、技术报告和平台上线等区别。
- 查新起点以每品牌最后收录日期为线索，保留少量重叠范围，防止遗漏稍早公告；来源有不同版本或日期争议时追溯首发原文。

## 维护来源

- 日常入口用于发现变化；写入节点时保留具体公告或带日期锚点的原文，不只链接首页。
- x.com 仅用匿名网页访问（如 [@SpaceXAI](https://x.com/xai)）作辅助核验：仅在官方公告、Changelog、模型仓库等来源缺失时使用，帖子日期与内容作线索，不作唯一证据；不配置账号、不使用付费 API。
- 论文保存版本和初次提交日期；PDF 记录文件版本、PDF 页码及印刷页码，表格或时间图须检查原始版面。
- URL 迁移时核对官方归属与正文再更新。2026-10-09 已确认旧 Moonshot Changelog 跳转为入门文档，因此改用官方 API 博客，不将入门页标作发布记录。
- 当前页面或平台文档中的使用示例、退役记录和快照名，只能作为核验线索，不自动生成发布节点。
