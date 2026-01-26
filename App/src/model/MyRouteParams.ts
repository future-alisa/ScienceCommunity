type CommunityRouteParams = {
  communityId: string;
  [key: string]: string | string[];
};

// 文档页面参数
export interface DocumentRouteParams extends CommunityRouteParams {
  postId: string;
}

// 频道页面参数
export interface ChannelRouteParams extends CommunityRouteParams {
  channelId: string;
}

export type { CommunityRouteParams };
