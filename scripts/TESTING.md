# 社区流程联测

在开发环境启动网关、用户服务和社区服务后，从仓库根目录使用 PowerShell 7：

```powershell
./scripts/test-community-flows.ps1
# 网关地址不同时：
./scripts/test-community-flows.ps1 -Gateway https://your-development-gateway
```

脚本注册四个随机账号，验证成员添加、角色升降级、权限拦截，以及三个账号并行发送 60 条消息、历史分页、重试去重和成员移除后的权限回收。它通过真实网关和数据库执行，不包含浏览器交互验证。需要 PowerShell 的 ThreadJob 模块。

脚本在 finally 中清理自己创建的频道、消息、成员关系和社区。用户服务没有随本仓库提供账号删除接口，因此账号名称和邮箱会记录到被 Git 忽略的 `science_community/community_service/target/flow-fixture.json`，密码和令牌仅留在内存。请先检查脚本输出确认社区已清理，再清理账号。

在 `science_community` 目录，使用社区服务的运行时依赖类路径执行：

```powershell
java '@community_service/target/community-runtime.args' ../scripts/CleanupFlowAccounts.java community_service/target/flow-fixture.json
```

`community-runtime.args` 是本地运行环境生成的 Java 类路径参数文件；其他环境请使用自己的社区服务运行时类路径。清理程序读取 `community_service/.env` 中现有数据库配置，只删除记录中随机测试前缀且用户名、邮箱均精确匹配的账号；若账号仍有社区成员关系则拒绝删除。清理成功后删除该 fixture JSON，再进行下一轮。若中途清理失败，保留记录并按其中的社区 ID 检查，不能覆盖它。

前端认证回归测试和类型检查（在 `App` 目录）：

```powershell
node scripts/test-auth.cjs
./node_modules/.bin/tsc.cmd --noEmit --incremental false
```

后端单元测试（在 `science_community` 目录）：

```powershell
mvn -o -pl community_service -am test -B -ntp
```

2026-10-21 第一轮实测：28 项真实接口检查通过。发现并修复前端注册漏传邮箱导致 HTTP 500，以及退出登录后请求层仍使用旧令牌的问题。

代理排除规则调整后的复测：扩展至 33 项真实接口检查，新增社区编辑、外部用户权限拦截、频道编辑与删除权限、非空社区删除保护和跨频道消息隔离。浏览器实测注册登录、退出与账号切换、创建社区及邀请已注册成员、角色调整、频道创建和编辑、第二位成员加入频道、按钮及 Enter 发送中文消息、刷新恢复历史。

浏览器测试发现创建社区没有成功反馈和跳转、邀请列表没有实际提交，已修复。创建期间禁用重复提交；成员添加失败时明确告知社区已创建及失败名单，并跳转管理页处理，避免误认为社区创建失败而重复创建。

后端重启后的持久化实测通过：两位浏览器用户发送的消息 ID、顺序及内容保持一致，刷新页面仍能恢复完整对话。移除第二位成员后，正在打开的聊天页面自动清空消息和输入框，显示权限错误。本轮接口和浏览器测试创建的所有账号、社区、频道及消息已清理。另修正前端删除社区服务调用的错误路由，新增接口契约回归测试。
