import { UserContextType } from "@/context/UserContext";

const TOKEN_KEY = "auth_token";
const USERNAME_KEY = "username";
const USEREMAIL_KEY = "user_emali";

export const StorageService = {
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  getUsername: () =>
    typeof window !== "undefined" ? localStorage.getItem(USERNAME_KEY) : null,
  getUserEmail: () =>
    typeof window !== "undefined" ? localStorage.getItem(USEREMAIL_KEY) : null,

  saveAuth: (token: string, username: string, email: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(USEREMAIL_KEY, email);
    console.log("保存用户信息到本地存储", { token, username, email });
  },

  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(USEREMAIL_KEY);
    console.log("清除用户信息");
  },

  getDefaultUser: (): UserContextType => {
    // 1. 检查是否在浏览器环境
    if (typeof window === "undefined") {
      return {
        name: "",
        token: "",
        state: "Offline",
        email: "",
        communityId: "",
      };
    }

    const token = localStorage.getItem(TOKEN_KEY) || "";
    const username = localStorage.getItem(USERNAME_KEY) || "";
    const email = localStorage.getItem(USEREMAIL_KEY) || "";
    console.log("读取本地存储的用户信息", { token, username, email });

    if (token) {
      return {
        name: username,
        token: token,
        state: "Online",
        email: email,
        communityId: "",
      };
    }
    return {
      name: "",
      token: "",
      state: "Offline",
      email: "",
      communityId: "",
    };
  },

  hasAuth: () => !!StorageService.getToken(),
};
