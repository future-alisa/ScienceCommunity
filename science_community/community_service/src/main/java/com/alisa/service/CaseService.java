package com.alisa.service;

import com.alisa.model.Case;
import java.util.List;

public interface CaseService {
    List<Case> getAll();
    Case getById(String id);
    int create(Case model);
    int update(Case model);
    int delete(String id);
    int upsert(Case model);
    int batchUpsert(List<Case> list);
    int batchDelete(List<String> ids);
}