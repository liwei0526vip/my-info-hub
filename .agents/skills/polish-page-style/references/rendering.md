# 渲染入口与接入方法

## 作用与来源

本技能借鉴 Answer me with HTML 的“按信息形态选组件、结构化草稿、自动绘图与内容驱动布局”。内置固定版本的原始 CLI，供生成参考组件与整页预览；不把它的独立页面外壳直接替换本站。

- 上游：[QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- 版本：0.5.11；提交：`053619b917c6bf2e17eae5496d05eb08e10fe889`。
- 原始入口：[上游 SKILL.md](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/skills/answer-me-with-html/SKILL.md)。其中安装、配置、自动生成回复页、清理、视频、更新等流程不是本技能的操作要求。
- 本地渲染器：[am.mjs](../scripts/vendor/answer-me-with-html/am.mjs)，保持上游原样；版本、来源和校验值见 [upstream.json](../scripts/vendor/answer-me-with-html/upstream.json)。
- 授权文件：[MIT LICENSE](../scripts/vendor/answer-me-with-html/LICENSE) 与 [第三方声明](../scripts/vendor/answer-me-with-html/THIRD_PARTY_NOTICES.txt)。迁移代码时保留适用声明。

渲染依赖已经打包，仅需要 Node.js 20+。无需全局 am、其他技能安装或 npm install；不自动更新这个固定副本。

## 使用隔离入口

把草稿写入任务临时目录，使用本技能目录中的脚本。路径按实际 skill 位置填写，不在命令里保留占位符。

```bash
node /绝对路径/polish-page-style/scripts/render-reference.mjs /绝对路径/临时目录/draft.md
node /绝对路径/polish-page-style/scripts/render-reference.mjs /绝对路径/临时目录/draft.md --template sheet --theme paper
node /绝对路径/polish-page-style/scripts/render-reference.mjs --help-component flow
```

返回 JSON 中的 referenceHtml 是新建临时目录内的参考页。脚本校验渲染器完整性，将配置和状态隔离到同一临时目录，关闭自动打开、联网更新检查与文字风格检查。内容改写由本技能依据保真规则决定，渲染器不替你改写。

sheet 适合并列概览，doc 适合顺序阅读；blueprint、paper、shadcn 用于观察参考效果。最终组件仍服从目标站点主题。不要直接调用上游的 patch、config、clean、update 或 serve 改动原页面或用户环境。

## 草稿与组件语法

```markdown
---
title: 页面主题
template: sheet
theme: paper
lang: zh
---
## 主题块
一块内容回答一个子问题。
```

按内容选择以下围栏块。复杂语法用隔离入口的 --help-component 查本地帮助，不猜参数。

| 类型 | 最小内容形式 | 适合的关系 |
|---|---|---|
| flow LR 或 flow | `客户端 -> 网关: 请求`；`{成功?} -> 服务: 是` | 连线、顺序、分支、架构；默认方向可按阅读空间调整 |
| sequence num | `客户端 -> 服务端: 请求`；`服务端 --> 客户端: 响应` | 多方消息往返，`== 阶段 ==` 分阶段 |
| timeline 或 timeline v | `2024-08 \| 标准发布 \| 说明`；行首 * 强调 | 按日期演进的里程碑 |
| tree | 缩进表示层级，`名称 \| 说明` | 分类、模块与目录 |
| er | 实体名独占一行；缩进字段，`user_id FK -> User` | 实体、字段和基数；先查看完整语法 |
| chart bar horizontal unit=B | `名称 \| 1184`，行首 * 强调 | 类别数值对比；chart line 表达趋势，chart pie 表达一个整体的构成 |
| limits | `名称 \| 13 / 20 \| GB` | 当前值与限额 |
| kv cols=2 | `字段: 值`，`* 长字段: 值` 通栏 | 属性元数据 |
| callout warn 注意 | 简短 Markdown 内容 | 结论、提醒、限制 |
| Markdown 表格 | 列标题、单位与对照行 | 多维查值，状态列可用 ok / no / warn |

图表输入用普通数值，不带千位分隔符；多系列先提供系列名，明确单位和数据口径。未核实的信息不转化成确定的节点、数值或结论。

例如多方请求：

````markdown
---
title: 请求交互
theme: paper
lang: zh
---
## 消息顺序
```sequence num
客户端 -> 网关: 请求
网关 -> 服务: 转发
服务 --> 网关: 结果
网关 --> 客户端: 响应
```
````

## 从参考结果接回现有页面

1. 在临时参考页检查组件选型、图形结构和标签，先修正草稿中的数据与关系。让渲染器计算复杂坐标，不手工拼长路径猜节点位置。
2. 只取需要的组件片段。表格、键值块、时间轴优先接入本站对应 HTML / CSS；流程、时序、ER 和数值图可取生成的 SVG。
3. **裸 SVG 通常不自带全部样式。** 查明组件使用的 CSS 类、变量、字体和 marker，再移植必要样式；仅复制 SVG 标签不能视为完成接入。用页面前缀容器限定选择器，把颜色与字体映射到目标页的变量。
4. 给每个图形实例的 ID 加唯一前缀，同时更新 url(#...)、href / xlink:href 和可访问性引用。多张图不能共用箭头、渐变或裁切 ID。
5. 保留 viewBox、说明性标题或 aria-label，添加对应图注和来源。文字不能因为等比缩放变成不可读；按需要改变方向、分段或在图内滚动。
6. 由目标页负责整体编排、局部 CSS 和已有交互。不要导入参考页的全局 html/body/:root 规则、顶栏、主题切换、Reply、复制源文、自动排版脚本或 CSP；它们可能覆盖本站样式或阻断原功能。
7. 接入后重新检查桌面 / 窄屏、图形连线、数据口径、原页面交互与旧锚点。参考页显示正确不等于目标页已经正确。

若隔离渲染失败，读具体行号和组件错误，修正草稿再试。缺少 Node 或渲染器损坏时说明实际限制，保留可用的原表达；不自动安装环境，也不悄悄省略原内容。
