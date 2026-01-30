package com.alisa.service;

import com.alisa.model.Post;
import java.util.List;

public interface PostService {
    List<Post> getAll();
    Post getById(String id);
    void create(Post model);
    void update(Post model);
    void delete(String id);
    void upsert(Post model);
    void batchUpsert(List<Post> list);
    void batchDelete(List<String> ids);
}