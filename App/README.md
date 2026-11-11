# 本地运行

在 `.env.local` 中分别配置业务 API 和独立用户服务：

```dotenv
NEXT_PUBLIC_API_BASE_URL=/community-api
COMMUNITY_API_PROXY_TARGET=http://127.0.0.1:9091/community
NEXT_PUBLIC_USER_API_BASE_URL=https://your-user-gateway.example/alisa-gateway
```

用户服务地址填写网关前缀，不包含 `/api/v1/user/signin`。登录、注册和用户资料请求使用此地址，与业务 API 独立。浏览器直接请求用户网关，网关需要允许前端来源的跨域请求。

本地直接访问社区后端时，还需在 `science_community/community_service/.env` 设置 `USER_SERVICE_BASE_URL`，值与前端用户网关前缀一致。社区后端将 Bearer 令牌发送到独立用户服务的 `/api/v1/user/profile` 验证，通过后才建立用户上下文，无需共享用户服务签名密钥。未配置此变量的部署继续使用原有网关身份模式；不要将依赖网关身份的后端直接暴露到公网。

更换用户服务时更新 `NEXT_PUBLIC_USER_API_BASE_URL`，然后重启 `npm run dev`；生产环境需要重新构建。未配置用户服务地址时会明确提示配置缺失。

运行 `npm run dev`，打开 http://127.0.0.1:3001 。本地开发的 `/community-api` 会代理到 `COMMUNITY_API_PROXY_TARGET`，目标地址包含后端的 `/community` 上下文路径。更换社区后端时修改此变量并重启前端；此变量仅供服务端代理使用，无需 `NEXT_PUBLIC_` 前缀。生产环境应将 `NEXT_PUBLIC_API_BASE_URL` 配置为实际业务网关地址。

部署统一跟踪 `main`。运行清单位于 `deploy/kubernetes`；一次性镜像构建 Job 位于 `deploy/build`，发布新镜像时单独执行，避免普通配置同步触发重复构建。

## Alisa OAuth2

网站支持 Authorization Code + PKCE（S256）。在 Alisa Admin 的 Science Community 租户登记公开委托应用，回调地址为
`https://alisa.vip.cpolar.cn/science/auth/oauth/callback`。网站应用请求并批准
`science-community:community:read science-community:community:write`。
第三方应用可以只申请读取范围。用户还需要对应租户资源授权，社区内成员和管理员权限继续由业务服务检查。

前端服务通过运行时环境变量配置，Client ID 可以公开，不配置 Client Secret。

```properties
ALISA_OAUTH_ISSUER=https://alisa.vip.cpolar.cn/admin/auth
ALISA_OAUTH_CLIENT_ID=<网站公开应用 Client ID>
ALISA_OAUTH_REDIRECT_URI=https://alisa.vip.cpolar.cn/science/auth/oauth/callback
ALISA_OAUTH_SCOPES=science-community:community:read science-community:community:write
```

生产环境由 Secret `science-oauth-web` 提供这四个字段。
回调使用一次性 state、十分钟有效期和 PKCE，成功交换后调用社区后端验证身份。
访问令牌沿用当前前端的登录存储机制。退出登录清除本地令牌，管理员停用应用或撤销授权可使令牌失效。

社区后端 `science-config` 需增加以下字段。资源服务器凭据单独在 Admin 创建，仅在后端使用。

```properties
ALISA_OAUTH_ISSUER=https://alisa.vip.cpolar.cn/admin/auth
ALISA_OAUTH_INTROSPECTION_URI=https://alisa.vip.cpolar.cn/admin/auth/oauth2/introspect
ALISA_OAUTH_AUTHORIZATION_URI=https://alisa.vip.cpolar.cn/admin/api/v1/authorization/check
ALISA_OAUTH_RESOURCE_CLIENT_ID=<验证凭据 Client ID>
ALISA_OAUTH_RESOURCE_CLIENT_SECRET=<验证凭据 Client Secret>
SCIENCE_COMMUNITY_WRITE_TENANT_ID=<Science Community 租户 ID>
```

HTTP 查询需要读取范围，写入需要写入范围，公开资源的匿名读取沿用现有行为。
后台应用凭据用于内省访问令牌，社区业务操作要求用户身份。
上线 Alisa 的新版本后重新获取令牌，内省响应会包含展示用用户名，稳定 userId 用于关联已有业务记录。

验证步骤包括网站使用 Alisa 登录、旧账号资料关联、读取令牌写入被拒绝、错误租户被拒绝，
以及撤销授权后原令牌失效。公开社区浏览也应在未登录状态下验证。
