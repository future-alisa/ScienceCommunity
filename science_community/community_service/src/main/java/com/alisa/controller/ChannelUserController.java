package com.alisa.controller;

import com.alisa.model.ChannelUser;
import com.alisa.service.ChannelUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channeluser")
public class ChannelUserController {

    @Autowired
    private ChannelUserService channeluserService;

    @GetMapping("/getAll")
    public List<ChannelUser> getAll() {
        return channeluserService.getAll();
    }

    @GetMapping("/{id}")
    public ChannelUser getById(@PathVariable String id) {
        return channeluserService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody ChannelUser channeluser) {
        channeluserService.upsert(channeluser);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<ChannelUser> list) {
        channeluserService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        channeluserService.batchDelete(ids);
    }
}