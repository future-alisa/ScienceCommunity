package com.alisa.service.serviceImpl;

import com.alisa.mapper.PostMapper;
import com.alisa.model.Post;
import com.alisa.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostMapper postMapper;

    @Override
    public List<Post> getAll() {
        return postMapper.selectByExample(null);
    }

    @Override
    public Post getById(String id) {
        return postMapper.selectByPrimaryKey(id);
    }

    @Override
    public void create(Post model) {
        postMapper.insert(model);
    }

    @Override
    public void update(Post model) {
        postMapper.updateByPrimaryKey(model);
    }

    @Override
    public void delete(String id) {
        postMapper.deleteByPrimaryKey(id);
    }
    @Override
    public void upsert(Post model) {
        postMapper.upsert(model);
    }

    @Override
    public void batchUpsert(List<Post> list) {
        postMapper.batchUpsert(list);
    }

    @Override
    public void batchDelete(List<String> ids) {
        postMapper.batchDelete(ids);
    }
}