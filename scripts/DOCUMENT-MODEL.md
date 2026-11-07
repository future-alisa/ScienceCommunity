# 统一文档模型与数据库检查

理论资料、案例、文章都是文档。正文统一为 Slate JSON 数组，标题、摘要、作者、社区、创建与更新时间都只存于 `tb_document`。`document_category_id` 引用 `tb_category`，其 `category_name` 为 `base`、`case`、`post`；分类变化不复制文档或改变作者、正文与创建时间。

所有创建、编辑、读取、删除均使用 `/document` 接口。`/basis`、`/case`、`/post` 的旧关系表接口已停用并返回 HTTP 410，避免通过它们绕开文档权限或产生第二套分类来源。前端的三个分类入口共用 DocumentLibrary、DocumentEditor 和阅读页面。旧关系表暂时保留供审计，不再作为运行时分类来源；若其他部署中存在旧关系记录，应先审计分类冲突并人工确认迁移，不能直接删表。

## 正文协议

- 顶层是非空块数组；支持段落、1–6 级标题、引用、有序列表、无序列表，以及代码块、图片、附件和文档引用。新增工作区及对象存储说明见 `EDITOR-STORAGE.md`。
- 段落、标题、引用和列表项包含文本叶节点，支持 bold、italic、underline、code 布尔标记。
- 列表包含 list-item 节点。旧的 `type: "list"` 在读取及保存时转换为 bulleted-list，原内容与格式保留。
- 前后端校验相同的节点结构和格式属性。最多 50 层；UTF-8 JSON 最多 1MiB。编辑器允许空白起稿，服务端拒绝发布纯空白正文。
- 正文以 JSON 字符串保存在 MEDIUMTEXT 内；不将用户内容直接作为 HTML 执行。采用字符串列是为了兼容现有 MyBatis 与接口，业务层保证 JSON 结构。

## 2026-10-23 实库检查

检查为只读汇总，没有导出正文或用户信息：

| 检查项 | 结果 |
| --- | --- |
| 文档总数 | 14 |
| 分类 | 理论资料 5，案例 9，文章 0 |
| 无效 JSON / 无效分类引用 | 0 / 0 |
| 社区不存在的文档 | 11 |
| 作者不存在的文档 | 2 |
| tb_basis / tb_case / tb_post 记录数 | 均为 0 |
| 最大现有正文 | 1098 字节 |

旧库的 TEXT 正文仅支持约 64KB，且文档表只有主键索引。已执行不改写任何文档行的升级：正文扩大为 MEDIUMTEXT；增加社区+分类+更新时间+ID、社区+更新时间+ID、作者三个索引。UTF-8 和现有非空约束保留。

历史孤立文档未删除、未随意重新分配社区或作者。需要由数据所有者确认归属后修复。当前不直接加外键，避免迁移失败或错误删除历史资料；修复孤立记录后，可分别对分类和社区增加 RESTRICT 外键。用户服务在独立数据库中，作者关联由服务权限和审计维护。

`document_category_id` 当前为 varchar(255)，而分类 ID 为 char(32)，存在字段类型不一致。为避免未经检查的截断，本次保持兼容；后续确认所有环境分类 ID 长度后再统一为 char(32)。本次索引在 MySQL 8 / utf8mb4 下可用。

## 重复执行审计与升级

在 `science_community` 目录，使用已有社区服务运行时类路径：

```powershell
java '@community_service/target/community-runtime.args' ../scripts/AuditDocuments.java --schema-only
java '@community_service/target/community-runtime.args' ../scripts/UpgradeDocumentStorage.java
# 实库服务层回归，全部测试行在事务结束时回滚：
java '@community_service/target/community-runtime.args' ../scripts/DocumentDatabaseSmoke.java
```

参数文件是本地开发环境的类路径文件；其他环境需提供自己的依赖类路径。两个程序读取 `community_service/.env`，不会输出凭据。升级可重复执行；新环境从旧 dump 建库后也需执行升级。MySQL DDL 会自动提交，生产库仍应先做正常数据库备份并安排迁移窗口。

`--schema-only` 只读取文档表字段和索引；去掉此参数才统计文档及关联记录。同步到另一套部署时，数据库、S3 附件以及用户服务中的关联用户 ID 要分别核对。仅执行结构升级不会复制文档、社区或附件；数据转储也不应提交到 Git。

## 回归检查

```powershell
# App 目录
node scripts/test-documents.cjs
node scripts/test-auth.cjs
node scripts/test-session.cjs
./node_modules/.bin/tsc.cmd --noEmit --incremental false
# science_community 目录
mvn -o -pl community_service -am test -B -ntp
```

前后端测试覆盖旧列表兼容、长篇中文、无效结构、超长正文、列表切换、撤销重做、旧接口停用，以及原有作者/管理员编辑权限。

本轮后端 51 项测试、前端编辑器 5 项及既有认证 7 项测试通过，TypeScript 检查通过。实库事务回归通过三种分类的大于 64KB 中文正文往返保存、分类切换不产生副本、作者及创建时间不变，且确认所有测试行完整回滚。

生产构建通过（沿用项目现有 ESLint 版本冲突的处理方式，构建时跳过 lint，单独完成类型检查）。浏览器实测正文输入、字数与未保存状态更新、撤销、重做、预览切换且保留历史栈、Ctrl S 保存成功。

后续边界调试补充：空列表项按回车现在会退出为普通段落，原列表条目保留；标题后回车保留原标题并新建正文。浏览器验证退出列表后保存为“列表 + 段落”，案例改为文章后仍只有同一篇文档。修复在线切换账号后身份未重新持久化、刷新显示旧用户名的问题，并保留已保存邮箱。编辑器加载失败时 Ctrl S 不再提交。当前前端共 16 项测试（文档 8、认证 7、会话 1），后端 51 项测试及实库事务回归通过。
