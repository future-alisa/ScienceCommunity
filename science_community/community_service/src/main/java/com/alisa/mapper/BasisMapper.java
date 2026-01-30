package com.alisa.mapper;

import com.alisa.dto.BasisFilter;
import com.alisa.model.Basis;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BasisMapper {
    long countByExample(BasisFilter example);

    int deleteByExample(BasisFilter example);

    int deleteByPrimaryKey(String basisId);

    int insert(Basis row);

    int insertSelective(Basis row);

    List<Basis> selectByExample(BasisFilter example);

    Basis selectByPrimaryKey(String basisId);

    int updateByExampleSelective(@Param("row") Basis row, @Param("example") BasisFilter example);

    int updateByExample(@Param("row") Basis row, @Param("example") BasisFilter example);

    int updateByPrimaryKeySelective(Basis row);

    int updateByPrimaryKey(Basis row);

    int upsert(Basis record);

    int batchUpsert(@Param("list") List<Basis> list);

    int batchDelete(@Param("list") List<String> list);
}