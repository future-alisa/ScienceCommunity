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
    public int create(Message model) {
        return messageMapper.insert(model);
    }

    @Override
    public int update(Message model) {
        return messageMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return messageMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Message model) {
        return messageMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Message> list) {
        return messageMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return messageMapper.batchDelete(ids);
    }
}