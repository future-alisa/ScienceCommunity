# 写作工作区与对象存储

## 自定义封面

加载优化：同屏私有图片通过 `/storage/read-urls` 批量签名（最多 50 个，按社区去重校验）；相同地址的并发请求合并。签名链接在内存与 sessionStorage 缓存 8 分钟，签名本身 10 分钟过期。缓存按登录令牌的 SHA-256 指纹隔离，不保存令牌；退出、切换账号后不复用其他账号链接。页面每分钟检查缓存，到期重新签名。首屏前六张封面使用 eager，其余 lazy。原单地址读取接口保留兼容。测试脚本 `App/scripts/test-storage-url-cache.cjs` 覆盖批量、并发去重、刷新复用、过期、账号隔离与失败重试。

无封面时，列表、社区详情和资料正文页统一显示按学科/标题生成的极简 SVG 版面；已设置封面时，等待签名与图片下载期间使用中性定高占位，不先展示默认封面，避免颜色跳变；确认读取失败时才回退。签名刷新临时失败时，在原链接有效期内保留已有图片。不再统一使用旧占位图。默认封面无需 S3 对象。`content/mathematics/covers/` 是原创数学系列 PNG 封面，`GenerateMathCovers.ps1` 可重建，`FillMathCovers.ps1` 只处理固定数学社区及该次导入清单中的文档，保留已有封面，不遍历其他社区。

- 资料：发布/编辑文档中的“资料封面”支持上传、预览、更换、移除；点击发布或保存修改后生效。理论资料、案例、文章共用此能力。
- 社区：创建页面支持封面；已有社区在“我的社区 → 社区封面”更换或移除，然后点击“保存封面”。仅拥有者、管理员可修改已有社区封面。
- 封面支持 PNG/JPEG/WebP/GIF/AVIF，单张最多 5MB，建议 1200×600；展示按 2:1 居中裁切。上传中禁止保存，失败保留原封面。切换资料目标社区会清空尚未保存的封面选择。
- 数据库继续使用 document_thumbnail_url、community_image_url 保存稳定对象地址，不保存图片二进制或过期签名。不需要新增表或字段。
- Java `/storage` multipart 的 purpose 可为 attachment（默认）、document-cover、community-cover。资料封面按社区隔离，社区封面写入 covers 前缀，已有社区上传时校验管理权限。`POST /community/{id}/cover` 只更新封面列，避免覆盖社区名称和简介。
- 读取继续使用短时签名，S3 桶保持私有。移除封面只清空引用，不删除 S3 原对象，以免破坏其他引用；未引用对象回收仍需后续生命周期策略。
- 验证：62 项 Java 测试、TypeScript、3 项前端上传契约测试通过。`scripts/TestCovers.ps1` 使用临时社区和文档验证真实上传、保存、私有读取、移除，清理数据库后由 `CleanupCoverObjects.java` 删除该次测试记录中的 S3 文件。

理论资料、案例、文章仍使用同一套 Slate JSON 文档。富文本与 Markdown 是两种编辑方式，不是两套数据库格式。新增的图片、附件、代码块和文档引用也保存为该文档的结构化节点。

## 当前支持

- 空正文最小高度为 `clamp(520px, 65vh, 900px)`，显式覆盖 Slate 占位符计算出的内联高度；删除了重复的全局编辑器边框与内边距覆盖。
- 富文本、Markdown 源码、分栏预览、目录、专注模式；Ctrl / Cmd S 保存。
- Markdown 标题 H1–H6、单层列表、引用、代码块、粗体、斜体、行内代码、链接、独立成段的图片、附件和文档嵌入。
- 富文本代码块中 Enter 换行，Ctrl / Cmd Enter 退出到普通段落。
- `![[社区内唯一的文档名称]]` 可解析为稳定 ID；富文本“嵌入文档”提供选择器。保存使用 ID，改名不会断开引用。嵌入读取原文最新内容，遵循原文权限，循环或超过三层会停止展开。
- 图片内嵌显示，PDF 提供内嵌阅读及打开链接，其他附件显示下载卡片。删除编辑器中的卡片仅移除正文引用，不删除存储中的原文件。

这是一版类似 Obsidian 的写作体验，不包含它的插件生态、知识图谱或实时多人协同。当前不能无损转换的下划线、非左对齐会阻止切换到 Markdown；嵌套列表给出提示，避免静默丢失格式。Markdown 中的 HTML 按普通文本显示，不执行 HTML。

## 你需要提供的存储

现有 MySQL 继续存正文，不需要新文本数据库。图片与附件使用 S3 兼容对象存储即可，例如现有 Garage、MinIO、AWS S3 等。无需再部署另一套文件存储。

将以下字段写入 **science_community/community_service/.env**，不要把密钥发送到聊天，也不要使用 `NEXT_PUBLIC_` 前缀：

```dotenv
S3_ENDPOINT=https://你的S3接口域名
S3_REGION=us-east-1
S3_BUCKET=app-storage
S3_ACCESS_KEY_ID=存储访问密钥ID
S3_SECRET_ACCESS_KEY=存储访问密钥
S3_PUBLIC_URL=https://浏览器可访问的文件域名/桶路径/
```

模板另见 `science_community/community_service/storage.env.example`。配置后重启 Java 社区服务。`S3_PUBLIC_URL` 是桶对应的文件访问前缀，生成文件键为 `attachments/社区ID/随机ID.扩展名`，社区封面使用 `attachments/covers/随机ID.扩展名`，因此该地址必须能映射到桶里的对应对象；其域名也需要浏览器可访问和信任。桶保持私有。正文保存不带签名的稳定地址；前端通过 Java 的 /storage/read-url 换取 10 分钟签名链接，每 5 分钟刷新。签名接口校验登录、文件键和社区成员资格；社区封面允许所有已登录用户查看。签名链接在过期前可被持有者使用，退出或移除成员不会立即撤销已签发链接。旧 attachments/随机ID 格式不自动放宽权限，需明确归属后迁移。S3_ENDPOINT 必须是浏览器也能访问的外部地址，代理需要保留路径、Host 和签名查询参数。

上传由 Java 社区服务通过 `/community/storage` 写入 S3（前端以 NEXT_PUBLIC_API_BASE_URL 加 /storage 访问）。浏览器只携带当前账号令牌上传文件，S3 密钥留在服务器。接口验证登录和目标社区成员资格，单文件最多 20MB，支持 PNG/JPEG/GIF/WebP/AVIF、PDF、TXT、Markdown、DOCX、ZIP；拒绝 HTML 和 SVG 等主动内容。由于浏览器不直接向 S3 PUT，上传本身无需配置桶的浏览器 CORS。

未配置存储时，页面仍可写作、保存与嵌入文档；上传给出“对象存储尚未配置”的明确错误。本机 Java 配置已接入 SeaweedFS（s3.docker.local、app-storage）。真实认证上传、读取内容比对、短时签名读取均通过，测试对象已删除。Windows 本机启动 Java 时使用 -Djavax.net.ssl.trustStoreType=Windows-ROOT -Djavax.net.ssl.trustStore=NONE 信任已安装的内部 CA；Linux/容器部署应将该 CA 导入专用 Java truststore，不要关闭证书校验。

## 测试

```powershell
# App 目录
node scripts/test-documents.cjs
node scripts/test-auth.cjs
node scripts/test-session.cjs
./node_modules/.bin/tsc.cmd --noEmit --incremental false
# science_community 目录
mvn -o -pl community_service -am test -B -ntp
```

已有文档不需要批量改写或换表。本次只扩展统一正文节点协议，继续使用之前的 MEDIUMTEXT。新环境仍需先运行 `UpgradeDocumentStorage.java` 完成容量和索引升级。

本轮浏览器实测：空正文实际高度 520px；Markdown 分栏实时显示标题、粗体、列表、引用和代码；专注模式、目录可用；选择社区内文档后可在草稿内展开原文。所有浏览器示例只在独立标签页中编辑，未发布到社区。服务端 59 项回归、前端 Markdown 与存储测试及类型检查通过，生产构建通过。SeaweedFS 真实文件读写和签名访问已通过独立联测；浏览器端最终上传体验仍需登录后验证。

## Java 上传迁移

前端不再安装 AWS SDK，不再使用 Next.js API route；S3 凭证仅在 Java 社区服务配置。新增 ObjectStorageServiceTest 覆盖身份、社区权限、大小、格式、缺失配置、签名写入请求、读取签名及非法键。前端 node scripts/test-storage.cjs 验证 Java multipart 调用契约。

SeaweedFS 保持 enableAuth=true。不要把 S3 管理员密钥放入前端变量；后续可给应用配置仅 app-storage 桶读写权限的独立账号。现有管理员凭证仅写入被 Git 忽略的 Java .env，没有写入模板或文档。
