package com.alisa.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alisa.dto.Criteria;
import com.alisa.dto.DocumentFilter;
import com.alisa.mapper.DocumentMapper;
import com.alisa.model.Document;
import com.alisa.service.DocumentService;

@Service
public class DocumentServiceImpl implements DocumentService {
    @Autowired
    private DocumentMapper documentMapper;

    @Override
    public boolean Save(Document document) {
        boolean res = documentMapper.insert(document) > 0 ? true : false;
        return res;
    }

    @Override
    public boolean Delete(String id) {
        boolean res = documentMapper.deleteByPrimaryKey(id) > 0 ? true : false;
        return res;
    }

    @Override
    public List<Document> Get(String type) {
        DocumentFilter filter = new DocumentFilter();
        Criteria c = new Criteria();
        c.addCondition("document_category_id =", type);
        filter.or(c);
        return documentMapper.selectByExample(filter);
    }

    @Override
    public Document GetById(String id) {
        return documentMapper.selectByPrimaryKey(id);
    }

}
