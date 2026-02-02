package com.alisa.service;

import com.alisa.model.Channel;
import java.util.List;

public interface ChannelService {
    List<Channel> getAll();
    Channel getById(String id);
    int create(Channel model);
    int update(Channel model);
    int delete(String id);
    int upsert(Channel model);
    int batchUpsert(List<Channel> list);
    int batchDelete(List<String> ids);
}