package com.alisa.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alisa.mapper.CommunityMapper;
import com.alisa.model.Community;
import com.alisa.service.CommunityService;

@Service
public class CommunityServiceImpl implements CommunityService {
    @Autowired
    private CommunityMapper communityMapper;

    public boolean Create(Community community) {
        boolean res = communityMapper.insert(community) > 0 ? true : false;
        return res;
    }

    public boolean Delete(String id) {
        boolean res = communityMapper.deleteByPrimaryKey(id) > 0 ? true : false;
        return res;
    }

}
