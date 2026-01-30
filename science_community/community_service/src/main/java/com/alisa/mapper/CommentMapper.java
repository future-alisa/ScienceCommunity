package com.alisa.mapper;

import com.alisa.dto.CommentFilter;
import com.alisa.model.Comment;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentMapper {
    long countByExample(CommentFilter example);

    int deleteByExample(CommentFilter example);

    int deleteByPrimaryKey(String commentId);

    int insert(Comment row);

    int insertSelective(Comment row);

    List<Comment> selectByExample(CommentFilter example);

    Comment selectByPrimaryKey(String commentId);

    int updateByExampleSelective(@Param("row") Comment row, @Param("example") CommentFilter example);

    int updateByExample(@Param("row") Comment row, @Param("example") CommentFilter example);

    int updateByPrimaryKeySelective(Comment row);

    int updateByPrimaryKey(Comment row);

    int upsert(Comment record);

    int batchUpsert(@Param("list") List<Comment> list);

    int batchDelete(@Param("list") List<String> list);
}