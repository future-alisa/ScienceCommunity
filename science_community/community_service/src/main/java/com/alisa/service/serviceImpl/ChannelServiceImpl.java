package com.alisa.service.serviceImpl;

import com.alisa.dto.ChannelFilter;
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
    public List<Channel> getAllByCommunityId(String communityId) {
        ChannelFilter filter = new ChannelFilter();
        filter.createCriteria().andChannelCommunityIdEqualTo(communityId);
        return channelMapper.selectByExample(filter);
    }

    @Override
    public Channel getById(String id) {
        return channelMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Channel model) {
        return channelMapper.insert(model);
    }

    @Override
    public int update(Channel model) {
        return channelMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return channelMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int upsert(Channel model) {
        return channelMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Channel> list) {
        return channelMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return channelMapper.batchDelete(ids);
    }
}