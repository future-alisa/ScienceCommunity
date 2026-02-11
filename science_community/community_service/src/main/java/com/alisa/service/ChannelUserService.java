package com.alisa.service;

import com.alisa.model.ChannelUser;
import com.alisa.vo.ChannelUserVo;

import java.util.List;

public interface ChannelUserService {
    List<ChannelUser> getAll();

    List<ChannelUserVo> getAllByChannelId(String channelId);

    ChannelUser getById(String id);

    int create(ChannelUser model);

    int update(ChannelUser model);

    int delete(String id);

    int upsert(ChannelUser model);

    int batchUpsert(List<ChannelUser> list);

    int batchDelete(List<String> ids);
}