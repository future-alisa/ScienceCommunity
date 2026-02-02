package com.alisa.service;

import com.alisa.model.Basis;
import java.util.List;

public interface BasisService {
    List<Basis> getAll();
    Basis getById(String id);
    int create(Basis model);
    int update(Basis model);
    int delete(String id);
    int upsert(Basis model);
    int batchUpsert(List<Basis> list);
    int batchDelete(List<String> ids);
}