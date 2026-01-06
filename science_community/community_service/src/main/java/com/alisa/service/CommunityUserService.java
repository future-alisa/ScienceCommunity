package com.alisa.service;

import com.alisa.model.CommunityUser;
import java.util.List;

public interface CommunityUserService {
    List<CommunityUser> getAll();
    CommunityUser getById(String id);
    void create(CommunityUser model);
    void update(CommunityUser model);
    void delete(String id);
    void upsert(CommunityUser model);
    void batchUpsert(List<CommunityUser> list);
    void batchDelete(List<String> ids);
}