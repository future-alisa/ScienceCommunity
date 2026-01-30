package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class BasisFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public BasisFilter() {
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

        public Criteria andBasisIdIsNull() {
            addCriterion("basis_id is null");
            return (Criteria) this;
        }

        public Criteria andBasisIdIsNotNull() {
            addCriterion("basis_id is not null");
            return (Criteria) this;
        }

        public Criteria andBasisIdEqualTo(String value) {
            addCriterion("basis_id =", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdNotEqualTo(String value) {
            addCriterion("basis_id <>", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdGreaterThan(String value) {
            addCriterion("basis_id >", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdGreaterThanOrEqualTo(String value) {
            addCriterion("basis_id >=", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdLessThan(String value) {
            addCriterion("basis_id <", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdLessThanOrEqualTo(String value) {
            addCriterion("basis_id <=", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdLike(String value) {
            addCriterion("basis_id like", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdNotLike(String value) {
            addCriterion("basis_id not like", value, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdIn(List<String> values) {
            addCriterion("basis_id in", values, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdNotIn(List<String> values) {
            addCriterion("basis_id not in", values, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdBetween(String value1, String value2) {
            addCriterion("basis_id between", value1, value2, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisIdNotBetween(String value1, String value2) {
            addCriterion("basis_id not between", value1, value2, "basisId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdIsNull() {
            addCriterion("basis_document_id is null");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdIsNotNull() {
            addCriterion("basis_document_id is not null");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdEqualTo(String value) {
            addCriterion("basis_document_id =", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdNotEqualTo(String value) {
            addCriterion("basis_document_id <>", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdGreaterThan(String value) {
            addCriterion("basis_document_id >", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdGreaterThanOrEqualTo(String value) {
            addCriterion("basis_document_id >=", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdLessThan(String value) {
            addCriterion("basis_document_id <", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdLessThanOrEqualTo(String value) {
            addCriterion("basis_document_id <=", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdLike(String value) {
            addCriterion("basis_document_id like", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdNotLike(String value) {
            addCriterion("basis_document_id not like", value, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdIn(List<String> values) {
            addCriterion("basis_document_id in", values, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdNotIn(List<String> values) {
            addCriterion("basis_document_id not in", values, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdBetween(String value1, String value2) {
            addCriterion("basis_document_id between", value1, value2, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisDocumentIdNotBetween(String value1, String value2) {
            addCriterion("basis_document_id not between", value1, value2, "basisDocumentId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdIsNull() {
            addCriterion("basis_community_id is null");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdIsNotNull() {
            addCriterion("basis_community_id is not null");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdEqualTo(String value) {
            addCriterion("basis_community_id =", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdNotEqualTo(String value) {
            addCriterion("basis_community_id <>", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdGreaterThan(String value) {
            addCriterion("basis_community_id >", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdGreaterThanOrEqualTo(String value) {
            addCriterion("basis_community_id >=", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdLessThan(String value) {
            addCriterion("basis_community_id <", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdLessThanOrEqualTo(String value) {
            addCriterion("basis_community_id <=", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdLike(String value) {
            addCriterion("basis_community_id like", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdNotLike(String value) {
            addCriterion("basis_community_id not like", value, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdIn(List<String> values) {
            addCriterion("basis_community_id in", values, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdNotIn(List<String> values) {
            addCriterion("basis_community_id not in", values, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdBetween(String value1, String value2) {
            addCriterion("basis_community_id between", value1, value2, "basisCommunityId");
            return (Criteria) this;
        }

        public Criteria andBasisCommunityIdNotBetween(String value1, String value2) {
            addCriterion("basis_community_id not between", value1, value2, "basisCommunityId");
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