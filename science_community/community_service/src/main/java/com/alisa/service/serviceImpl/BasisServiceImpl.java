package com.alisa.service.serviceImpl;

import com.alisa.mapper.BasisMapper;
import com.alisa.model.Basis;
import com.alisa.service.BasisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BasisServiceImpl implements BasisService {

    @Autowired
    private BasisMapper basisMapper;

    @Override
    public List<Basis> getAll() {
        return basisMapper.selectByExample(null);
    }

    @Override
    public Basis getById(String id) {
        return basisMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Basis model) {
        return basisMapper.insert(model);
    }

    @Override
    public int update(Basis model) {
        return basisMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return basisMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Basis model) {
        return basisMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Basis> list) {
        return basisMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return basisMapper.batchDelete(ids);
    }
}