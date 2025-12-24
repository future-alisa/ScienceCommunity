import { api } from "@/services/ApiService";
import constants from "@/config/Constants";
import { log } from "console";

const UserService = {
  getUserProfile: async (username: string) => {
    const result = await api.get(`/users/${username}/profile`);
    return result;
  },
  login: async (username: string, password: string) => {
    const result = await api.post<string>(
      constants.API_USER_LOGIN,
      { username, password },
      {},
      true
    );
    return result;
  },
  logout: async () => {
    const result = await api.post(constants.API_USER_LOGOUT);
    return result;
  },
};

export default UserService;
