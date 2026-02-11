package com.alisa.controller;

import com.alisa.model.Channel;
import com.alisa.service.ChannelService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channel")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @GetMapping("/getAll")
    public Result<List<Channel>> getAll() {
        var data = channelService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/getAllByCommunityId")
    public Result<List<Channel>> getAllByCommunityId(String communityId) {
        var data = channelService.getAllByCommunityId(communityId);
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Channel> getById(@PathVariable String id) {
        var data = channelService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Channel channel) {
        var count = channelService.upsert(channel);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Channel> list) {
        var count = channelService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = channelService.batchDelete(ids);
        return new Result<>(count);
    }
}