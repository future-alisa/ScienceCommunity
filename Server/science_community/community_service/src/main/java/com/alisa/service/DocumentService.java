package com.alisa.service;

import java.util.List;

import com.alisa.model.Document;

public interface DocumentService {
    boolean Save(Document document);

    boolean Delete(String id);

    List<Document> Get(String type);

    Document GetById(String id);
}
