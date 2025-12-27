import Constants from "@/config/Constants";
import { Community } from "@/model/Community";
import { api } from "@/services/ApiService";
const CommunityService = {
  getCommunities() {
    console.log("Fetching all communities");
    return api.get<Array<Community>>(Constants.API_COMMUNITY_GET_ALL);
  },
  getCommunityById(id: string) {
    console.log(`Fetching community with ID: ${id}`);
    return api.get(`/communities/${id}`);
  },
  upsertCommunity(data: Community) {
    console.log("Creating a new community with data:", data);
    return api.post<boolean>(Constants.API_COMMUNITY_UPSERT, data);
  },

  deleteCommunity(id: string) {
    console.log(`Deleting community with ID: ${id}`);
    return api.delete(`/communities/${id}`);
  },
};

export default CommunityService;
