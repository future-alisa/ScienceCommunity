package com.alisa.service.serviceImpl;

import com.alisa.mapper.TagMapper;
import com.alisa.model.Tag;
import com.alisa.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagServiceImpl implements TagService {

    @Autowired
    private TagMapper tagMapper;

    @Override
    public List<Tag> getAll() {
        return tagMapper.selectByExample(null);
    }

    @Override
    public Tag getById(String id) {
        return tagMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Tag model) {
        return tagMapper.insert(model);
    }

    @Override
    public int update(Tag model) {
        return tagMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return tagMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Tag model) {
        return tagMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Tag> list) {
        return tagMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return tagMapper.batchDelete(ids);
    }
}