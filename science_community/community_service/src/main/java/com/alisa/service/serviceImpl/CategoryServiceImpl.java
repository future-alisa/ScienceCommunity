package com.alisa.service.serviceImpl;

import com.alisa.mapper.CategoryMapper;
import com.alisa.model.Category;
import com.alisa.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    public List<Category> getAll() {
        return categoryMapper.selectByExample(null);
    }

    @Override
    public Category getById(String id) {
        return categoryMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Category model) {
        return categoryMapper.insert(model);
    }

    @Override
    public int update(Category model) {
        return categoryMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return categoryMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Category model) {
        return categoryMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Category> list) {
        return categoryMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return categoryMapper.batchDelete(ids);
    }
}