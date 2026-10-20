import { Channel, ChannelAccess, ChannelHistory, ChannelMessage } from "@/model/Channel";
import { ChannelUserVo } from "@/model/ChannelUser";
import { api } from "./ApiService";

const path = (id: string) => `/channel/${encodeURIComponent(id)}`;
export const notifyChannelsChanged = (communityId: string) => window.dispatchEvent(new CustomEvent("channels-changed", { detail: communityId }));
const ChannelService = {
  getChannelById: (id: string) => api.get<Channel>(path(id)),
  getChannelMembers: (channelId: string) => api.get<ChannelUserVo[]>("/channeluser/getAllByChannelId", { channelId }),
  createChannel: (communityId: string, name: string, description: string) => api.post<Channel>("/channel/save", {
    channelId: "", channelCommunityId: communityId, channelName: name, channelDescription: description,
  }),
  saveChannel: (channel: Channel) => api.post<Channel>("/channel/save", channel),
  deleteChannel: (id: string) => api.delete<number>(path(id)),
  access: (id: string) => api.get<ChannelAccess>(`${path(id)}/access`),
  join: (id: string) => api.post<number>(`${path(id)}/join`),
  leave: (id: string) => api.post<number>(`${path(id)}/leave`),
  history: (id: string, cursor?: { before?: string; after?: string }) => api.get<ChannelHistory>(`${path(id)}/messages`, cursor),
  send: (id: string, content: string, clientMessageId: string) => api.post<ChannelMessage>(`${path(id)}/messages`, { content, clientMessageId }),
  addMemberToChannel: (channelId: string, communityUserId: string) => api.post<number>("/channeluser/upsert", { channelId, communityUserId }),
  removeMemberFromChannel: (_channelId: string, memberId: string) => api.delete<number>(`/channeluser/${encodeURIComponent(memberId)}`),
};
export default ChannelService;
