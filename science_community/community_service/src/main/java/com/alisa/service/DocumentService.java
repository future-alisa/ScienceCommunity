package com.alisa.service;

import com.alisa.model.Document;
import java.util.List;

public interface DocumentService {
    List<Document> getAll();
    Document getById(String id);
    int create(Document model);
    int update(Document model);
    int delete(String id);
    int upsert(Document model);
    int batchUpsert(List<Document> list);
    int batchDelete(List<String> ids);
}