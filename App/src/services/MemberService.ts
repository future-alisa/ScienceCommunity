import { api } from "./ApiService";
import { CommunityUserVo } from "@/model/CommunityUser";

export interface CommunityAccess {
  userId: string;
  membershipId: string;
  role: string;
}
export interface CommunityRole { id: string; name: string; }

const MemberService = {
  join: (communityId: string) => api.post<number>("/communityuser/join", { communityId }),
  access: (communityId: string) => api.get<CommunityAccess>("/communityuser/access", { communityId }),
  roles: () => api.get<CommunityRole[]>("/communityuser/roles"),
  add: (communityId: string, identity: string, roleId: string) => api.post<number>("/communityuser/add", { communityId, identity, roleId }),
  updateRole: (member: CommunityUserVo, roleId: string) => api.post<number>("/communityuser/upsert", {
    communityUserId: member.id, communityId: member.communityId, userId: member.userId, communityRoleId: roleId,
  }),
  remove: (id: string) => api.delete<number>(`/communityuser/${encodeURIComponent(id)}`),
  addToChannel: (channelId: string, communityUserId: string) => api.post<number>("/channeluser/upsert", { channelId, communityUserId }),
  removeFromChannel: (id: string) => api.delete<number>(`/channeluser/${encodeURIComponent(id)}`),
};
export default MemberService;
