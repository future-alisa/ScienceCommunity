package com.alisa.handler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.alisa.enums.InvitationType;
import com.alisa.service.CommunityUserService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CommunityInvitationHandler implements InvitationHandler {
    @Autowired
    private CommunityUserService communityUserService;

    @Override
    public InvitationType getType() {
        return InvitationType.COMMUNITY;
    }

    @Override
    public void onAccept(String inviteeId, String role) {
        log.info(" add user to community: ", inviteeId);
    }
}
