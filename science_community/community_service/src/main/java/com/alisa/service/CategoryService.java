package com.alisa.service;

import com.alisa.model.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getAll();
    Category getById(String id);
    void create(Category model);
    void update(Category model);
    void delete(String id);
    void upsert(Category model);
    void batchUpsert(List<Category> list);
    void batchDelete(List<String> ids);
}