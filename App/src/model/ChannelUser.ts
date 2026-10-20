export interface ChannelUser {
  /**
   * []
   */
  channelUserId: string;
  /**
   * []
   */
  channelId: string;
  /**
   * []
   */
  communityUserId: string;
}

export interface ChannelUserVo {
  communityUserId: string;
  id: string;
  channelId: string;
  roleId: string;
  name: string;
  email: string;
  role: string;
}
