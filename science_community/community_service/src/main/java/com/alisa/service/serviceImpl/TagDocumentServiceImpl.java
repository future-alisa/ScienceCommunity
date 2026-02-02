package com.alisa.service.serviceImpl;

import com.alisa.mapper.TagDocumentMapper;
import com.alisa.model.TagDocument;
import com.alisa.service.TagDocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagDocumentServiceImpl implements TagDocumentService {

    @Autowired
    private TagDocumentMapper tagdocumentMapper;

    @Override
    public List<TagDocument> getAll() {
        return tagdocumentMapper.selectByExample(null);
    }

    @Override
    public TagDocument getById(String id) {
        return tagdocumentMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(TagDocument model) {
        return tagdocumentMapper.insert(model);
    }

    @Override
    public int update(TagDocument model) {
        return tagdocumentMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return tagdocumentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(TagDocument model) {
        return tagdocumentMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<TagDocument> list) {
        return tagdocumentMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return tagdocumentMapper.batchDelete(ids);
    }
}