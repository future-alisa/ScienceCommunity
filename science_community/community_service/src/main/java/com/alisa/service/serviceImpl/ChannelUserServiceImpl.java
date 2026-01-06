package com.alisa.service.serviceImpl;

import com.alisa.mapper.ChannelUserMapper;
import com.alisa.model.ChannelUser;
import com.alisa.service.ChannelUserService;
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
    public ChannelUser getById(String id) {
        return channeluserMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(ChannelUser model) {
        channeluserMapper.insert(model);
    }

    @Override
    public void update(ChannelUser model) {
        channeluserMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        channeluserMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(ChannelUser model) {
        channeluserMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<ChannelUser> list) {
        channeluserMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        channeluserMapper.batchDelete(ids);
    }
}