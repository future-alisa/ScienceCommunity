import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { s3Config } from "@/config/s3Config";
import { IdUtils } from "@/util/IdUtil";

class S3Service {
  private client = new S3Client({
    endpoint: s3Config.endpoint,
    region: s3Config.region,
    credentials: {
      accessKeyId: s3Config.accessKeyId,
      secretAccessKey: s3Config.secretAccessKey,
    },
    // Garage 必须使用 Path Style
    forcePathStyle: true,
  });

  async upload(file: File): Promise<string> {
    // 生成 32 位无横杠 UUID，完美适配 Java 后端
    const fileName = `${IdUtils.uuid32()}.${file.name.split(".").pop()}`;

    try {
      const task = new Upload({
        client: this.client,
        params: {
          Bucket: s3Config.bucket,
          Key: fileName,
          Body: file,
          ContentType: file.type,
        },
      });
      await task.done();

      // 返回 Nginx 代理后的永久展示 URL
      return `${s3Config.viewEndpoint}${fileName}`;
    } catch (error) {
      console.error("上传至 Garage 失败:", error);
      throw error;
    }
  }
}

export const s3 = new S3Service();
