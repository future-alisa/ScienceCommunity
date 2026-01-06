package com.alisa.mapper;

import com.alisa.dto.DocumentFilter;
import com.alisa.model.Document;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DocumentMapper {
    long countByExample(DocumentFilter example);

    int deleteByExample(DocumentFilter example);

    int deleteByPrimaryKey(String documentId);

    int insert(Document row);

    int insertSelective(Document row);

    List<Document> selectByExampleWithBLOBs(DocumentFilter example);

    List<Document> selectByExample(DocumentFilter example);

    Document selectByPrimaryKey(String documentId);

    int updateByExampleSelective(@Param("row") Document row, @Param("example") DocumentFilter example);

    int updateByExampleWithBLOBs(@Param("row") Document row, @Param("example") DocumentFilter example);

    int updateByExample(@Param("row") Document row, @Param("example") DocumentFilter example);

    int updateByPrimaryKeySelective(Document row);

    int updateByPrimaryKeyWithBLOBs(Document row);

    int updateByPrimaryKey(Document row);

    int upsert(Document record);

    int batchUpsert(@Param("list") List<Document> list);

    int batchDelete(@Param("list") List<String> list);
}