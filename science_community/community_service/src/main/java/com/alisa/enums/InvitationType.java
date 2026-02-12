package com.alisa.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum InvitationType {
    COMMUNITY("0001", "COMMUNITY", "社区"),
    CHANNEL("0002", "CHANNEL", "频道");

    private final String inviterCode;
    private final String inviterName;
    private final String inviterDescription;

    public static InvitationType of(String code) {
        for (InvitationType type : values()) {
            if (type.inviterCode.equalsIgnoreCase(code)) {
                return type;
            }
        }
        return null;
    }
}