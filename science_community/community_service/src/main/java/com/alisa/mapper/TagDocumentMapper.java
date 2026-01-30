package com.alisa.mapper;

import com.alisa.dto.TagDocumentFilter;
import com.alisa.model.TagDocument;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TagDocumentMapper {
    long countByExample(TagDocumentFilter example);

    int deleteByExample(TagDocumentFilter example);

    int deleteByPrimaryKey(String tagDocumentId);

    int insert(TagDocument row);

    int insertSelective(TagDocument row);

    List<TagDocument> selectByExample(TagDocumentFilter example);

    TagDocument selectByPrimaryKey(String tagDocumentId);

    int updateByExampleSelective(@Param("row") TagDocument row, @Param("example") TagDocumentFilter example);

    int updateByExample(@Param("row") TagDocument row, @Param("example") TagDocumentFilter example);

    int updateByPrimaryKeySelective(TagDocument row);

    int updateByPrimaryKey(TagDocument row);

    int upsert(TagDocument record);

    int batchUpsert(@Param("list") List<TagDocument> list);

    int batchDelete(@Param("list") List<String> list);
}