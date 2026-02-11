package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class ChannelFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public ChannelFilter() {
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

        public Criteria andChannelIdIsNull() {
            addCriterion("channel_id is null");
            return (Criteria) this;
        }

        public Criteria andChannelIdIsNotNull() {
            addCriterion("channel_id is not null");
            return (Criteria) this;
        }

        public Criteria andChannelIdEqualTo(String value) {
            addCriterion("channel_id =", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdNotEqualTo(String value) {
            addCriterion("channel_id <>", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdGreaterThan(String value) {
            addCriterion("channel_id >", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdGreaterThanOrEqualTo(String value) {
            addCriterion("channel_id >=", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdLessThan(String value) {
            addCriterion("channel_id <", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdLessThanOrEqualTo(String value) {
            addCriterion("channel_id <=", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdLike(String value) {
            addCriterion("channel_id like", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdNotLike(String value) {
            addCriterion("channel_id not like", value, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdIn(List<String> values) {
            addCriterion("channel_id in", values, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdNotIn(List<String> values) {
            addCriterion("channel_id not in", values, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdBetween(String value1, String value2) {
            addCriterion("channel_id between", value1, value2, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelIdNotBetween(String value1, String value2) {
            addCriterion("channel_id not between", value1, value2, "channelId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdIsNull() {
            addCriterion("channel_community_id is null");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdIsNotNull() {
            addCriterion("channel_community_id is not null");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdEqualTo(String value) {
            addCriterion("channel_community_id =", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdNotEqualTo(String value) {
            addCriterion("channel_community_id <>", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdGreaterThan(String value) {
            addCriterion("channel_community_id >", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdGreaterThanOrEqualTo(String value) {
            addCriterion("channel_community_id >=", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdLessThan(String value) {
            addCriterion("channel_community_id <", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdLessThanOrEqualTo(String value) {
            addCriterion("channel_community_id <=", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdLike(String value) {
            addCriterion("channel_community_id like", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdNotLike(String value) {
            addCriterion("channel_community_id not like", value, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdIn(List<String> values) {
            addCriterion("channel_community_id in", values, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdNotIn(List<String> values) {
            addCriterion("channel_community_id not in", values, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdBetween(String value1, String value2) {
            addCriterion("channel_community_id between", value1, value2, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelCommunityIdNotBetween(String value1, String value2) {
            addCriterion("channel_community_id not between", value1, value2, "channelCommunityId");
            return (Criteria) this;
        }

        public Criteria andChannelNameIsNull() {
            addCriterion("channel_name is null");
            return (Criteria) this;
        }

        public Criteria andChannelNameIsNotNull() {
            addCriterion("channel_name is not null");
            return (Criteria) this;
        }

        public Criteria andChannelNameEqualTo(String value) {
            addCriterion("channel_name =", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameNotEqualTo(String value) {
            addCriterion("channel_name <>", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameGreaterThan(String value) {
            addCriterion("channel_name >", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameGreaterThanOrEqualTo(String value) {
            addCriterion("channel_name >=", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameLessThan(String value) {
            addCriterion("channel_name <", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameLessThanOrEqualTo(String value) {
            addCriterion("channel_name <=", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameLike(String value) {
            addCriterion("channel_name like", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameNotLike(String value) {
            addCriterion("channel_name not like", value, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameIn(List<String> values) {
            addCriterion("channel_name in", values, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameNotIn(List<String> values) {
            addCriterion("channel_name not in", values, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameBetween(String value1, String value2) {
            addCriterion("channel_name between", value1, value2, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelNameNotBetween(String value1, String value2) {
            addCriterion("channel_name not between", value1, value2, "channelName");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionIsNull() {
            addCriterion("channel_description is null");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionIsNotNull() {
            addCriterion("channel_description is not null");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionEqualTo(String value) {
            addCriterion("channel_description =", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionNotEqualTo(String value) {
            addCriterion("channel_description <>", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionGreaterThan(String value) {
            addCriterion("channel_description >", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionGreaterThanOrEqualTo(String value) {
            addCriterion("channel_description >=", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionLessThan(String value) {
            addCriterion("channel_description <", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionLessThanOrEqualTo(String value) {
            addCriterion("channel_description <=", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionLike(String value) {
            addCriterion("channel_description like", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionNotLike(String value) {
            addCriterion("channel_description not like", value, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionIn(List<String> values) {
            addCriterion("channel_description in", values, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionNotIn(List<String> values) {
            addCriterion("channel_description not in", values, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionBetween(String value1, String value2) {
            addCriterion("channel_description between", value1, value2, "channelDescription");
            return (Criteria) this;
        }

        public Criteria andChannelDescriptionNotBetween(String value1, String value2) {
            addCriterion("channel_description not between", value1, value2, "channelDescription");
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