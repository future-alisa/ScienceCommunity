package com.alisa.service;

import com.alisa.model.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAll();
    Category getById(String id);
    int create(Category model);
    int update(Category model);
    int delete(String id);
    int upsert(Category model);
    int batchUpsert(List<Category> list);
    int batchDelete(List<String> ids);
}