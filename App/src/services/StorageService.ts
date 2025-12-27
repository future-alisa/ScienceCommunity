import { UserContextType } from "@/context/UserContext";

const TOKEN_KEY = "auth_token";
const USERNAME_KEY = "username";

export const StorageService = {
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  getUsername: () =>
    typeof window !== "undefined" ? localStorage.getItem(USERNAME_KEY) : null,

  saveAuth: (token: string, username: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    console.log("保存用户信息到本地存储", { token, username });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    console.log("清除用户信息到本地存储");
  },

  getDefaultUser: (): UserContextType => {
    // 1. 检查是否在浏览器环境
    if (typeof window === "undefined") {
      return { name: "", token: "", state: "Offline" };
    }

    const token = localStorage.getItem("auth_token") || "";
    const username = localStorage.getItem("username") || "";
    console.log("读取本地存储的用户信息", { token, username });

    if (token) {
      return { name: username, token: token, state: "Online" };
    }
    return { name: "", token: "", state: "Offline" };
  },

  hasAuth: () => !!StorageService.getToken(),
};
