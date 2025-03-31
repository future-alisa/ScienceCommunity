package com.alisa.mapper;

import com.alisa.model.ChannelUser;
import com.alisa.dto.ChannelUserFilter;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ChannelUserMapper {
    long countByExample(ChannelUserFilter example);

    int deleteByExample(ChannelUserFilter example);

    int insert(ChannelUser record);

    int insertSelective(ChannelUser record);

    List<ChannelUser> selectByExample(ChannelUserFilter example);

    int updateByExampleSelective(@Param("record") ChannelUser record, @Param("example") ChannelUserFilter example);

    int updateByExample(@Param("record") ChannelUser record, @Param("example") ChannelUserFilter example);
}