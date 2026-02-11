package com.alisa.vo;

import lombok.Data;

@Data
public class ChannelUserVo {
    private String id;
    private String roleId;
    private String channelId;
    private String name;
    private String email;
    private String role;
}
