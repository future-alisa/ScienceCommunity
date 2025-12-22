package com.alisa.service;

import com.alisa.model.Document;
import java.util.List;

public interface DocumentService {
    List<Document> getAll();
    Document getById(String id);
    void create(Document model);
    void update(Document model);
    void delete(String id);
    void upsert(Document model);
    void batchUpsert(List<Document> list);
    void batchDelete(List<String> ids);
}