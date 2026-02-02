package com.alisa.service;

import com.alisa.model.CommunityUser;
import java.util.List;

public interface CommunityUserService {
    List<CommunityUser> getAll();
    CommunityUser getById(String id);
    int create(CommunityUser model);
    int update(CommunityUser model);
    int delete(String id);
    int upsert(CommunityUser model);
    int batchUpsert(List<CommunityUser> list);
    int batchDelete(List<String> ids);
}