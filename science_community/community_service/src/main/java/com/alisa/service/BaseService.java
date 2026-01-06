package com.alisa.service;

import com.alisa.model.Base;
import java.util.List;

public interface BaseService {
    List<Base> getAll();
    Base getById(String id);
    void create(Base model);
    void update(Base model);
    void delete(String id);
    void upsert(Base model);
    void batchUpsert(List<Base> list);
    void batchDelete(List<String> ids);
}