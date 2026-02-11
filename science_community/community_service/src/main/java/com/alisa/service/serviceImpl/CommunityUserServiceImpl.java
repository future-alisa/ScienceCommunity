package com.alisa.service.serviceImpl;

import com.alisa.mapper.CommunityUserMapper;
import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityUserService;
import com.alisa.vo.CommunityUserVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunityUserServiceImpl implements CommunityUserService {

    @Autowired
    private CommunityUserMapper communityuserMapper;

    @Override
    public List<CommunityUser> getAll() {
        return communityuserMapper.selectByExample(null);
    }

    @Override
    public List<CommunityUserVo> getAllByCommunityId(String communityId) {
        return communityuserMapper.selectCommunityUser(communityId);
    }

    @Override
    public CommunityUser getById(String id) {
        return communityuserMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(CommunityUser model) {
        return communityuserMapper.insert(model);
    }

    @Override
    public int update(CommunityUser model) {
        return communityuserMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return communityuserMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int upsert(CommunityUser model) {
        return communityuserMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<CommunityUser> list) {
        return communityuserMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return communityuserMapper.batchDelete(ids);
    }
}