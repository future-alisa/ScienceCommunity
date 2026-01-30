package com.alisa.service;

import com.alisa.model.Case;
import java.util.List;

public interface CaseService {
    List<Case> getAll();
    Case getById(String id);
    void create(Case model);
    void update(Case model);
    void delete(String id);
    void upsert(Case model);
    void batchUpsert(List<Case> list);
    void batchDelete(List<String> ids);
}