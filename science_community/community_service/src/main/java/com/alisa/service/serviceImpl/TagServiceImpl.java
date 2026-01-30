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
    public void create(Tag model) {
        tagMapper.insert(model);
    }

    @Override
    public void update(Tag model) {
        tagMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        tagMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Tag model) {
        tagMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Tag> list) {
        tagMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        tagMapper.batchDelete(ids);
    }
}