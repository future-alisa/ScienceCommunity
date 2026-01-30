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
    public void create(Comment model) {
        commentMapper.insert(model);
    }

    @Override
    public void update(Comment model) {
        commentMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        commentMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Comment model) {
        commentMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Comment> list) {
        commentMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        commentMapper.batchDelete(ids);
    }
}