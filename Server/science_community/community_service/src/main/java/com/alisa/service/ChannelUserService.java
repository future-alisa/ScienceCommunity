package com.alisa.service;

import com.alisa.model.ChannelUser;
import java.util.List;

public interface ChannelUserService {
    List<ChannelUser> getAll();
    ChannelUser getById(String id);
    void create(ChannelUser model);
    void update(ChannelUser model);
    void delete(String id);
    void upsert(ChannelUser model);
    void batchUpsert(List<ChannelUser> list);
    void batchDelete(List<String> ids);
}