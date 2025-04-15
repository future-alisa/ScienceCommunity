package com.alisa.service;

import java.util.List;

import com.alisa.model.Community;
import com.alisa.model.CommunityUser;

public interface CommunityService {
    boolean Create(Community community);

    boolean Create(CommunityUser cu);

    boolean Delete(String id);

    List<Community> Get();

    List<Community> Get(String userId);
}
