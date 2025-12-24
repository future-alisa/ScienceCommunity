import { api } from "@/services/ApiService";
import constants from "@/config/Constants";
import { log } from "console";

const UserService = {
  getUserProfile: async (username: string) => {
    const response = await api.get(`/users/${username}/profile`);
    return response.data;
  },
  login: async (username: string, password: string) => {
    const response = await api.post(
      constants.API_USER_LOGIN,
      { username, password },
      {},
      true
    );
    return response.data;
  },
  logout: async () => {
    const response = await api.post(constants.API_USER_LOGOUT);
    return response.data;
  },
};

export default UserService;
