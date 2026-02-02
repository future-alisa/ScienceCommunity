package com.alisa.service;

import com.alisa.model.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> getAll();
    Comment getById(String id);
    int create(Comment model);
    int update(Comment model);
    int delete(String id);
    int upsert(Comment model);
    int batchUpsert(List<Comment> list);
    int batchDelete(List<String> ids);
}