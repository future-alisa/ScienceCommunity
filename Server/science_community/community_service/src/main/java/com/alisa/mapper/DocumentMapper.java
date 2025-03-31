package com.alisa.mapper;

import com.alisa.model.Document;
import com.alisa.dto.DocumentFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DocumentMapper {
    long countByExample(DocumentFilter example);

    int deleteByExample(DocumentFilter example);

    int deleteByPrimaryKey(String documentId);

    int insert(Document record);

    int insertSelective(Document record);

    List<Document> selectByExampleWithBLOBs(DocumentFilter example);

    List<Document> selectByExample(DocumentFilter example);

    Document selectByPrimaryKey(String documentId);

    int updateByExampleSelective(@Param("record") Document record, @Param("example") DocumentFilter example);

    int updateByExampleWithBLOBs(@Param("record") Document record, @Param("example") DocumentFilter example);

    int updateByExample(@Param("record") Document record, @Param("example") DocumentFilter example);

    int updateByPrimaryKeySelective(Document record);

    int updateByPrimaryKeyWithBLOBs(Document record);

    int updateByPrimaryKey(Document record);
}