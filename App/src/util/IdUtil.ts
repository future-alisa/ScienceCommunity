import { v4 as uuidv4 } from "uuid";

export class IdUtils {
  /**
   * 生成 32 位无横杠 UUID
   * 逻辑：生成标准 v4 UUID (8-4-4-4-12) 并替换掉所有的 "-"
   */
  static uuid32(): string {
    return uuidv4().replace(/-/g, "");
  }

  /**
   * 原生方案（不依赖第三方库）
   * 适用于现代浏览器或 Node.js 14.17+
   */
  static fastUuid32(): string {
    // 使用 Web Crypto API 生成随机值
    return crypto.randomUUID().replace(/-/g, "");
  }
}
