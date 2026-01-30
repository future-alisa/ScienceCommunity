package com.alisa.mapper;

import com.alisa.dto.PostFilter;
import com.alisa.model.Post;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PostMapper {
    long countByExample(PostFilter example);

    int deleteByExample(PostFilter example);

    int deleteByPrimaryKey(String postId);

    int insert(Post row);

    int insertSelective(Post row);

    List<Post> selectByExample(PostFilter example);

    Post selectByPrimaryKey(String postId);

    int updateByExampleSelective(@Param("row") Post row, @Param("example") PostFilter example);

    int updateByExample(@Param("row") Post row, @Param("example") PostFilter example);

    int updateByPrimaryKeySelective(Post row);

    int updateByPrimaryKey(Post row);

    int upsert(Post record);

    int batchUpsert(@Param("list") List<Post> list);

    int batchDelete(@Param("list") List<String> list);
}