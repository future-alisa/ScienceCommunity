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
    public void create(TagCommunity model) {
        tagcommunityMapper.insert(model);
    }

    @Override
    public void update(TagCommunity model) {
        tagcommunityMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        tagcommunityMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(TagCommunity model) {
        tagcommunityMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<TagCommunity> list) {
        tagcommunityMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        tagcommunityMapper.batchDelete(ids);
    }
}