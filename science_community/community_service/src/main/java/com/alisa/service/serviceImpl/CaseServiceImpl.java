package com.alisa.service.serviceImpl;

import com.alisa.mapper.CaseMapper;
import com.alisa.model.Case;
import com.alisa.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CaseServiceImpl implements CaseService {

    @Autowired
    private CaseMapper caseMapper;

    @Override
    public List<Case> getAll() {
        return caseMapper.selectByExample(null);
    }

    @Override
    public Case getById(String id) {
        return caseMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Case model) {
        caseMapper.insert(model);
    }

    @Override
    public void update(Case model) {
        caseMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        caseMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Case model) {
        caseMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Case> list) {
        caseMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        caseMapper.batchDelete(ids);
    }
}