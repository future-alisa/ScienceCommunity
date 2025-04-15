package com.alisa.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

public class Criteria {
    protected List<Criterion> criteria = new ArrayList<>();
    private boolean valid = true;

    // XML 需要的 getter
    public List<Criterion> getCriteria() {
        return criteria;
    }

    public boolean isValid() {
        return valid && !criteria.isEmpty();
    }

    // 添加条件的方法
    public Criteria addCondition(String condition, Object value) {
        criteria.add(new Criterion(condition, value));
        return this;
    }

    // 配套的 Criterion 类
    @Data

    public class Criterion {
        private String condition;
        private Object value;
        private Object secondValue;
        private boolean noValue;
        private boolean singleValue;
        private boolean betweenValue;
        private boolean listValue;

        // 构造方法
        public Criterion(String condition) {
            this.condition = condition;
            this.noValue = true;
        }

        public Criterion(String condition, Object value) {
            this.condition = condition;
            this.value = value;
            this.singleValue = true;
        }
    }
}
