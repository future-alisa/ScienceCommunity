import { ApiResponse } from "@/model/ApiResponse";

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
  noAuth?: boolean;
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

  public setToken(token: string | null): void {
    this.token = token;

    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem("auth_token");
  }

  private async request<R = any, T = any>(
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

    // 明确声明headers类型
    const requestHeaders: HeadersInit = {
      ...this.defaultHeaders,
      ...headers,
    };
    console.log("Request Headers:", this.getToken());
    if (!noAuth && this.getToken()) {
      requestHeaders["Authorization"] = `Bearer ${this.getToken()}`;
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: requestHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Response Body:", result);
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
      console.error("API request failed:", error);
      throw error;
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

const savedToken =
  typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
if (savedToken) {
  api.setToken(savedToken);
}
