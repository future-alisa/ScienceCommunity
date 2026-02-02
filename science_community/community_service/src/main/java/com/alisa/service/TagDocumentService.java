package com.alisa.service;

import com.alisa.model.TagDocument;
import java.util.List;

public interface TagDocumentService {
    List<TagDocument> getAll();
    TagDocument getById(String id);
    int create(TagDocument model);
    int update(TagDocument model);
    int delete(String id);
    int upsert(TagDocument model);
    int batchUpsert(List<TagDocument> list);
    int batchDelete(List<String> ids);
}