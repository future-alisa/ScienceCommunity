package com.alisa.mapper;

import com.alisa.model.Base;
import com.alisa.dto.BaseFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BaseMapper {
    long countByExample(BaseFilter example);

    int deleteByExample(BaseFilter example);

    int deleteByPrimaryKey(String baseId);

    int insert(Base record);

    int insertSelective(Base record);

    List<Base> selectByExample(BaseFilter example);

    Base selectByPrimaryKey(String baseId);

    int updateByExampleSelective(@Param("record") Base record, @Param("example") BaseFilter example);

    int updateByExample(@Param("record") Base record, @Param("example") BaseFilter example);

    int updateByPrimaryKeySelective(Base record);

    int updateByPrimaryKey(Base record);
}