import { ApiResponse } from "@/model/ApiResponse";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  requiredBaseUrl?: boolean;
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions<T = any> {
  url: string;
  method?: RequestMethod;
  data?: T;
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  noAuth?: boolean;
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private token: string | null = null;
  private requiredBaseUrl: boolean;

  constructor(config: ApiConfig = {}) {
    this.requiredBaseUrl = config.requiredBaseUrl ?? false;
    this.baseUrl = (config.baseUrl || (this.requiredBaseUrl ? "" : "/api")).replace(/\/+$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof localStorage === "undefined") return;

    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  public getToken(): string | null {
    // Read the shared store first so logout/account switches affect every client.
    return typeof localStorage === "undefined" ? this.token : localStorage.getItem("auth_token");
  }

  private async request<R = any, T = any>(
    options: RequestOptions<T>
  ): Promise<R> {
    if (this.requiredBaseUrl && !this.baseUrl) {
      throw new Error("请配置 NEXT_PUBLIC_USER_API_BASE_URL 用户服务地址");
    }
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

    // 明确声明headers类型
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };
    const requestToken = noAuth ? null : this.getToken();
    if (requestToken) {
      requestHeaders["Authorization"] = `Bearer ${requestToken}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 401 && requestToken && this.getToken() === requestToken) {
          this.setToken(null);
        }
        const failure = await response.json().catch(() => null);
        throw new ApiError(failure?.message || `请求失败（${response.status}）`, response.status);
      }

      const result = await response.json();
      if (result && typeof result === "object" && "code" in result) {
        const { code, message, data } = result as ApiResponse<R>;
        if (code === 200) {
          return data;
        } else {
          throw new Error(message || "Business Error");
        }
      }

      return result as R;
    } catch (error) {
      if (controller.signal.aborted) throw new ApiError("请求超时，请重试", 408);
      console.error("API request failed:", error);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  public async get<R = any, T = any>(
    url: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<R, T>({ url, method: "GET", params, headers, noAuth });
  }

  public async post<R = any, T = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<R, T>({ url, method: "POST", data, headers, noAuth });
  }

  public async put<R = any, T = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<R, T>({ url, method: "PUT", data, headers, noAuth });
  }

  public async delete<R = any, T = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<R, T>({ url, method: "DELETE", data, headers, noAuth });
  }

  public async patch<R = any, T = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>,
    noAuth?: boolean
  ): Promise<R> {
    return this.request<R, T>({ url, method: "PATCH", data, headers, noAuth });
  }
}

export const api = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export const userApi = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_USER_API_BASE_URL,
  requiredBaseUrl: true,
});

const savedToken =
  typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
if (savedToken) {
  api.setToken(savedToken);
}
