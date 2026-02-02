package com.alisa.service.serviceImpl;

import com.alisa.mapper.TagCommunityMapper;
import com.alisa.model.TagCommunity;
import com.alisa.service.TagCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagCommunityServiceImpl implements TagCommunityService {

    @Autowired
    private TagCommunityMapper tagcommunityMapper;

    @Override
    public List<TagCommunity> getAll() {
        return tagcommunityMapper.selectByExample(null);
    }

    @Override
    public TagCommunity getById(String id) {
        return tagcommunityMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(TagCommunity model) {
        return tagcommunityMapper.insert(model);
    }

    @Override
    public int update(TagCommunity model) {
        return tagcommunityMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return tagcommunityMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(TagCommunity model) {
        return tagcommunityMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<TagCommunity> list) {
        return tagcommunityMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return tagcommunityMapper.batchDelete(ids);
    }
}