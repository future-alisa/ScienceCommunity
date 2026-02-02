package com.alisa.service;

import com.alisa.model.Tag;
import java.util.List;

public interface TagService {
    List<Tag> getAll();
    Tag getById(String id);
    int create(Tag model);
    int update(Tag model);
    int delete(String id);
    int upsert(Tag model);
    int batchUpsert(List<Tag> list);
    int batchDelete(List<String> ids);
}