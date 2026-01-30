package com.alisa.service;

import com.alisa.model.Community;
import java.util.List;

public interface CommunityService {
    List<Community> getAll();
    Community getById(String id);
    void create(Community model);
    void update(Community model);
    void delete(String id);
    void upsert(Community model);
    void batchUpsert(List<Community> list);
    void batchDelete(List<String> ids);
}