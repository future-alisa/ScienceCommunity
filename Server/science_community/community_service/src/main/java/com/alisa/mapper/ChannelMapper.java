package com.alisa.mapper;

import com.alisa.model.Channel;
import com.alisa.dto.ChannelFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChannelMapper {
    long countByExample(ChannelFilter example);

    int deleteByExample(ChannelFilter example);

    int deleteByPrimaryKey(String channelId);

    int insert(Channel record);

    int insertSelective(Channel record);

    List<Channel> selectByExample(ChannelFilter example);

    Channel selectByPrimaryKey(String channelId);

    int updateByExampleSelective(@Param("record") Channel record, @Param("example") ChannelFilter example);

    int updateByExample(@Param("record") Channel record, @Param("example") ChannelFilter example);

    int updateByPrimaryKeySelective(Channel record);

    int updateByPrimaryKey(Channel record);
}