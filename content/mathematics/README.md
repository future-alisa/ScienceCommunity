# 数学基础资料

当前社区以四份教材式文档展示，章节放在各自正文中，不再将每章列为独立资料卡片：

1. 高等数学上册：学习指南与六章，合并原 00—06 篇。
2. 高等数学下册：五章，合并原 07—11 篇。
3. 线性代数：六章，源文稿为 linear-algebra.md。
4. 概率论与数理统计：八章，源文稿为 probability-statistics.md。

“案例”分类对应四份案例集，每份三个案例，共十二例，源文稿 common-cases.md：

- 高数上册：无盖纸盒容积优化、速度函数求位移、牛顿冷却模型。
- 高数下册：预算约束下资源分配、非均匀薄片质心、对数级数近似及误差界。
- 线性代数：产品生产安排、最小二乘拟合、两状态马尔可夫链。
- 概率统计：质检报警的贝叶斯分析、二项分布与泊松近似、均值置信区间和检验。

案例包含假设、建模、计算、解释与延伸练习。全部数值为教学构造。ImportMathCases.ps1 仅写入当前数学社区的 case 分类，并给对应基础教材添加互相跳转的链接；已有同名但内容不同的资料会停止导入，避免覆盖。教材链接修改前的备份、案例导入结果分别保存在 target/math-case-link-backups.json、target/math-cases-result.json。链接的页面域名由 SiteOrigin 参数指定；跨域部署时需同步更新。案例封面在 case-covers/，可用 GenerateMathCovers.ps1 -CaseEdition 重建。

原高数源文稿 calculus-foundations.md 保留作为内容来源；旧章级封面 covers/ 保留，新教材封面位于 book-covers/。GenerateMathCovers.ps1 的 BookEdition 开关生成教材封面。正文仍使用统一 Slate JSON，一级标题对应章节，二级标题对应章节内的小节。阅读页 DocumentReader 自动生成可点击目录，窄屏目录位于正文上方。

OrganizeMathBooks.ps1 只操作固定数学社区及原导入清单，先将原 12 篇完整记录备份到 science_community/community_service/target/math-books-original-backup.json，全部新教材保存并读回验证后，才移除重复旧章节记录。结果 ID 写入同目录 math-books-result.json。脚本拒绝重复执行；旧导入与封面填充脚本也会在检测到教材迁移记录后停止，避免恢复错误的章节粒度。

数据库仍存一份文档正文，没有引入独立“章节表”。章节属于文档内容；目录点击跳转对应标题，原正文、例题与练习保留。四本目前都是原创基础讲义，不是完整商业教材的转载。
