package com.alisa.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alisa.mapper.CommunityMapper;
import com.alisa.mapper.CommunityUserMapper;
import com.alisa.model.Community;
import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityService;

@Service
public class CommunityServiceImpl implements CommunityService {

    @Autowired
    private CommunityMapper communityMapper;
    @Autowired
    private CommunityUserMapper communityUserMapper;

    public boolean Create(Community community) {
        boolean res = communityMapper.insert(community) > 0 ? true : false;
        return res;
    }

    public boolean Create(CommunityUser cu) {
        boolean res = communityUserMapper.insert(cu) > 0 ? true : false;
        return res;
    }

    public boolean Delete(String id) {
        boolean res = communityMapper.deleteByPrimaryKey(id) > 0 ? true : false;
        return res;
    }

    @Override
    public List<Community> Get() {
        return communityMapper.selectByExample(null);
    }

    @Override
    public List<Community> Get(String userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'Get'");
    }

}
