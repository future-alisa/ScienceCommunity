import { api, userApi } from "@/services/ApiService";
import constants from "@/config/Constants";
import { User } from "@/model/User";

const UserService = {
  getUserProfile: async (username: string) => {
    const result = await userApi.get(`/users/${username}/profile`);
    console.log("Fetched user profile:", result);
    return result;
  },
  login: async ({ username, password }: User) => {
    const result = await userApi.post<string>(
      constants.API_USER_LOGIN,
      { username, password },
      {},
      true
    );
    console.log("Login result:", result);
    api.setToken(result);
    return result;
  },
  logout: async () => {
    const result = await userApi.post(constants.API_USER_LOGOUT);
    console.log("Logout result:", result);
    return result;
  },
  signup: async ({ username, password }: User) => {
    const result = await userApi.post<boolean>(
      constants.API_USER_SIGNUP,
      { username, password },
      {},
      true
    );
    console.log("Signup result:", result);
    return result;
  },
};

export default UserService;
