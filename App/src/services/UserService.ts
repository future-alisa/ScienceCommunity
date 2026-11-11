import { api, userApi, ApiError } from "@/services/ApiService";
import constants from "@/config/Constants";
import { User } from "@/model/User";

const UserService = {
  getUserProfile: async (username: string) => {
    const token = api.getToken();
    if (token && !token.includes(".")) return api.get("/auth/profile");
    const result = await userApi.get(constants.API_USER_PROFILE, {
      username: username,
    });
    console.log("Fetched user profile:", result);
    return result;
  },
  login: async ({ username, password }: User) => {
    if (!username.trim() || !password.trim()) throw new Error("请输入用户名和密码");
    let result: string;
    try {
      result = await userApi.post<string>(
      constants.API_USER_LOGIN,
      { username: username.trim(), password },
      {},
      true
    );
    } catch (error) {
      if (error instanceof ApiError && error.status >= 500) {
        throw new ApiError("用户服务暂时不可用，请稍后重试。", error.status);
      }
      throw error;
    }
    if (typeof result !== "string" || !result.trim()) throw new Error("用户名或密码错误");
    api.setToken(result);
    return result;
  },
  logout: async () => {
    const result = await userApi.post(constants.API_USER_LOGOUT);
    console.log("Logout result:", result);
    return result;
  },
  signup: async ({ username, password, email }: User) => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      throw new Error("请填写用户名、邮箱和密码");
    }
    const result = await userApi.post<boolean>(
      constants.API_USER_SIGNUP,
      { username: username.trim(), password, email: email.trim() },
      {},
      true
    );
    console.log("Signup result:", result);
    return result;
  },
};

export default UserService;
