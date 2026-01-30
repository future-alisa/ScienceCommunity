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
    public void create(Basis model) {
        basisMapper.insert(model);
    }

    @Override
    public void update(Basis model) {
        basisMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        basisMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Basis model) {
        basisMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Basis> list) {
        basisMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        basisMapper.batchDelete(ids);
    }
}