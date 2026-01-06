package com.alisa.service.serviceImpl;

import com.alisa.mapper.DocumentMapper;
import com.alisa.model.Document;
import com.alisa.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentMapper documentMapper;

    @Override
    public List<Document> getAll() {
        return documentMapper.selectByExample(null);
    }

    @Override
    public Document getById(String id) {
        return documentMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Document model) {
        documentMapper.insert(model);
    }

    @Override
    public void update(Document model) {
        documentMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        documentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Document model) {
        documentMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Document> list) {
        documentMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        documentMapper.batchDelete(ids);
    }
}