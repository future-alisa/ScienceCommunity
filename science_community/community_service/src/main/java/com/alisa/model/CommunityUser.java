package com.alisa.model;

public class CommunityUser {
    private String communityUserId;

    private String communityId;

    private String userId;

    private String communityRoleId;

    public String getCommunityUserId() {
        return communityUserId;
    }

    public void setCommunityUserId(String communityUserId) {
        this.communityUserId = communityUserId;
    }

    public String getCommunityId() {
        return communityId;
    }

    public void setCommunityId(String communityId) {
        this.communityId = communityId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCommunityRoleId() {
        return communityRoleId;
    }

    public void setCommunityRoleId(String communityRoleId) {
        this.communityRoleId = communityRoleId;
    }
}