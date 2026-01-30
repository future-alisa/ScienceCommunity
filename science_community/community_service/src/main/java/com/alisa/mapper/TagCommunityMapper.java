package com.alisa.mapper;

import com.alisa.dto.TagCommunityFilter;
import com.alisa.model.TagCommunity;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface TagCommunityMapper {
    long countByExample(TagCommunityFilter example);

    int deleteByExample(TagCommunityFilter example);

    int deleteByPrimaryKey(String tagCommunityId);

    int insert(TagCommunity row);

    int insertSelective(TagCommunity row);

    List<TagCommunity> selectByExample(TagCommunityFilter example);

    TagCommunity selectByPrimaryKey(String tagCommunityId);

    int updateByExampleSelective(@Param("row") TagCommunity row, @Param("example") TagCommunityFilter example);

    int updateByExample(@Param("row") TagCommunity row, @Param("example") TagCommunityFilter example);

    int updateByPrimaryKeySelective(TagCommunity row);

    int updateByPrimaryKey(TagCommunity row);

    int upsert(TagCommunity record);

    int batchUpsert(@Param("list") List<TagCommunity> list);

    int batchDelete(@Param("list") List<String> list);
}