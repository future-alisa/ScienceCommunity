package com.alisa.controller;

import com.alisa.model.ChannelUser;
import com.alisa.service.ChannelUserService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/channeluser")
public class ChannelUserController {

    @Autowired
    private ChannelUserService channeluserService;

    @GetMapping("/getAll")
    public Result<List<ChannelUser>> getAll() {
        var data = channeluserService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<ChannelUser> getById(@PathVariable String id) {
        var data = channeluserService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody ChannelUser channeluser) {
        var count = channeluserService.upsert(channeluser);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<ChannelUser> list) {
        var count = channeluserService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = channeluserService.batchDelete(ids);
        return new Result<>(count);
    }
}