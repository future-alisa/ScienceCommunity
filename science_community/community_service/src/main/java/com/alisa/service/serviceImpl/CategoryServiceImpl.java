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
    public void create(Category model) {
        categoryMapper.insert(model);
    }

    @Override
    public void update(Category model) {
        categoryMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        categoryMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Category model) {
        categoryMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Category> list) {
        categoryMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        categoryMapper.batchDelete(ids);
    }
}