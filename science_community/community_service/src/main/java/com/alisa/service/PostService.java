package com.alisa.service;

import com.alisa.model.Post;
import java.util.List;

public interface PostService {
    List<Post> getAll();
    Post getById(String id);
    int create(Post model);
    int update(Post model);
    int delete(String id);
    int upsert(Post model);
    int batchUpsert(List<Post> list);
    int batchDelete(List<String> ids);
}