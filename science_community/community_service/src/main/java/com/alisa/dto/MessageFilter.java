package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

public final class MessageFilter {
    protected String orderByClause;

    protected boolean distinct;

    protected List<Criteria> oredCriteria;

    public MessageFilter() {
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

        public Criteria andMessageIdIsNull() {
            addCriterion("message_id is null");
            return (Criteria) this;
        }

        public Criteria andMessageIdIsNotNull() {
            addCriterion("message_id is not null");
            return (Criteria) this;
        }

        public Criteria andMessageIdEqualTo(String value) {
            addCriterion("message_id =", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdNotEqualTo(String value) {
            addCriterion("message_id <>", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdGreaterThan(String value) {
            addCriterion("message_id >", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdGreaterThanOrEqualTo(String value) {
            addCriterion("message_id >=", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdLessThan(String value) {
            addCriterion("message_id <", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdLessThanOrEqualTo(String value) {
            addCriterion("message_id <=", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdLike(String value) {
            addCriterion("message_id like", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdNotLike(String value) {
            addCriterion("message_id not like", value, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdIn(List<String> values) {
            addCriterion("message_id in", values, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdNotIn(List<String> values) {
            addCriterion("message_id not in", values, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdBetween(String value1, String value2) {
            addCriterion("message_id between", value1, value2, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageIdNotBetween(String value1, String value2) {
            addCriterion("message_id not between", value1, value2, "messageId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdIsNull() {
            addCriterion("message_channel_id is null");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdIsNotNull() {
            addCriterion("message_channel_id is not null");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdEqualTo(String value) {
            addCriterion("message_channel_id =", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdNotEqualTo(String value) {
            addCriterion("message_channel_id <>", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdGreaterThan(String value) {
            addCriterion("message_channel_id >", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdGreaterThanOrEqualTo(String value) {
            addCriterion("message_channel_id >=", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdLessThan(String value) {
            addCriterion("message_channel_id <", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdLessThanOrEqualTo(String value) {
            addCriterion("message_channel_id <=", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdLike(String value) {
            addCriterion("message_channel_id like", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdNotLike(String value) {
            addCriterion("message_channel_id not like", value, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdIn(List<String> values) {
            addCriterion("message_channel_id in", values, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdNotIn(List<String> values) {
            addCriterion("message_channel_id not in", values, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdBetween(String value1, String value2) {
            addCriterion("message_channel_id between", value1, value2, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageChannelIdNotBetween(String value1, String value2) {
            addCriterion("message_channel_id not between", value1, value2, "messageChannelId");
            return (Criteria) this;
        }

        public Criteria andMessageFromIsNull() {
            addCriterion("message_from is null");
            return (Criteria) this;
        }

        public Criteria andMessageFromIsNotNull() {
            addCriterion("message_from is not null");
            return (Criteria) this;
        }

        public Criteria andMessageFromEqualTo(String value) {
            addCriterion("message_from =", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromNotEqualTo(String value) {
            addCriterion("message_from <>", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromGreaterThan(String value) {
            addCriterion("message_from >", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromGreaterThanOrEqualTo(String value) {
            addCriterion("message_from >=", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromLessThan(String value) {
            addCriterion("message_from <", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromLessThanOrEqualTo(String value) {
            addCriterion("message_from <=", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromLike(String value) {
            addCriterion("message_from like", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromNotLike(String value) {
            addCriterion("message_from not like", value, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromIn(List<String> values) {
            addCriterion("message_from in", values, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromNotIn(List<String> values) {
            addCriterion("message_from not in", values, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromBetween(String value1, String value2) {
            addCriterion("message_from between", value1, value2, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageFromNotBetween(String value1, String value2) {
            addCriterion("message_from not between", value1, value2, "messageFrom");
            return (Criteria) this;
        }

        public Criteria andMessageToIsNull() {
            addCriterion("message_to is null");
            return (Criteria) this;
        }

        public Criteria andMessageToIsNotNull() {
            addCriterion("message_to is not null");
            return (Criteria) this;
        }

        public Criteria andMessageToEqualTo(String value) {
            addCriterion("message_to =", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToNotEqualTo(String value) {
            addCriterion("message_to <>", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToGreaterThan(String value) {
            addCriterion("message_to >", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToGreaterThanOrEqualTo(String value) {
            addCriterion("message_to >=", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToLessThan(String value) {
            addCriterion("message_to <", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToLessThanOrEqualTo(String value) {
            addCriterion("message_to <=", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToLike(String value) {
            addCriterion("message_to like", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToNotLike(String value) {
            addCriterion("message_to not like", value, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToIn(List<String> values) {
            addCriterion("message_to in", values, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToNotIn(List<String> values) {
            addCriterion("message_to not in", values, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToBetween(String value1, String value2) {
            addCriterion("message_to between", value1, value2, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageToNotBetween(String value1, String value2) {
            addCriterion("message_to not between", value1, value2, "messageTo");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeIsNull() {
            addCriterion("message_create_datatime is null");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeIsNotNull() {
            addCriterion("message_create_datatime is not null");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeEqualTo(java.util.Date value) {
            addCriterion("message_create_datatime =", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeNotEqualTo(java.util.Date value) {
            addCriterion("message_create_datatime <>", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeGreaterThan(java.util.Date value) {
            addCriterion("message_create_datatime >", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeGreaterThanOrEqualTo(java.util.Date value) {
            addCriterion("message_create_datatime >=", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeLessThan(java.util.Date value) {
            addCriterion("message_create_datatime <", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeLessThanOrEqualTo(java.util.Date value) {
            addCriterion("message_create_datatime <=", value, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeIn(List<java.util.Date> values) {
            addCriterion("message_create_datatime in", values, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeNotIn(List<java.util.Date> values) {
            addCriterion("message_create_datatime not in", values, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("message_create_datatime between", value1, value2, "messageCreateDatatime");
            return (Criteria) this;
        }

        public Criteria andMessageCreateDatatimeNotBetween(java.util.Date value1, java.util.Date value2) {
            addCriterion("message_create_datatime not between", value1, value2, "messageCreateDatatime");
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