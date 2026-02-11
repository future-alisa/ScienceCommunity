package com.alisa.model;

public class Channel {
    private String channelId;

    private String channelCommunityId;

    private String channelName;

    private String channelDescription;

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getChannelCommunityId() {
        return channelCommunityId;
    }

    public void setChannelCommunityId(String channelCommunityId) {
        this.channelCommunityId = channelCommunityId;
    }

    public String getChannelName() {
        return channelName;
    }

    public void setChannelName(String channelName) {
        this.channelName = channelName;
    }

    public String getChannelDescription() {
        return channelDescription;
    }

    public void setChannelDescription(String channelDescription) {
        this.channelDescription = channelDescription;
    }
}