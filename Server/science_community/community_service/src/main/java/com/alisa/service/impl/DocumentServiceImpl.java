package com.alisa.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

}
