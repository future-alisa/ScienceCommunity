package com.alisa.dto;

import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Data
public class Group {
    private String groupId;
    private String groupName;
    private Set<String> members = new HashSet<>();
}