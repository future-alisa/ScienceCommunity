package com.alisa.mapper;

import com.alisa.dto.TagFilter;
import com.alisa.model.Tag;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TagMapper {
    long countByExample(TagFilter example);

    int deleteByExample(TagFilter example);

    int deleteByPrimaryKey(String tagId);

    int insert(Tag row);

    int insertSelective(Tag row);

    List<Tag> selectByExample(TagFilter example);

    Tag selectByPrimaryKey(String tagId);

    int updateByExampleSelective(@Param("row") Tag row, @Param("example") TagFilter example);

    int updateByExample(@Param("row") Tag row, @Param("example") TagFilter example);

    int updateByPrimaryKeySelective(Tag row);

    int updateByPrimaryKey(Tag row);

    int upsert(Tag record);

    int batchUpsert(@Param("list") List<Tag> list);

    int batchDelete(@Param("list") List<String> list);
}