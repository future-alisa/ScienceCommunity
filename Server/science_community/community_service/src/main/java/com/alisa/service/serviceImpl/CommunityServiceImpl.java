package com.alisa.service.serviceImpl;

import com.alisa.mapper.CommunityMapper;
import com.alisa.model.Community;
import com.alisa.service.CommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityServiceImpl implements CommunityService {

    @Autowired
    private CommunityMapper communityMapper;

    @Override
    public List<Community> getAll() {
        return communityMapper.selectByExample(null);
    }

    @Override
    public Community getById(String id) {
        return communityMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Community model) {
        communityMapper.insert(model);
    }

    @Override
    public void update(Community model) {
        communityMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        communityMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Community model) {
        communityMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Community> list) {
        communityMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        communityMapper.batchDelete(ids);
    }
}