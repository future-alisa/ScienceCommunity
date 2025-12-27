export const s3Config = {
  endpoint: process.env.NEXT_PUBLIC_OSS_ENDPOINT!,
  viewEndpoint: process.env.NEXT_PUBLIC_OSS_VIEW_ENDPOINT!,
  accessKeyId: process.env.NEXT_PUBLIC_OSS_ACCESS_KEY!,
  secretAccessKey: process.env.NEXT_PUBLIC_OSS_SECRET_KEY!,
  bucket: process.env.NEXT_PUBLIC_OSS_BUCKET!,
  region: process.env.NEXT_PUBLIC_OSS_REGION || "garage",
} as const;

// 浏览器端检查
if (typeof window !== "undefined") {
  if (!s3Config.accessKeyId || !s3Config.secretAccessKey) {
    console.error(
      "❌ S3 配置在前端未读取到，请确认环境变量已添加 NEXT_PUBLIC_ 前缀"
    );
  }
}
