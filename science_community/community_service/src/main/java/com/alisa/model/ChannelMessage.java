package com.alisa.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import lombok.Data;
import java.util.Date;

@Data
public class ChannelMessage {
    @JsonSerialize(using = ToStringSerializer.class)
    private Long sequenceId;
    private String messageId;
    private String channelId;
    private String senderId;
    private String senderName;
    private String clientMessageId;
    private String content;
    private Date createdAt;
}
