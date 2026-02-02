package com.alisa.service.serviceImpl;

import com.alisa.mapper.CommentMapper;
import com.alisa.model.Comment;
import com.alisa.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentMapper commentMapper;

    @Override
    public List<Comment> getAll() {
        return commentMapper.selectByExample(null);
    }

    @Override
    public Comment getById(String id) {
        return commentMapper.selectByPrimaryKey(id);
    }

    @Override
    public int create(Comment model) {
        return commentMapper.insert(model);
    }

    @Override
    public int update(Comment model) {
        return commentMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return commentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Comment model) {
        return commentMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Comment> list) {
        return commentMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return commentMapper.batchDelete(ids);
    }
}