package com.alisa.mapper;

import com.alisa.model.ChannelMessage;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface ChannelMessageMapper {
    String COLUMNS = "sequence_id as sequenceId, message_id as messageId, channel_id as channelId, sender_id as senderId, "
        + "sender_name as senderName, client_message_id as clientMessageId, content, created_at as createdAt";

    @Select("select " + COLUMNS + " from tb_channel_message where channel_id=#{channelId} and sender_id=#{senderId} and client_message_id=#{clientMessageId}")
    ChannelMessage findRequest(@Param("channelId") String channelId, @Param("senderId") String senderId, @Param("clientMessageId") String clientMessageId);

    @Insert("insert into tb_channel_message (message_id,channel_id,sender_id,sender_name,client_message_id,content,created_at) "
        + "values (#{messageId},#{channelId},#{senderId},#{senderName},#{clientMessageId},#{content},#{createdAt})")
    @Options(useGeneratedKeys = true, keyProperty = "sequenceId", keyColumn = "sequence_id")
    int insert(ChannelMessage message);

    @Select("<script>select " + COLUMNS + " from tb_channel_message where channel_id=#{channelId} "
        + "<if test='before != null'>and sequence_id &lt; #{before}</if> "
        + "<if test='after != null'>and sequence_id &gt; #{after}</if> "
        + "order by sequence_id <choose><when test='after != null'>asc</when><otherwise>desc</otherwise></choose> limit #{limit}</script>")
    List<ChannelMessage> history(@Param("channelId") String channelId, @Param("before") Long before, @Param("after") Long after, @Param("limit") int limit);

    @Delete("delete from tb_channel_message where channel_id=#{channelId}")
    int deleteChannel(String channelId);
}
