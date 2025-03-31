package com.alisa.dto;

import java.util.HashMap;
import java.util.Map;

public class Criteria {
    // 存储查询条件的 Map
    private Map<String, Object> conditions = new HashMap<>();

    // 添加查询条件
    public Criteria addCondition(String field, Object value) {
        if (value != null) {
            conditions.put(field, value);
        }
        return this;
    }

    // 获取查询条件
    public Map<String, Object> getConditions() {
        return conditions;
    }

    // 判断是否为空条件
    public boolean isEmpty() {
        return conditions.isEmpty();
    }
}
