import Constants from "@/config/Constants";
import { Channel } from "@/model/Channel";
import { Community } from "@/model/Community";
import { CommunityUserVo } from "@/model/CommunityUser";
import { api } from "@/services/ApiService";
const CommunityService = {
  getCommunities() {
    console.log("Fetching all communities");
    return api.get<Array<Community>>(Constants.API_COMMUNITY_GET_ALL);
  },
  getCommunitiesByUser() {
    console.log("Fetching all communities");
    return api.get<Array<Community>>(Constants.API_COMMUNITY_GET_ALL_BY_USER);
  },
  getCommunitiesWithTag(tagName: string) {
    console.log("Fetching all communities with tag: ", tagName);

    if (!tagName) {
      return api.get<Array<Community>>(Constants.API_COMMUNITY_GET_ALL);
    }
    return api.get<Array<Community>>(
      `${Constants.API_COMMUNITY_GET_ALL_BY_TAG}/${tagName}`
    );
  },
  getCommunityById(id: string) {
    console.log(`Fetching community with ID: ${id}`);
    return api.get<Community>(`${Constants.API_COMMUNITY_GET_ID}/${id}`);
  },
  getCommunityByTag(tag: string) {
    console.log(`Fetching community with tag: ${tag}`);
    return api.get(`/communities/${tag}`);
  },
  upsertCommunity(data: Community) {
    console.log("Creating a new community with data:", data);
    return api.post<boolean>(Constants.API_COMMUNITY_UPSERT, data);
  },

  deleteCommunity(id: string) {
    console.log(`Deleting community with ID: ${id}`);
    return api.delete(`/communities/${id}`);
  },
  getCommunityMembers(communityId: string) {
    console.log(`Get community members with ID: ${communityId}`);
    return api.get<CommunityUserVo[]>("/communityuser/getAllByCommunityId", {
      communityId: communityId,
    });
  },
  getCommunityChannels(communityId: string) {
    console.log(`Get community channels with ID: ${communityId}`);
    return api.get<Channel[]>("/channel/getAllByCommunityId", {
      communityId: communityId,
    });
  },
};

export default CommunityService;
