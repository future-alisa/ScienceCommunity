package com.alisa.mapper;

import com.alisa.dto.CommunityFilter;
import com.alisa.model.Community;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommunityMapper {
    long countByExample(CommunityFilter example);

    int deleteByExample(CommunityFilter example);

    int deleteByPrimaryKey(String communityId);

    int insert(Community row);

    int insertSelective(Community row);

    List<Community> selectByExample(CommunityFilter example);

    Community selectByPrimaryKey(String communityId);

    int updateByExampleSelective(@Param("row") Community row, @Param("example") CommunityFilter example);

    int updateByExample(@Param("row") Community row, @Param("example") CommunityFilter example);

    int updateByPrimaryKeySelective(Community row);

    int updateByPrimaryKey(Community row);

    int upsert(Community record);

    int batchUpsert(@Param("list") List<Community> list);

    int batchDelete(@Param("list") List<String> list);
}