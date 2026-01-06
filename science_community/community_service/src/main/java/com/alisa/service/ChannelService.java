package com.alisa.service;

import com.alisa.model.Channel;
import java.util.List;

public interface ChannelService {
    List<Channel> getAll();
    Channel getById(String id);
    void create(Channel model);
    void update(Channel model);
    void delete(String id);
    void upsert(Channel model);
    void batchUpsert(List<Channel> list);
    void batchDelete(List<String> ids);
}