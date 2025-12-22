package com.alisa.mapper;

import com.alisa.dto.BaseFilter;
import com.alisa.model.Base;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BaseMapper {
    long countByExample(BaseFilter example);

    int deleteByExample(BaseFilter example);

    int deleteByPrimaryKey(String baseId);

    int insert(Base row);

    int insertSelective(Base row);

    List<Base> selectByExample(BaseFilter example);

    Base selectByPrimaryKey(String baseId);

    int updateByExampleSelective(@Param("row") Base row, @Param("example") BaseFilter example);

    int updateByExample(@Param("row") Base row, @Param("example") BaseFilter example);

    int updateByPrimaryKeySelective(Base row);

    int updateByPrimaryKey(Base row);

    int upsert(Base record);

    int batchUpsert(@Param("list") List<Base> list);

    int batchDelete(@Param("list") List<String> list);
}