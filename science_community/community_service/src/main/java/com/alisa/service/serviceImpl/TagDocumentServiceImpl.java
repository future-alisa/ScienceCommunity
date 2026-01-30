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
    public void create(TagDocument model) {
        tagdocumentMapper.insert(model);
    }

    @Override
    public void update(TagDocument model) {
        tagdocumentMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        tagdocumentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(TagDocument model) {
        tagdocumentMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<TagDocument> list) {
        tagdocumentMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        tagdocumentMapper.batchDelete(ids);
    }
}