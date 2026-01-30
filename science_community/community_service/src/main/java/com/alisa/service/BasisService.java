package com.alisa.service;

import com.alisa.model.Basis;
import java.util.List;

public interface BasisService {
    List<Basis> getAll();
    Basis getById(String id);
    void create(Basis model);
    void update(Basis model);
    void delete(String id);
    void upsert(Basis model);
    void batchUpsert(List<Basis> list);
    void batchDelete(List<String> ids);
}