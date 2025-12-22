package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class CommunityFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public CommunityFilter() {
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

        public Criteria andCommunityIdIsNull() {
            addCriterion("community_id is null");
            return (Criteria) this;
        }

        public Criteria andCommunityIdIsNotNull() {
            addCriterion("community_id is not null");
            return (Criteria) this;
        }

        public Criteria andCommunityIdEqualTo(String value) {
            addCriterion("community_id =", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdNotEqualTo(String value) {
            addCriterion("community_id <>", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdGreaterThan(String value) {
            addCriterion("community_id >", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdGreaterThanOrEqualTo(String value) {
            addCriterion("community_id >=", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdLessThan(String value) {
            addCriterion("community_id <", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdLessThanOrEqualTo(String value) {
            addCriterion("community_id <=", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdLike(String value) {
            addCriterion("community_id like", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdNotLike(String value) {
            addCriterion("community_id not like", value, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdIn(List<String> values) {
            addCriterion("community_id in", values, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdNotIn(List<String> values) {
            addCriterion("community_id not in", values, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdBetween(String value1, String value2) {
            addCriterion("community_id between", value1, value2, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityIdNotBetween(String value1, String value2) {
            addCriterion("community_id not between", value1, value2, "communityId");
            return (Criteria) this;
        }

        public Criteria andCommunityNameIsNull() {
            addCriterion("community_name is null");
            return (Criteria) this;
        }

        public Criteria andCommunityNameIsNotNull() {
            addCriterion("community_name is not null");
            return (Criteria) this;
        }

        public Criteria andCommunityNameEqualTo(String value) {
            addCriterion("community_name =", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameNotEqualTo(String value) {
            addCriterion("community_name <>", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameGreaterThan(String value) {
            addCriterion("community_name >", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameGreaterThanOrEqualTo(String value) {
            addCriterion("community_name >=", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameLessThan(String value) {
            addCriterion("community_name <", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameLessThanOrEqualTo(String value) {
            addCriterion("community_name <=", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameLike(String value) {
            addCriterion("community_name like", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameNotLike(String value) {
            addCriterion("community_name not like", value, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameIn(List<String> values) {
            addCriterion("community_name in", values, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameNotIn(List<String> values) {
            addCriterion("community_name not in", values, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameBetween(String value1, String value2) {
            addCriterion("community_name between", value1, value2, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityNameNotBetween(String value1, String value2) {
            addCriterion("community_name not between", value1, value2, "communityName");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionIsNull() {
            addCriterion("community_description is null");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionIsNotNull() {
            addCriterion("community_description is not null");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionEqualTo(String value) {
            addCriterion("community_description =", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionNotEqualTo(String value) {
            addCriterion("community_description <>", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionGreaterThan(String value) {
            addCriterion("community_description >", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionGreaterThanOrEqualTo(String value) {
            addCriterion("community_description >=", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionLessThan(String value) {
            addCriterion("community_description <", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionLessThanOrEqualTo(String value) {
            addCriterion("community_description <=", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionLike(String value) {
            addCriterion("community_description like", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionNotLike(String value) {
            addCriterion("community_description not like", value, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionIn(List<String> values) {
            addCriterion("community_description in", values, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionNotIn(List<String> values) {
            addCriterion("community_description not in", values, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionBetween(String value1, String value2) {
            addCriterion("community_description between", value1, value2, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityDescriptionNotBetween(String value1, String value2) {
            addCriterion("community_description not between", value1, value2, "communityDescription");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlIsNull() {
            addCriterion("community_url is null");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlIsNotNull() {
            addCriterion("community_url is not null");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlEqualTo(String value) {
            addCriterion("community_url =", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlNotEqualTo(String value) {
            addCriterion("community_url <>", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlGreaterThan(String value) {
            addCriterion("community_url >", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlGreaterThanOrEqualTo(String value) {
            addCriterion("community_url >=", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlLessThan(String value) {
            addCriterion("community_url <", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlLessThanOrEqualTo(String value) {
            addCriterion("community_url <=", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlLike(String value) {
            addCriterion("community_url like", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlNotLike(String value) {
            addCriterion("community_url not like", value, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlIn(List<String> values) {
            addCriterion("community_url in", values, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlNotIn(List<String> values) {
            addCriterion("community_url not in", values, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlBetween(String value1, String value2) {
            addCriterion("community_url between", value1, value2, "communityUrl");
            return (Criteria) this;
        }

        public Criteria andCommunityUrlNotBetween(String value1, String value2) {
            addCriterion("community_url not between", value1, value2, "communityUrl");
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