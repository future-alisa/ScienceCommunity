package com.alisa.mapper;

import com.alisa.dto.ChannelFilter;
import com.alisa.model.Channel;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChannelMapper {
    long countByExample(ChannelFilter example);

    int deleteByExample(ChannelFilter example);

    int deleteByPrimaryKey(String channelId);

    int insert(Channel row);

    int insertSelective(Channel row);

    List<Channel> selectByExample(ChannelFilter example);

    Channel selectByPrimaryKey(String channelId);

    int updateByExampleSelective(@Param("row") Channel row, @Param("example") ChannelFilter example);

    int updateByExample(@Param("row") Channel row, @Param("example") ChannelFilter example);

    int updateByPrimaryKeySelective(Channel row);

    int updateByPrimaryKey(Channel row);

    int upsert(Channel record);

    int batchUpsert(@Param("list") List<Channel> list);

    int batchDelete(@Param("list") List<String> list);
}