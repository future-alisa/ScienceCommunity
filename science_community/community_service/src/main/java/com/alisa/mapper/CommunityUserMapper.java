package com.alisa.mapper;

import com.alisa.dto.CommunityUserFilter;
import com.alisa.model.CommunityUser;
import com.alisa.vo.CommunityUserVo;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommunityUserMapper {
    long countByExample(CommunityUserFilter example);

    int deleteByExample(CommunityUserFilter example);

    int deleteByPrimaryKey(String communityUserId);

    int insert(CommunityUser row);

    int insertSelective(CommunityUser row);

    List<CommunityUser> selectByExample(CommunityUserFilter example);

    List<CommunityUserVo> selectCommunityUser(String communityId);

    CommunityUser selectByPrimaryKey(String communityUserId);

    int updateByExampleSelective(@Param("row") CommunityUser row, @Param("example") CommunityUserFilter example);

    int updateByExample(@Param("row") CommunityUser row, @Param("example") CommunityUserFilter example);

    int updateByPrimaryKeySelective(CommunityUser row);

    int updateByPrimaryKey(CommunityUser row);

    int upsert(CommunityUser record);

    int batchUpsert(@Param("list") List<CommunityUser> list);

    int batchDelete(@Param("list") List<String> list);
}