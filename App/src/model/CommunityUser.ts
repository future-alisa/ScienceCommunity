export interface CommunityUser {
  /**
   * []
   */
  communityUserId: string;
  /**
   * []
   */
  communityId: string;
  /**
   * []
   */
  userId: string;
}

export interface CommunityUserVo {
  id: string;
  roleId: string;
  communityId: string;
  name: string;
  email: string;
  role: string;
}
