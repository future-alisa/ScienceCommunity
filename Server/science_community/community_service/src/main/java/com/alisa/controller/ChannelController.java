package com.alisa.controller;

import com.alisa.model.Channel;
import com.alisa.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channel")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @GetMapping("/getAll")
    public List<Channel> getAll() {
        return channelService.getAll();
    }

    @GetMapping("/{id}")
    public Channel getById(@PathVariable String id) {
        return channelService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Channel channel) {
        channelService.upsert(channel);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Channel> list) {
        channelService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        channelService.batchDelete(ids);
    }
}