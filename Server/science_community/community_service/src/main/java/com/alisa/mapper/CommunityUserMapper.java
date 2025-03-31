package com.alisa.mapper;

import com.alisa.model.CommunityUser;
import com.alisa.dto.CommunityUserFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommunityUserMapper {
    long countByExample(CommunityUserFilter example);

    int deleteByExample(CommunityUserFilter example);

    int deleteByPrimaryKey(String communityUserId);

    int insert(CommunityUser record);

    int insertSelective(CommunityUser record);

    List<CommunityUser> selectByExample(CommunityUserFilter example);

    CommunityUser selectByPrimaryKey(String communityUserId);

    int updateByExampleSelective(@Param("record") CommunityUser record, @Param("example") CommunityUserFilter example);

    int updateByExample(@Param("record") CommunityUser record, @Param("example") CommunityUserFilter example);

    int updateByPrimaryKeySelective(CommunityUser record);

    int updateByPrimaryKey(CommunityUser record);
}