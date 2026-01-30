package com.alisa.model;

import java.util.Date;

public class Document {
    private String documentId;

    private String documentCategoryId;

    private String documentAuthorId;

    private Date documentCreateDate;

    private Date documentUpdateDate;

    private String documentCommunityId;

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

    public String getDocumentAuthorId() {
        return documentAuthorId;
    }

    public void setDocumentAuthorId(String documentAuthorId) {
        this.documentAuthorId = documentAuthorId;
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

    public String getDocumentCommunityId() {
        return documentCommunityId;
    }

    public void setDocumentCommunityId(String documentCommunityId) {
        this.documentCommunityId = documentCommunityId;
    }

    public String getDocumentContent() {
        return documentContent;
    }

    public void setDocumentContent(String documentContent) {
        this.documentContent = documentContent;
    }
}