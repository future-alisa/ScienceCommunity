package com.alisa.service;


import com.alisa.model.Document;

public interface DocumentService {
    boolean Save(Document document);

    boolean Delete(String id);
}
