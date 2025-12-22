package com.alisa.model;

import java.util.Date;

public class Document {
    private String documentId;

    private String documentCategoryId;

    private String documentAuthor;

    private Date documentCreateDate;

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