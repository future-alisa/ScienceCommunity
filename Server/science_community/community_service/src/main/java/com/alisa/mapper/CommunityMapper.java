package com.alisa.mapper;

import com.alisa.model.Community;
import com.alisa.dto.CommunityFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommunityMapper {
    long countByExample(CommunityFilter example);

    int deleteByExample(CommunityFilter example);

    int deleteByPrimaryKey(@Param("id") String id);

    int insert(Community record);

    int insertSelective(Community record);

    List<Community> selectByExample(CommunityFilter example);

    List<Community> selectByUserId(String userId);

    int updateByExampleSelective(@Param("record") Community record, @Param("example") CommunityFilter example);

    int updateByExample(@Param("record") Community record, @Param("example") CommunityFilter example);
}