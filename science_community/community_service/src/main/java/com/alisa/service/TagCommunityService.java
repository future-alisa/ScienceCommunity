package com.alisa.service;

import com.alisa.model.TagCommunity;
import java.util.List;

public interface TagCommunityService {
    List<TagCommunity> getAll();
    TagCommunity getById(String id);
    void create(TagCommunity model);
    void update(TagCommunity model);
    void delete(String id);
    void upsert(TagCommunity model);
    void batchUpsert(List<TagCommunity> list);
    void batchDelete(List<String> ids);
}