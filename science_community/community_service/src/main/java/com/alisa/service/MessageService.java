package com.alisa.service;

import com.alisa.model.Message;
import java.util.List;

public interface MessageService {
    List<Message> getAll();
    Message getById(String id);
    int create(Message model);
    int update(Message model);
    int delete(String id);
    int upsert(Message model);
    int batchUpsert(List<Message> list);
    int batchDelete(List<String> ids);
}