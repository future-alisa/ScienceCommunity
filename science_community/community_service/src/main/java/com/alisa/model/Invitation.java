package com.alisa.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Invitation {
    private String id;
    private String inviterCode;
    private String invitee;
    private Short status;
    private LocalDateTime expiredTime;
    private String communityRole;
}
