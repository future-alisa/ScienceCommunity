export interface Channel {
  /**
   * []
   */
  channelId: string;
  /**
   * []
   */
  channelName: string;
  /**
   * []
   */
  channelCommunityId: string;
  channelDescription?: string;
}

export interface ChannelAccess {
  userId: string;
  joined: boolean;
  canManage: boolean;
  memberCount: number;
}

export interface ChannelMessage {
  sequenceId: string;
  messageId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  clientMessageId: string;
  content: string;
  createdAt: string;
}

export interface ChannelHistory {
  messages: ChannelMessage[];
  hasMore: boolean;
}
