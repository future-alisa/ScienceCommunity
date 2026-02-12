package com.alisa.handler;

import org.springframework.stereotype.Component;

import com.alisa.enums.InvitationType;

@Component
public class ChannelInvitationHandler implements InvitationHandler {

    @Override
    public InvitationType getType() {
        return InvitationType.CHANNEL;
    }

    @Override
    public void onAccept(String inviteeId, String role) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'onAccept'");
    }

}
