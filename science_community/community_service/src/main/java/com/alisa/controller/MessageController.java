package com.alisa.controller;

import com.alisa.model.Message;
import com.alisa.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/getAll")
    public List<Message> getAll() {
        return messageService.getAll();
    }

    @GetMapping("/{id}")
    public Message getById(@PathVariable String id) {
        return messageService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody Message message) {
        messageService.upsert(message);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<Message> list) {
        messageService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        messageService.batchDelete(ids);
    }
}