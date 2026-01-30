package com.alisa.mapper;

import com.alisa.dto.MessageFilter;
import com.alisa.model.Message;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MessageMapper {
    long countByExample(MessageFilter example);

    int deleteByExample(MessageFilter example);

    int deleteByPrimaryKey(String messageId);

    int insert(Message row);

    int insertSelective(Message row);

    List<Message> selectByExampleWithBLOBs(MessageFilter example);

    List<Message> selectByExample(MessageFilter example);

    Message selectByPrimaryKey(String messageId);

    int updateByExampleSelective(@Param("row") Message row, @Param("example") MessageFilter example);

    int updateByExampleWithBLOBs(@Param("row") Message row, @Param("example") MessageFilter example);

    int updateByExample(@Param("row") Message row, @Param("example") MessageFilter example);

    int updateByPrimaryKeySelective(Message row);

    int updateByPrimaryKeyWithBLOBs(Message row);

    int updateByPrimaryKey(Message row);

    int upsert(Message record);

    int batchUpsert(@Param("list") List<Message> list);

    int batchDelete(@Param("list") List<String> list);
}