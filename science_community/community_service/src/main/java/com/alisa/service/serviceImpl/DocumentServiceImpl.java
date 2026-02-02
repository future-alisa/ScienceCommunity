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
    public int create(Document model) {
        return documentMapper.insert(model);
    }

    @Override
    public int update(Document model) {
        return documentMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return documentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Document model) {
        return documentMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Document> list) {
        return documentMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return documentMapper.batchDelete(ids);
    }
}