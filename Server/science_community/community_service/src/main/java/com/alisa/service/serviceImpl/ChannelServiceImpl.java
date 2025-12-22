package com.alisa.service.serviceImpl;

import com.alisa.mapper.ChannelMapper;
import com.alisa.model.Channel;
import com.alisa.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelServiceImpl implements ChannelService {

    @Autowired
    private ChannelMapper channelMapper;

    @Override
    public List<Channel> getAll() {
        return channelMapper.selectByExample(null);
    }

    @Override
    public Channel getById(String id) {
        return channelMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Channel model) {
        channelMapper.insert(model);
    }

    @Override
    public void update(Channel model) {
        channelMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        channelMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Channel model) {
        channelMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Channel> list) {
        channelMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        channelMapper.batchDelete(ids);
    }
}