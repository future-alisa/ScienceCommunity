package com.alisa.service.serviceImpl;

import com.alisa.mapper.CommunityUserMapper;
import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityUserService;
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
    public CommunityUser getById(String id) {
        return communityuserMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(CommunityUser model) {
        communityuserMapper.insert(model);
    }

    @Override
    public void update(CommunityUser model) {
        communityuserMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        communityuserMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(CommunityUser model) {
        communityuserMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<CommunityUser> list) {
        communityuserMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        communityuserMapper.batchDelete(ids);
    }
}