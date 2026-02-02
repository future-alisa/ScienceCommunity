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
    public int create(Community model) {
        return communityMapper.insert(model);
    }

    @Override
    public int update(Community model) {
        return communityMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return communityMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Community model) {
        return communityMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Community> list) {
        return communityMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return communityMapper.batchDelete(ids);
    }
}