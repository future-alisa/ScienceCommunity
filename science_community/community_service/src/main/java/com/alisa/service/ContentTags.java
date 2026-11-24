package com.alisa.service;

import com.alisa.mapper.ContentTagMapper;
import com.alisa.mapper.ManagementMapper;
import com.alisa.model.Community;
import com.alisa.model.Document;
import com.alisa.util.UUIDTool;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.UUID;

@Service
public class ContentTags {
    private final ContentTagMapper tags;
    private final ManagementMapper management;

    public ContentTags(ContentTagMapper tags, ManagementMapper management) {
        this.tags = tags;
        this.management = management;
    }

    public List<Community> loadCommunities(List<Community> communities) {
        if (communities.isEmpty()) return communities;
        var names = group(tags.communityTags(communities.stream().map(Community::getCommunityId).toList()));
        communities.forEach(item -> item.setTags(names.getOrDefault(item.getCommunityId(), List.of())));
        return communities;
    }

    public List<Document> loadDocuments(List<Document> documents) {
        if (documents.isEmpty()) return documents;
        var names = group(tags.documentTags(documents.stream().map(Document::getDocumentId).toList()));
        documents.forEach(item -> item.setTags(names.getOrDefault(item.getDocumentId(), List.of())));
        return documents;
    }

    private Map<String, List<String>> group(List<ContentTagMapper.Assignment> assignments) {
        var grouped = new HashMap<String, LinkedHashSet<String>>();
        for (var assignment : assignments) {
            grouped.computeIfAbsent(assignment.contentId(), id -> new LinkedHashSet<>()).add(assignment.tagName());
        }
        var names = new HashMap<String, List<String>>();
        grouped.forEach((id, labels) -> names.put(id, List.copyOf(labels)));
        return names;
    }

    public void saveCommunity(Community community, String owner) {
        if (community.getTags() != null) {
            String id = community.getCommunityId();
            var tagIds = resolve(community.getTags(), owner);
            management.deleteCommunityTags(id);
            tagIds.forEach(tagId -> tags.linkCommunity(UUIDTool.getUUID(), id, tagId));
        }
    }

    public void saveDocument(Document document, String owner) {
        if (document.getTags() != null) {
            String id = document.getDocumentId();
            var tagIds = resolve(document.getTags(), owner);
            management.deleteDocumentTags(id);
            tagIds.forEach(tagId -> tags.linkDocument(UUIDTool.getUUID(), id, tagId));
        }
    }

    private List<String> resolve(List<String> names, String owner) {
        var normalized = new TreeMap<String, String>();
        for (String name : names) {
            if (name == null || name.isBlank() || name.strip().length() > 100) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "标签须为 1 至 100 个字符");
            }
            String label = Normalizer.normalize(name.strip(), Normalizer.Form.NFC);
            normalized.putIfAbsent(label.toLowerCase(Locale.ROOT), label);
        }
        if (normalized.size() > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "最多可添加 10 个标签");
        }
        var ids = new LinkedHashSet<String>();
        normalized.forEach((key, name) -> {
            String id = tags.findTagId(name);
            if (id == null) {
                // A stable ID lets concurrent saves reuse a newly created tag.
                id = UUID.nameUUIDFromBytes(("content-tag:" + key).getBytes(StandardCharsets.UTF_8))
                    .toString().replace("-", "");
                tags.ensureTag(id, name, owner);
            }
            ids.add(id);
        });
        return List.copyOf(ids);
    }
}
