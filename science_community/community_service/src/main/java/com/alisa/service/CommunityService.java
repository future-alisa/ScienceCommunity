package com.alisa.service;

import com.alisa.model.Community;
import com.alisa.vo.CommunityVo;

import java.util.List;

public interface CommunityService {
    List<Community> getAll();

    Community getById(String id);

    int create(Community model);

    int update(Community model);

    int delete(String id);

    int upsert(Community model);

    int batchUpsert(List<Community> list);

    int batchDelete(List<String> ids);

    List<CommunityVo> getAllWithTag(String tagName);
}