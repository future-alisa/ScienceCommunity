package com.alisa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alisa.model.Invitation;
import com.alisa.service.InvitationService;
import com.alisa.util.Result;

@RequestMapping("/invitation")
@RestController
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    @PostMapping("/community")
    public Result<Invitation> inviteJoinCommunity(@RequestBody Invitation invitation) {
        invitationService.processAccept(invitation);
        return new Result<Invitation>(invitation);
    }
}
