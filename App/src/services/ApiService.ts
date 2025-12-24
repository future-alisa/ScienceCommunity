import { ApiResponse } from "@/types/Api";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface RequestOptions<T = any> {
  url: string;
  method?: RequestMethod;
  data?: T;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  noAuth?: boolean; // 可选：是否跳过自动添加token
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || "/api";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  // 设置/更新token
  public setToken(token: string | null): void {
    this.token = token;

    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  // 获取当前token
  public getToken(): string | null {
    return this.token || localStorage.getItem("auth_token");
  }

  private async request<T = any, R = any>(
    options: RequestOptions<T>
  ): Promise<R> {
    const {
      url,
      method = "GET",
      data,
      headers = {},
      params,
      noAuth = false,
    } = options;

    // 处理查询参数
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";

    const fullUrl = `${this.baseUrl}${url}${queryString}`;

    // 修复：明确声明headers类型
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };

    // 只在有token且不需要跳过认证时添加Authorization头
    if (!noAuth && this.getToken()) {
      requestHeaders["Authorization"] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders, // 使用修复后的headers
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result && typeof result === "object" && "code" in result) {
        const { code, message, data } = result as ApiResponse<R>;

        if (code === 200) {
          return data;
        } else {
          // 在这里可以调用全局 UI 组件弹出错误消息
          // Toast.error(message);
          throw new Error(message || "Business Error");
        }
      }

      return result as R;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // 保持原有方法不变，但添加noAuth选项
  public async get<T = any, R = any>(
    url: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<T, R>({ url, method: "GET", params, headers, noAuth });
  }

  public async post<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<T, R>({ url, method: "POST", data, headers, noAuth });
  }

  public async put<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<T, R>({ url, method: "PUT", data, headers, noAuth });
  }

  public async delete<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<T, R>({ url, method: "DELETE", data, headers, noAuth });
  }

  public async patch<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<T, R>({ url, method: "PATCH", data, headers, noAuth });
  }
}

// 默认导出一个实例
export const api = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// 可选：初始化时从存储中加载token
const savedToken =
  typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
if (savedToken) {
  api.setToken(savedToken);
}
