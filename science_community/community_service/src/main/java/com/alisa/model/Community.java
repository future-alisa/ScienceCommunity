package com.alisa.model;

public class Community {
    private String communityId;

    private String communityName;

    private String communityDescription;

    private String communityUrl;

    private String communityImageUrl;

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }

    public String getCommunityName() {
        return communityName;
    }

    public void setCommunityName(String communityName) {
        this.communityName = communityName;
    }

    public String getCommunityDescription() {
        return communityDescription;
    }

    public void setCommunityDescription(String communityDescription) {
        this.communityDescription = communityDescription;
    }

    public String getCommunityUrl() {
        return communityUrl;
    }

    public void setCommunityUrl(String communityUrl) {
        this.communityUrl = communityUrl;
    }

    public String getCommunityImageUrl() {
        return communityImageUrl;
    }

    public void setCommunityImageUrl(String communityImageUrl) {
        this.communityImageUrl = communityImageUrl;
    }
}