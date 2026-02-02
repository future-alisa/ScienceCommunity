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
    public int create(Case model) {
        return caseMapper.insert(model);
    }

    @Override
    public int update(Case model) {
        return caseMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return caseMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Case model) {
        return caseMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Case> list) {
        return caseMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return caseMapper.batchDelete(ids);
    }
}