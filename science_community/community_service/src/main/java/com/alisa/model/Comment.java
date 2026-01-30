package com.alisa.model;

import java.util.Date;

public class Comment {
    private String commentId;

    private String messageId;

    private String commentContent;

    private Date commentCreateDatetime;

    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getCommentContent() {
        return commentContent;
    }

    public void setCommentContent(String commentContent) {
        this.commentContent = commentContent;
    }

    public Date getCommentCreateDatetime() {
        return commentCreateDatetime;
    }

    public void setCommentCreateDatetime(Date commentCreateDatetime) {
        this.commentCreateDatetime = commentCreateDatetime;
    }
}