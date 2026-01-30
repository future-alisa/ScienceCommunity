package com.alisa.service;

import com.alisa.model.Tag;
import java.util.List;

public interface TagService {
    List<Tag> getAll();
    Tag getById(String id);
    void create(Tag model);
    void update(Tag model);
    void delete(String id);
    void upsert(Tag model);
    void batchUpsert(List<Tag> list);
    void batchDelete(List<String> ids);
}