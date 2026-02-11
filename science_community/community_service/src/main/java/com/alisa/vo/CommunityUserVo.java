package com.alisa.vo;

import lombok.Data;

@Data
public class CommunityUserVo {
    private String id;
    private String roleId;
    private String communityId;
    private String name;
    private String email;
    private String role;
}
