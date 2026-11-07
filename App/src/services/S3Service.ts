import { api } from "./ApiService";
class S3Service {
  async upload(file: File, communityId?: string, purpose = "attachment"): Promise<string> {
    const token = api.getToken();
    if (!token) throw new Error("请先登录再上传附件");
    const form = new FormData(); form.set("file", file);
    if (communityId) form.set("communityId", communityId);
    form.set("purpose", purpose);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("社区接口尚未配置");
    const response = await fetch(baseUrl.replace(/\/$/, "") + "/storage", { method: "POST", headers: { Authorization: "Bearer " + token }, body: form });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.code !== 200) throw new Error(result?.message || "附件上传失败，请重试");
    return result.data.url;
  }
}
export const s3 = new S3Service();
