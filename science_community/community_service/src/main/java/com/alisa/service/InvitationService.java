package com.alisa.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alisa.enums.InvitationType;
import com.alisa.handler.InvitationHandler;
import com.alisa.model.Invitation;

@Service
public class InvitationService {
    private final Map<InvitationType, InvitationHandler> handlerMap;

    @Autowired
    public InvitationService(List<InvitationHandler> handlers) {
        this.handlerMap = handlers.stream()
                .collect(Collectors.toMap(InvitationHandler::getType, Function.identity()));
    }

    public Invitation processAccept(Invitation invitation) {

        InvitationHandler handler = handlerMap.get(InvitationType.of(invitation.getInviterCode()));

        if (handler != null) {
            handler.onAccept(invitation.getInvitee(),
                    invitation.getCommunityRole());
        }

        return invitation;
    }
}
