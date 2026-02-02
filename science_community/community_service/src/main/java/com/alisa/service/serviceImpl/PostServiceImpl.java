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
    public int create(Post model) {
        return postMapper.insert(model);
    }

    @Override
    public int update(Post model) {
        return postMapper.updateByPrimaryKey(model);
    }

    @Override
    public int delete(String id) {
        return postMapper.deleteByPrimaryKey(id);
    }
    @Override
    public int upsert(Post model) {
        return postMapper.upsert(model);
    }

    @Override
    public int batchUpsert(List<Post> list) {
        return postMapper.batchUpsert(list);
    }

    @Override
    public int batchDelete(List<String> ids) {
        return postMapper.batchDelete(ids);
    }
}