package com.alisa.mapper;

import com.alisa.dto.CaseFilter;
import com.alisa.model.Case;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CaseMapper {
    long countByExample(CaseFilter example);

    int deleteByExample(CaseFilter example);

    int deleteByPrimaryKey(String caseId);

    int insert(Case row);

    int insertSelective(Case row);

    List<Case> selectByExample(CaseFilter example);

    Case selectByPrimaryKey(String caseId);

    int updateByExampleSelective(@Param("row") Case row, @Param("example") CaseFilter example);

    int updateByExample(@Param("row") Case row, @Param("example") CaseFilter example);

    int updateByPrimaryKeySelective(Case row);

    int updateByPrimaryKey(Case row);

    int upsert(Case record);

    int batchUpsert(@Param("list") List<Case> list);

    int batchDelete(@Param("list") List<String> list);
}