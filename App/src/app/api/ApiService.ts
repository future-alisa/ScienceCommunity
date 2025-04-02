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
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || "/api";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  private async request<T = any, R = any>(
    options: RequestOptions<T>
  ): Promise<R> {
    const { url, method = "GET", data, headers = {}, params } = options;

    // 处理查询参数
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";

    const fullUrl = `${this.baseUrl}${url}${queryString}`;

    try {
      const response = await fetch(fullUrl, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return (await response.json()) as R;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  public async get<T = any, R = any>(
    url: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>
  ): Promise<R> {
    return this.request<T, R>({ url, method: "GET", params, headers });
  }

  public async post<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): Promise<R> {
    return this.request<T, R>({ url, method: "POST", data, headers });
  }

  public async put<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): Promise<R> {
    return this.request<T, R>({ url, method: "PUT", data, headers });
  }

  public async delete<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): Promise<R> {
    return this.request<T, R>({ url, method: "DELETE", data, headers });
  }

  public async patch<T = any, R = any>(
    url: string,
    data?: T,
    headers?: Record<string, string>
  ): Promise<R> {
    return this.request<T, R>({ url, method: "PATCH", data, headers });
  }
}

// 默认导出一个实例
export const api = new ApiService({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, // 从环境变量读取
});
