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
  userId: string;
  id: string;
  roleId: string;
  communityId: string;
  name: string;
  email: string;
  role: string;
}
