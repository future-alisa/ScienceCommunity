package com.alisa.mapper;

import com.alisa.dto.ChannelUserFilter;
import com.alisa.model.ChannelUser;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChannelUserMapper {
    long countByExample(ChannelUserFilter example);

    int deleteByExample(ChannelUserFilter example);

    int deleteByPrimaryKey(String channelUserId);

    int insert(ChannelUser row);

    int insertSelective(ChannelUser row);

    List<ChannelUser> selectByExample(ChannelUserFilter example);

    ChannelUser selectByPrimaryKey(String channelUserId);

    int updateByExampleSelective(@Param("row") ChannelUser row, @Param("example") ChannelUserFilter example);

    int updateByExample(@Param("row") ChannelUser row, @Param("example") ChannelUserFilter example);

    int updateByPrimaryKeySelective(ChannelUser row);

    int updateByPrimaryKey(ChannelUser row);

    int upsert(ChannelUser record);

    int batchUpsert(@Param("list") List<ChannelUser> list);

    int batchDelete(@Param("list") List<String> list);
}