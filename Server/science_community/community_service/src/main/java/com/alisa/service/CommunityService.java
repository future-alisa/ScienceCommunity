package com.alisa.service;

import com.alisa.model.Community;

public interface CommunityService {
    boolean Create(Community community);

    boolean Delete(String id);
}
