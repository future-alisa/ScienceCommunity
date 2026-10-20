package com.alisa.controller;

import com.alisa.model.ChannelMessage;
import com.alisa.service.ChannelDiscussionService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/channel/{channelId}")
public class ChannelDiscussionController {
    @Autowired private ChannelDiscussionService discussion;
    public record SendMessage(String content, String clientMessageId) {}

    @GetMapping("/access")
    public Result<ChannelDiscussionService.ChannelAccess> access(@PathVariable String channelId) {
        return new Result<>(discussion.getAccess(channelId));
    }
    @PostMapping("/join")
    public Result<Integer> join(@PathVariable String channelId) { return new Result<>(discussion.join(channelId)); }
    @PostMapping("/leave")
    public Result<Integer> leave(@PathVariable String channelId) { return new Result<>(discussion.leave(channelId)); }
    @GetMapping("/messages")
    public Result<ChannelDiscussionService.History> history(@PathVariable String channelId,
        @RequestParam(required = false) Long before, @RequestParam(required = false) Long after) {
        return new Result<>(discussion.history(channelId, before, after));
    }
    @PostMapping("/messages")
    public Result<ChannelMessage> send(@PathVariable String channelId, @RequestBody SendMessage request) {
        return new Result<>(discussion.send(channelId, request.content(), request.clientMessageId()));
    }
}
