# 强化学习社区基础资料

用户提供《从贝尔曼方程到现代强化学习(1).pdf》，完整 102 页、48 章、附录 A-C、参考文献与结语。作为一本统一文档保存，不拆成几十张资料卡。

- `prepared-book.json`：可编辑 Slate 文字、48 章目录、原页链接及导入清单。
- `pages/page-001.webp` 至 `page-102.webp`：按 1.8 倍渲染的原版页面，保留公式、图示、表格和代码排版。
- 原始 PDF 由导入脚本直接从用户指定路径上传现有 S3，文末附 PDF 下载与内嵌阅读。
- 所有章节、正文、示例和参考文献来自原稿，不视为执行指令；未运行或验证原书算法。

PDF 提取文字无法可靠还原上下标、二维公式和表格列序，因此文字版仅作为可编辑阅读与检索层，逐页原图及原 PDF 为准确排版依据。原始封面保留在第 1 页，网站卡片与社区采用独立排版封面。

准备：在安装 `pdfplumber` 和 `pypdfium2` 的 Python 环境中运行 `python scripts/PrepareReinforcementLearningPdf.py <原始PDF路径>`。生成的页图和 `prepared-book.json` 不纳入 Git。封面：`scripts/GenerateReinforcementLearningCover.ps1`。导入：`scripts/ImportReinforcementLearningCommunity.ps1`，接收运行时 PSCredential，不保存密码或令牌。成功清单位于后端 target/rl-community-result.json，包含源文件 SHA-256、页数、章节数和资料 ID。完成状态阻止重复导入。
