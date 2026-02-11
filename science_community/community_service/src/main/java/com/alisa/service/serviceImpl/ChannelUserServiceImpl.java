package com.alisa.service.serviceImpl;

import com.alisa.mapper.ChannelUserMapper;
import com.alisa.model.ChannelUser;
import com.alisa.service.ChannelUserService;
import com.alisa.vo.ChannelUserVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChannelUserServiceImpl implements ChannelUserService {

    @Autowired
    private ChannelUserMapper channeluserMapper;

    @Override
    public List<ChannelUser> getAll() {
        return channeluserMapper.selectByExample(null);
    }

    @Override
    public List<ChannelUserVo> getAllByChannelId(String channelId) {
        return channeluserMapper.selectByChannelId(channelId);
    }

    @Override
    public ChannelUser getById(String id) {
        return channeluserMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(ChannelUser model) {
        return channeluserMapper.insert(model);
    }

    @Override
    public int update(ChannelUser model) {
        return channeluserMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return channeluserMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int upsert(ChannelUser model) {
        return channeluserMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<ChannelUser> list) {
        return channeluserMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return channeluserMapper.batchDelete(ids);
    }
}