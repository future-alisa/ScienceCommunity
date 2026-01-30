package com.alisa.service;

import com.alisa.model.Message;
import java.util.List;

public interface MessageService {
    List<Message> getAll();
    Message getById(String id);
    void create(Message model);
    void update(Message model);
    void delete(String id);
    void upsert(Message model);
    void batchUpsert(List<Message> list);
    void batchDelete(List<String> ids);
}