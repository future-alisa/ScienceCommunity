package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class DocumentFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public DocumentFilter() {
        oredCriteria = new ArrayList<>();
    }

    public void setOrderByClause(String orderByClause) {
        this.orderByClause = orderByClause;
    }

    public String getOrderByClause() {
        return orderByClause;
    }

    public void setDistinct(boolean distinct) {
        this.distinct = distinct;
    }

    public boolean isDistinct() {
        return distinct;
    }

    public List<Criteria> getOredCriteria() {
        return oredCriteria;
    }

    public void or(Criteria criteria) {
        oredCriteria.add(criteria);
    }

    public Criteria or() {
        Criteria criteria = createCriteriaInternal();
        oredCriteria.add(criteria);
        return criteria;
    }

    public Criteria createCriteria() {
        Criteria criteria = createCriteriaInternal();
        if (oredCriteria.size() == 0) {
            oredCriteria.add(criteria);
        }
        return criteria;
    }

    protected Criteria createCriteriaInternal() {
        Criteria criteria = new Criteria();
        return criteria;
    }

    public void clear() {
        oredCriteria.clear();
        orderByClause = null;
        distinct = false;
    }

    protected abstract static class GeneratedCriteria {
        protected List<Criterion> criteria;

        protected GeneratedCriteria() {
            super();
            criteria = new ArrayList<>();
        }

        public boolean isValid() {
            return criteria.size() > 0;
        }

        public List<Criterion> getAllCriteria() {
            return criteria;
        }

        public List<Criterion> getCriteria() {
            return criteria;
        }

        protected void addCriterion(String condition) {
            if (condition == null) {
                throw new RuntimeException("Value for condition cannot be null");
            }
            criteria.add(new Criterion(condition));
        }

        protected void addCriterion(String condition, Object value, String property) {
            if (value == null) {
                throw new RuntimeException("Value for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value));
        }

        protected void addCriterion(String condition, Object value1, Object value2, String property) {
            if (value1 == null || value2 == null) {
                throw new RuntimeException("Between values for " + property + " cannot be null");
            }
            criteria.add(new Criterion(condition, value1, value2));
        }

        public Criteria andDocumentIdIsNull() {
            addCriterion("document_id is null");
            return (Criteria) this;
        }

        public Criteria andDocumentIdIsNotNull() {
            addCriterion("document_id is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentIdEqualTo(String value) {
            addCriterion("document_id =", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdNotEqualTo(String value) {
            addCriterion("document_id <>", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdGreaterThan(String value) {
            addCriterion("document_id >", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdGreaterThanOrEqualTo(String value) {
            addCriterion("document_id >=", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdLessThan(String value) {
            addCriterion("document_id <", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdLessThanOrEqualTo(String value) {
            addCriterion("document_id <=", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdLike(String value) {
            addCriterion("document_id like", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdNotLike(String value) {
            addCriterion("document_id not like", value, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdIn(List<String> values) {
            addCriterion("document_id in", values, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdNotIn(List<String> values) {
            addCriterion("document_id not in", values, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdBetween(String value1, String value2) {
            addCriterion("document_id between", value1, value2, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentIdNotBetween(String value1, String value2) {
            addCriterion("document_id not between", value1, value2, "documentId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdIsNull() {
            addCriterion("document_category_id is null");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdIsNotNull() {
            addCriterion("document_category_id is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdEqualTo(String value) {
            addCriterion("document_category_id =", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdNotEqualTo(String value) {
            addCriterion("document_category_id <>", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdGreaterThan(String value) {
            addCriterion("document_category_id >", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdGreaterThanOrEqualTo(String value) {
            addCriterion("document_category_id >=", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdLessThan(String value) {
            addCriterion("document_category_id <", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdLessThanOrEqualTo(String value) {
            addCriterion("document_category_id <=", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdLike(String value) {
            addCriterion("document_category_id like", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdNotLike(String value) {
            addCriterion("document_category_id not like", value, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdIn(List<String> values) {
            addCriterion("document_category_id in", values, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdNotIn(List<String> values) {
            addCriterion("document_category_id not in", values, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdBetween(String value1, String value2) {
            addCriterion("document_category_id between", value1, value2, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentCategoryIdNotBetween(String value1, String value2) {
            addCriterion("document_category_id not between", value1, value2, "documentCategoryId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdIsNull() {
            addCriterion("document_author_id is null");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdIsNotNull() {
            addCriterion("document_author_id is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdEqualTo(String value) {
            addCriterion("document_author_id =", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdNotEqualTo(String value) {
            addCriterion("document_author_id <>", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdGreaterThan(String value) {
            addCriterion("document_author_id >", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdGreaterThanOrEqualTo(String value) {
            addCriterion("document_author_id >=", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdLessThan(String value) {
            addCriterion("document_author_id <", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdLessThanOrEqualTo(String value) {
            addCriterion("document_author_id <=", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdLike(String value) {
            addCriterion("document_author_id like", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdNotLike(String value) {
            addCriterion("document_author_id not like", value, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdIn(List<String> values) {
            addCriterion("document_author_id in", values, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdNotIn(List<String> values) {
            addCriterion("document_author_id not in", values, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdBetween(String value1, String value2) {
            addCriterion("document_author_id between", value1, value2, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentAuthorIdNotBetween(String value1, String value2) {
            addCriterion("document_author_id not between", value1, value2, "documentAuthorId");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateIsNull() {
            addCriterion("document_create_date is null");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateIsNotNull() {
            addCriterion("document_create_date is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateEqualTo(java.util.Date value) {
            addCriterion("document_create_date =", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateNotEqualTo(java.util.Date value) {
            addCriterion("document_create_date <>", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateGreaterThan(java.util.Date value) {
            addCriterion("document_create_date >", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateGreaterThanOrEqualTo(java.util.Date value) {
            addCriterion("document_create_date >=", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateLessThan(java.util.Date value) {
            addCriterion("document_create_date <", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateLessThanOrEqualTo(java.util.Date value) {
            addCriterion("document_create_date <=", value, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateIn(List<java.util.Date> values) {
            addCriterion("document_create_date in", values, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateNotIn(List<java.util.Date> values) {
            addCriterion("document_create_date not in", values, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("document_create_date between", value1, value2, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCreateDateNotBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("document_create_date not between", value1, value2, "documentCreateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateIsNull() {
            addCriterion("document_update_date is null");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateIsNotNull() {
            addCriterion("document_update_date is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateEqualTo(java.util.Date value) {
            addCriterion("document_update_date =", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateNotEqualTo(java.util.Date value) {
            addCriterion("document_update_date <>", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateGreaterThan(java.util.Date value) {
            addCriterion("document_update_date >", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateGreaterThanOrEqualTo(java.util.Date value) {
            addCriterion("document_update_date >=", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateLessThan(java.util.Date value) {
            addCriterion("document_update_date <", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateLessThanOrEqualTo(java.util.Date value) {
            addCriterion("document_update_date <=", value, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateIn(List<java.util.Date> values) {
            addCriterion("document_update_date in", values, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateNotIn(List<java.util.Date> values) {
            addCriterion("document_update_date not in", values, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("document_update_date between", value1, value2, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentUpdateDateNotBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("document_update_date not between", value1, value2, "documentUpdateDate");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdIsNull() {
            addCriterion("document_community_id is null");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdIsNotNull() {
            addCriterion("document_community_id is not null");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdEqualTo(String value) {
            addCriterion("document_community_id =", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdNotEqualTo(String value) {
            addCriterion("document_community_id <>", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdGreaterThan(String value) {
            addCriterion("document_community_id >", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdGreaterThanOrEqualTo(String value) {
            addCriterion("document_community_id >=", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdLessThan(String value) {
            addCriterion("document_community_id <", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdLessThanOrEqualTo(String value) {
            addCriterion("document_community_id <=", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdLike(String value) {
            addCriterion("document_community_id like", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdNotLike(String value) {
            addCriterion("document_community_id not like", value, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdIn(List<String> values) {
            addCriterion("document_community_id in", values, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdNotIn(List<String> values) {
            addCriterion("document_community_id not in", values, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdBetween(String value1, String value2) {
            addCriterion("document_community_id between", value1, value2, "documentCommunityId");
            return (Criteria) this;
        }

        public Criteria andDocumentCommunityIdNotBetween(String value1, String value2) {
            addCriterion("document_community_id not between", value1, value2, "documentCommunityId");
            return (Criteria) this;
        }
    }

    public static class Criteria extends GeneratedCriteria {
        protected Criteria() {
            super();
        }
    }

    public static class Criterion {
        private String condition;

        private Object value;

        private Object secondValue;

        private boolean noValue;

        private boolean singleValue;

        private boolean betweenValue;

        private boolean listValue;

        private String typeHandler;

        public String getCondition() {
            return condition;
        }

        public Object getValue() {
            return value;
        }

        public Object getSecondValue() {
            return secondValue;
        }

        public boolean isNoValue() {
            return noValue;
        }

        public boolean isSingleValue() {
            return singleValue;
        }

        public boolean isBetweenValue() {
            return betweenValue;
        }

        public boolean isListValue() {
            return listValue;
        }

        public String getTypeHandler() {
            return typeHandler;
        }

        protected Criterion(String condition) {
            super();
            this.condition = condition;
            this.typeHandler = null;
            this.noValue = true;
        }

        protected Criterion(String condition, Object value, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.typeHandler = typeHandler;
            if (value instanceof List<?>) {
                this.listValue = true;
            } else {
                this.singleValue = true;
            }
        }

        protected Criterion(String condition, Object value) {
            this(condition, value, null);
        }

        protected Criterion(String condition, Object value, Object secondValue, String typeHandler) {
            super();
            this.condition = condition;
            this.value = value;
            this.secondValue = secondValue;
            this.typeHandler = typeHandler;
            this.betweenValue = true;
        }

        protected Criterion(String condition, Object value, Object secondValue) {
            this(condition, value, secondValue, null);
        }
    }
}