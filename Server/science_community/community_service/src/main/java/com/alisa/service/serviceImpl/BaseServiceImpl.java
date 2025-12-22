package com.alisa.service.serviceImpl;

import com.alisa.mapper.BaseMapper;
import com.alisa.model.Base;
import com.alisa.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BaseServiceImpl implements BaseService {

    @Autowired
    private BaseMapper baseMapper;

    @Override
    public List<Base> getAll() {
        return baseMapper.selectByExample(null);
    }

    @Override
    public Base getById(String id) {
        return baseMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Base model) {
        baseMapper.insert(model);
    }

    @Override
    public void update(Base model) {
        baseMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        baseMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Base model) {
        baseMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Base> list) {
        baseMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        baseMapper.batchDelete(ids);
    }
}