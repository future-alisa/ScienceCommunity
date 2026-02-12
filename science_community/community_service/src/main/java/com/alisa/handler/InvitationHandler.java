package com.alisa.handler;

import com.alisa.enums.InvitationType;

public interface InvitationHandler {
    InvitationType getType();

    void onAccept(String inviteeId, String role);
}
