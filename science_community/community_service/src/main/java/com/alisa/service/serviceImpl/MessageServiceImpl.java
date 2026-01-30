package com.alisa.service.serviceImpl;

import com.alisa.mapper.MessageMapper;
import com.alisa.model.Message;
import com.alisa.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageMapper messageMapper;

    @Override
    public List<Message> getAll() {
        return messageMapper.selectByExample(null);
    }

    @Override
    public Message getById(String id) {
        return messageMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Message model) {
        messageMapper.insert(model);
    }

    @Override
    public void update(Message model) {
        messageMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        messageMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Message model) {
        messageMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Message> list) {
        messageMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        messageMapper.batchDelete(ids);
    }
}