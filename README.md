# ScienceCommunity

面向多学科的学习社区。用户可以加入社区，浏览理论资料、案例和文章，并参与主题频道。

## 项目结构与启动

- `App/`：Next.js 14、React、TypeScript、Ant Design。执行 `npm ci` 后运行 `npm run dev`；开发和生产启动均使用 **3001** 端口。开发缓存使用 `.next-dev`，生产构建使用 `.next`，避免同时运行时互相覆盖页面清单。生产环境先执行 `npm run build`，再运行 `npm start`。
- `science_community/community_service/`：Java 17、Spring Boot、MyBatis，负责社区、成员、分类和富文本文档。
- `science_community/transfer_service/`：STOMP / SockJS 聊天服务。
- `science_community/sql/`：已有数据库导出。

前端通过 `NEXT_PUBLIC_API_BASE_URL`、`NEXT_PUBLIC_USER_API_BASE_URL`、`NEXT_PUBLIC_CHAT_URL` 连接服务。后端连接信息参考各服务 `example.env` 和资源目录的配置。后端还需要 Maven 中的 `com.alisa.cloud:alisa-common:0.0.1-SNAPSHOT` 公共依赖，它不在本仓库中。

## 社区成员管理

从右侧导航栏的“我的社区”进入成员与文档管理，也可打开 `/community/settings`，在管理页中选择社区。

- 社区首页支持加入、退出。当前数据模型没有私有社区标记，加入按公开社区处理；重复加入不会重复创建记录。
- 管理员可按用户名、邮箱或用户 ID 添加已有用户。这是直接添加，不是需要对方确认的邀请。
- 拥有者可在普通成员、管理员之间调整角色；管理员只能管理普通成员。拥有者不能通过这些接口被移除、降级或直接退出；暂未提供所有权转移。
- 频道成员只能从本社区成员中选择。角色继承社区角色，没有独立的频道角色。
- 移除或退出社区时，在同一事务中清理对应频道成员关系。
- 创建新社区时，自动将创建者登记为拥有者。已有社区不会自动指定拥有者；历史数据需要保留正确的角色和拥有者关系。
- 服务端从 `UserContext` 取得当前用户并验证权限；角色 ID 从 `tb_community_role` 查询，不依赖写死的 ID。

## 文档管理

- 统一支持理论与资料、案例、文章的发布、查看、编辑和删除；发布和列表分类从 `/category/getAll` 读取。
- 现有分类名 `base`、`case`、`post` 分别对应理论与资料、案例、文章。新增分类会出现在“全部资料”和发布页中。
- 社区成员可阅读、发布；作者或社区管理员可编辑、删除。
- 更新沿用原文档 ID、作者和创建时间，由服务端设置更新时间，使用包含正文 BLOB 的更新语句。
- 不能把现有文档移动到其他社区。标题最多 100 字符、摘要最多 255 字符，与当前 SQL 表结构保持一致。
- 阅读页只读；保存失败保留编辑内容，成功后进入已保存文档。
- 删除文档时清理标签及旧 `tb_basis`、`tb_case`、`tb_post` 关联。
- 列表提供搜索、分类筛选、加载、错误重试、空状态；管理表格使用前端分页。
- 当前实现管理 Slate 富文本文档，不包含 PDF/书籍文件的上传和在线预览。

## 主要接口

路径相对于前端 API base URL；实际部署仍需保留后端 context-path/网关前缀。

| 接口 | 用途 |
| --- | --- |
| `GET /communityuser/access?communityId=...` | 当前用户 ID、成员关系和角色 |
| `GET /communityuser/roles` | 社区角色选项 |
| `POST /communityuser/join` | 当前用户以普通成员身份加入；请求 `{communityId}` |
| `POST /communityuser/add` | 管理员添加已有用户；请求 `{communityId, identity, roleId}` |
| `POST /communityuser/upsert` | 受权限保护的成员创建/角色修改，禁止移动成员、更换用户 |
| `DELETE /communityuser/{id}` | 移除成员或本人退出 |
| `POST /channeluser/upsert` | 添加本社区成员到频道 |
| `DELETE /channeluser/{id}` | 移除频道成员 |
| `GET /document/getAllByCommunityId?communityId=...&typeId=...` | 按社区列出文档，分类可选 |
| `POST /document/save` | 保存并返回文档；空 ID 为新增，已有 ID 为更新 |
| `POST /document/upsert` | 兼容原调用，返回受影响记录数 |
| `DELETE /document/{id}` | 删除文档及相关分类/标签关系 |

原有成员、频道成员和文档批量写入/删除接口也逐项执行权限校验，并使用事务；空批次被拒绝。

## 验证

- 前端类型检查：在 `App/` 运行 `node_modules/.bin/tsc --noEmit --incremental false`。
- 前端生产构建：`node_modules/.bin/next build --no-lint`。当前 ESLint 配置在 Next.js 14、eslint-config-next 16 的组合下报循环 JSON 错误，本次未改动前端依赖或锁文件。
- 后端测试：在 `science_community/` 运行 `mvn -pl community_service -am test`。测试覆盖拥有者保护、管理员限制、重复加入、关联清理、跨社区频道成员、作者权限、文档 ID/作者/创建时间保留及正文 Mapper 绑定。
- 后端 45 项测试全部通过；服务逻辑测试使用 Mock Mapper，另有 MyBatis XML 绑定测试，不连接实际数据库，也不验证外部认证网关。

手工联调时准备拥有者、管理员、普通成员和非成员账号：验证加入/退出、添加/移除、角色调整、频道跨社区限制，以及发布后编辑仍使用同一文档 ID。检查读写权限失败返回 403，旧文档删除后返回 404，并测试切换社区时不会显示旧请求的数据。

最终验证：TypeScript 检查、生产构建（跳过现有故障的 Lint）和 45 项后端测试均通过；临时生产实例上的管理页、资料列表、新建文档和编辑文档四个路由均返回 HTTP 200。临时实例已关闭，以上页面请求检查不等同于浏览器交互和多账号联调。

## 尚待完善

- 私有社区、邀请确认、所有权转移及历史无拥有者数据的迁移。
- 文件附件、书籍元数据、PDF 预览、服务端分页及文档版本冲突处理。
- `transfer_service` 的旧 WebSocket 公共/私聊代码仍保留；新频道页面已改用社区服务的持久化接口，不依赖旧的内存频道会话。
- 已对开发数据库进行消息写入、中文读取、唯一约束和回滚验证；浏览器多账号及外部用户服务的完整联调仍待完成。

## 频道讨论

- 社区管理员/拥有者可创建、编辑、删除频道，创建者自动加入。删除频道会在同一事务中清理成员和消息。
- 社区成员可查看频道列表并自行加入/退出；只有频道成员能读取和发送消息。作者身份与姓名由服务端确定，不接受客户端伪造发送者。
- 成员仍在右侧“我的社区”的频道成员页管理。成员被移除后，后续读取和发送会被拒绝；页面清空消息并提示重新加载。
- 每次发送生成客户端请求 ID；服务端保存消息 ID、递增游标和时间。请求超时或失败后复用原 ID 重试，防止重复消息；超过 4000 字符或空白消息被拒绝。
- 初次读取最近 50 条消息；支持向前加载历史和按游标向后同步。消息游标以字符串返回，避免 JavaScript 大整数精度丢失。
- 新频道采用 HTTP 增量同步，前台每 3 秒检查更新、后台暂停请求；断网后自动重试，页面切换会忽略旧请求。发送确认不会推进同步游标，避免跳过其他人刚发送的消息。
- 服务启动时通过 `src/main/resources/db/channel-messages.sql` 幂等创建 `tb_channel_message`，需要数据库账号具备建表权限。生产环境可由管理员先执行该 SQL，再使用 `SPRING_SQL_INIT_MODE=never` 禁用自动初始化。
- 补齐频道简介在 MyBatis 查询、插入和更新中的映射。频道管理操作会通知当前页面侧栏刷新。
- 社区删除仅允许拥有者操作；有频道、文档或其他成员时禁止删除，避免残留频道被重建的社区重新接管。

新增接口（基于现有 API base URL）：

| 接口 | 用途 |
| --- | --- |
| `POST /channel/save` | 新增/编辑频道并返回频道数据 |
| `DELETE /channel/{id}` | 管理员删除频道及成员、消息 |
| `GET /channel/{channelId}/access` | 当前用户参与状态、管理权限、成员数 |
| `POST /channel/{channelId}/join` | 当前社区成员加入频道，重复加入幂等 |
| `POST /channel/{channelId}/leave` | 当前用户退出频道 |
| `GET /channel/{channelId}/messages` | 最近 50 条及是否存在更早消息 |
| `GET /channel/{channelId}/messages?before=...` | 更早消息 |
| `GET /channel/{channelId}/messages?after=...` | 按游标获取之后的消息；`hasMore` 表示还需继续补齐 |
| `POST /channel/{channelId}/messages` | 请求 `{content, clientMessageId}`，返回服务端确认的消息 |

验证时以两个已加入社区的账号进入同一频道：加入后发送和刷新应保留历史，发送失败可单独重试；移除一名成员后，其下一次同步/发送应被拒绝。所有旧的内存聊天室历史不迁移到新表。

本轮频道验证：45 项后端测试、TypeScript 检查和最终生产构建通过（跳过既有故障的 Lint）；真实数据库中文消息读写、递增游标、重复请求唯一约束及事务回滚通过。社区后端已重启，新接口已加载，未登录频道列表请求返回 401。浏览器双账号消息联调尚未执行。
