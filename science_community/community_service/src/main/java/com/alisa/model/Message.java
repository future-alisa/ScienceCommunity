package com.alisa.model;

import java.util.Date;

public class Message {
    private String messageId;

    private String messageChannelId;

    private String messageFrom;

    private String messageTo;

    private Date messageCreateDatatime;

    private String messageContent;

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getMessageChannelId() {
        return messageChannelId;
    }

    public void setMessageChannelId(String messageChannelId) {
        this.messageChannelId = messageChannelId;
    }

    public String getMessageFrom() {
        return messageFrom;
    }

    public void setMessageFrom(String messageFrom) {
        this.messageFrom = messageFrom;
    }

    public String getMessageTo() {
        return messageTo;
    }

    public void setMessageTo(String messageTo) {
        this.messageTo = messageTo;
    }

    public Date getMessageCreateDatatime() {
        return messageCreateDatatime;
    }

    public void setMessageCreateDatatime(Date messageCreateDatatime) {
        this.messageCreateDatatime = messageCreateDatatime;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }
}