package com.alisa.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** One Slate JSON format for every document category, including legacy list conversion. */
public final class DocumentContentCodec {
    public static final int MAX_BYTES = 1024 * 1024;
    private static final Set<String> TYPES = Set.of("paragraph", "heading", "block-quote", "code-block", "bulleted-list", "numbered-list");
    public static String normalize(String source, ObjectMapper mapper) {
        if (source == null || source.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "文档正文不能为空，且不能超过1MB");
        try {
            JsonNode root = mapper.reader().with(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readTree(source);
            if (root == null || !root.isArray() || root.isEmpty()) throw new IllegalArgumentException();
            boolean nonBlank = false;
            for (JsonNode block : root) { validate(block, false, 0); nonBlank |= hasText(block); }
            if (!nonBlank) throw new IllegalArgumentException();
            return mapper.writeValueAsString(root);
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "正文必须是有效的统一文档格式，且至少包含一段非空文字");
        }
    }
    private static boolean hasText(JsonNode node) {
        if (Set.of("image", "attachment", "document-reference").contains(node.path("type").asText())) return true;
        if (node.has("text")) return !node.get("text").asText().isBlank();
        for (JsonNode child : node.get("children")) if (hasText(child)) return true;
        return false;
    }
    private static void validate(JsonNode node, boolean text, int depth) {
        if (depth > 50 || !node.isObject()) throw new IllegalArgumentException();
        if (text) {
            if (!node.path("text").isTextual() || node.has("children") || node.has("type")) throw new IllegalArgumentException();
            for (String mark : Set.of("bold", "italic", "underline", "code"))
                if (node.has(mark) && !node.get(mark).isBoolean()) throw new IllegalArgumentException();
            if (node.has("url") && !safeUrl(node.get("url").asText())) throw new IllegalArgumentException();
            return;
        }
        if (node.has("text")) throw new IllegalArgumentException();
        String type = node.path("type").asText();
        if (Set.of("image", "attachment", "document-reference").contains(type)) {
            if (!node.path("name").isTextual() || node.get("name").asText().length()>255 || !node.path("children").isArray() || node.get("children").size()!=1) throw new IllegalArgumentException();
            validate(node.get("children").get(0),true,depth+1);
            if (!node.get("children").get(0).get("text").asText().isEmpty()) throw new IllegalArgumentException();
            if ("document-reference".equals(type)) {
                if (!node.path("documentId").isTextual() || !node.get("documentId").asText().matches("[a-fA-F0-9]{32}")) throw new IllegalArgumentException();
            } else if (!node.path("url").isTextual() || !safeUrl(node.get("url").asText())) throw new IllegalArgumentException();
            return;
        }
        if ("list".equals(type)) { ((ObjectNode) node).put("type", "bulleted-list"); type = "bulleted-list"; }
        if (!TYPES.contains(type) && !(depth > 0 && "list-item".equals(type))) throw new IllegalArgumentException();
        if (node.has("align") && !Set.of("left", "center", "right", "justify").contains(node.get("align").asText())) throw new IllegalArgumentException();
        if ("heading".equals(type) && (!node.path("level").isInt() || node.get("level").intValue()<1 || node.get("level").intValue()>6)) throw new IllegalArgumentException();
        if ("code-block".equals(type) && node.has("language") && (!node.get("language").isTextual() || !node.get("language").asText().matches("[\\w+-]{0,32}"))) throw new IllegalArgumentException();
        JsonNode children = node.get("children");
        if (children == null || !children.isArray() || children.isEmpty()) throw new IllegalArgumentException();
        boolean list = "bulleted-list".equals(type) || "numbered-list".equals(type);
        for (JsonNode child : children) {
            if (list && !"list-item".equals(child.path("type").asText())) throw new IllegalArgumentException();
            validate(child, !list, depth+1);
        }
    }
    private static boolean safeUrl(String value) {
        if (value.length()>2048 || value.chars().anyMatch(c->c<=32 || c==127)) return false;
        try { var uri=java.net.URI.create(value); return uri.getScheme()!=null && Set.of("http","https").contains(uri.getScheme().toLowerCase(java.util.Locale.ROOT)) && uri.getHost()!=null && uri.getUserInfo()==null; }
        catch(Exception invalid) { return false; }
    }
}
