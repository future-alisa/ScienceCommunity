package com.alisa.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Document {
    private String documentId;

    private String documentCategoryId;

    private String documentAuthor;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date documentCreateDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date documentUpdateDate;

    private String documentContent;

    public String getDocumentId() {
        return documentId;
    }

    public void setDocumentId(String documentId) {
        this.documentId = documentId;
    }

    public String getDocumentCategoryId() {
        return documentCategoryId;
    }

    public void setDocumentCategoryId(String documentCategoryId) {
        this.documentCategoryId = documentCategoryId;
    }

    public String getDocumentAuthor() {
        return documentAuthor;
    }

    public void setDocumentAuthor(String documentAuthor) {
        this.documentAuthor = documentAuthor;
    }

    public Date getDocumentCreateDate() {
        return documentCreateDate;
    }

    public void setDocumentCreateDate(Date documentCreateDate) {
        this.documentCreateDate = documentCreateDate;
    }

    public Date getDocumentUpdateDate() {
        return documentUpdateDate;
    }

    public void setDocumentUpdateDate(Date documentUpdateDate) {
        this.documentUpdateDate = documentUpdateDate;
    }

    public String getDocumentContent() {
        return documentContent;
    }

    public void setDocumentContent(String documentContent) {
        this.documentContent = documentContent;
    }
}