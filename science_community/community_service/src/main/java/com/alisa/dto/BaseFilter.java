package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class BaseFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public BaseFilter() {
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

        public Criteria andBaseIdIsNull() {
            addCriterion("base_id is null");
            return (Criteria) this;
        }

        public Criteria andBaseIdIsNotNull() {
            addCriterion("base_id is not null");
            return (Criteria) this;
        }

        public Criteria andBaseIdEqualTo(String value) {
            addCriterion("base_id =", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdNotEqualTo(String value) {
            addCriterion("base_id <>", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdGreaterThan(String value) {
            addCriterion("base_id >", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdGreaterThanOrEqualTo(String value) {
            addCriterion("base_id >=", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdLessThan(String value) {
            addCriterion("base_id <", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdLessThanOrEqualTo(String value) {
            addCriterion("base_id <=", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdLike(String value) {
            addCriterion("base_id like", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdNotLike(String value) {
            addCriterion("base_id not like", value, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdIn(List<String> values) {
            addCriterion("base_id in", values, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdNotIn(List<String> values) {
            addCriterion("base_id not in", values, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdBetween(String value1, String value2) {
            addCriterion("base_id between", value1, value2, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseIdNotBetween(String value1, String value2) {
            addCriterion("base_id not between", value1, value2, "baseId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdIsNull() {
            addCriterion("base_document_id is null");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdIsNotNull() {
            addCriterion("base_document_id is not null");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdEqualTo(String value) {
            addCriterion("base_document_id =", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdNotEqualTo(String value) {
            addCriterion("base_document_id <>", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdGreaterThan(String value) {
            addCriterion("base_document_id >", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdGreaterThanOrEqualTo(String value) {
            addCriterion("base_document_id >=", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdLessThan(String value) {
            addCriterion("base_document_id <", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdLessThanOrEqualTo(String value) {
            addCriterion("base_document_id <=", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdLike(String value) {
            addCriterion("base_document_id like", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdNotLike(String value) {
            addCriterion("base_document_id not like", value, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdIn(List<String> values) {
            addCriterion("base_document_id in", values, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdNotIn(List<String> values) {
            addCriterion("base_document_id not in", values, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdBetween(String value1, String value2) {
            addCriterion("base_document_id between", value1, value2, "baseDocumentId");
            return (Criteria) this;
        }

        public Criteria andBaseDocumentIdNotBetween(String value1, String value2) {
            addCriterion("base_document_id not between", value1, value2, "baseDocumentId");
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