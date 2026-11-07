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
