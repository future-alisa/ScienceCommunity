package com.alisa.service;

import com.alisa.model.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> getAll();
    Comment getById(String id);
    void create(Comment model);
    void update(Comment model);
    void delete(String id);
    void upsert(Comment model);
    void batchUpsert(List<Comment> list);
    void batchDelete(List<String> ids);
}