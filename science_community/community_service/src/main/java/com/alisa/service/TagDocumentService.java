package com.alisa.service;

import com.alisa.model.TagDocument;
import java.util.List;

public interface TagDocumentService {
    List<TagDocument> getAll();
    TagDocument getById(String id);
    void create(TagDocument model);
    void update(TagDocument model);
    void delete(String id);
    void upsert(TagDocument model);
    void batchUpsert(List<TagDocument> list);
    void batchDelete(List<String> ids);
}