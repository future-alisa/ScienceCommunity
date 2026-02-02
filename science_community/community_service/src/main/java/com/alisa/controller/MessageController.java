package com.alisa.controller;

import com.alisa.model.Message;
import com.alisa.service.MessageService;
import com.alisa.util.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/getAll")
    public Result<List<Message>> getAll() {
        var data = messageService.getAll();
        return new Result<>(data);
    }

    @GetMapping("/{id}")
    public Result<Message> getById(@PathVariable String id) {
        var data = messageService.getById(id);
        return new Result<>(data);
    }

    @PostMapping("/upsert")
    public Result<Integer> upsert(@RequestBody Message message) {
        var count = messageService.upsert(message);
        return new Result<Integer>(count);
    }

    @PostMapping("/batch-upsert")
    public Result<Integer> batchUpsert(@RequestBody List<Message> list) {
        var count = messageService.batchUpsert(list);
        return new Result<>(count);
    }

    @DeleteMapping("/batch-delete")
    public Result<Integer> batchDelete(@RequestBody List<String> ids) {
        var count = messageService.batchDelete(ids);
        return new Result<>(count);
    }
}