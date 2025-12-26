import { api } from "@/services/ApiService";
const CommunityService = {
  getCommunities() {
    console.log("Fetching all communities");
    return api.get("/communities");
  },
  getCommunityById(id: string) {
    console.log(`Fetching community with ID: ${id}`);
    return api.get(`/communities/${id}`);
  },
  createCommunity(data: any) {
    console.log("Creating a new community with data:", data);
    return api.post<boolean>("/communities", data);
  },
  updateCommunity(id: string, data: any) {
    console.log(`Updating community with ID: ${id} with data:`, data);
    return api.put(`/communities/${id}`, data);
  },
  deleteCommunity(id: string) {
    console.log(`Deleting community with ID: ${id}`);
    return api.delete(`/communities/${id}`);
  },
};

export default CommunityService;
