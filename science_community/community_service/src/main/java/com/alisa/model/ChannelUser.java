package com.alisa.model;

public class ChannelUser {
    private String channelUserId;

    private String channelId;

    private String communityUserId;

    public String getChannelUserId() {
        return channelUserId;
    }

    public void setChannelUserId(String channelUserId) {
        this.channelUserId = channelUserId;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getCommunityUserId() {
        return communityUserId;
    }

    public void setCommunityUserId(String communityUserId) {
        this.communityUserId = communityUserId;
    }
}