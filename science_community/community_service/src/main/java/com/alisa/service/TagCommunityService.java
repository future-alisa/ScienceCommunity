package com.alisa.service;

import com.alisa.model.TagCommunity;
import java.util.List;

public interface TagCommunityService {
    List<TagCommunity> getAll();
    TagCommunity getById(String id);
    int create(TagCommunity model);
    int update(TagCommunity model);
    int delete(String id);
    int upsert(TagCommunity model);
    int batchUpsert(List<TagCommunity> list);
    int batchDelete(List<String> ids);
}