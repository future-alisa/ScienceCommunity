package com.alisa.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.http.Method;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class ObjectStorageService {
    private final CommunityAccessService access;
    private final Environment env;
    private final Set<String> allowed = Set.of("image/png", "image/jpeg", "image/gif", "image/webp", "image/avif",
        "application/pdf", "text/plain", "text/markdown", "application/zip", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    public ObjectStorageService(CommunityAccessService access, Environment env) { this.access = access; this.env = env; }

    public Map<String, Object> upload(MultipartFile file, String communityId) {
        return upload(file, communityId, "attachment");
    }
    public Map<String, Object> upload(MultipartFile file, String communityId, String purpose) {
        if (!Set.of("attachment", "document-cover", "community-cover").contains(purpose == null ? "" : purpose)) throw failure(HttpStatus.BAD_REQUEST, "无效的上传用途");
        boolean communityCover = "community-cover".equals(purpose);
        boolean cover = !"attachment".equals(purpose);
        access.userId();
        if ("document-cover".equals(purpose) && communityId == null) throw failure(HttpStatus.BAD_REQUEST, "请选择目标社区");
        if (communityId != null) {
            if (!communityId.matches("[a-fA-F0-9]{32}")) throw failure(HttpStatus.BAD_REQUEST, "无效的社区");
            access.requireMember(communityId);
            if (communityCover) access.requireManager(communityId);
        }
        if (file == null || file.isEmpty()) throw failure(HttpStatus.BAD_REQUEST, "请选择非空文件");
        if (file.getSize() > 20L * 1024 * 1024) throw failure(HttpStatus.PAYLOAD_TOO_LARGE, "附件不能超过20MB");
        if (cover && file.getSize() > 5L * 1024 * 1024) throw failure(HttpStatus.PAYLOAD_TOO_LARGE, "封面不能超过5MB");
        String name = file.getOriginalFilename() == null ? "attachment" : file.getOriginalFilename();
        String type = file.getContentType();
        if ("application/x-zip-compressed".equals(type)) type = "application/zip";
        if (type == null || type.isBlank() || "application/octet-stream".equals(type)) {
            type = name.toLowerCase(java.util.Locale.ROOT).endsWith(".md") ? "text/markdown" : name.toLowerCase(java.util.Locale.ROOT).endsWith(".txt") ? "text/plain" : "";
        }
        if (!allowed.contains(type)) throw failure(HttpStatus.BAD_REQUEST, "支持图片、PDF、TXT、Markdown、DOCX 和 ZIP，暂不支持此格式");
        if (cover && !type.startsWith("image/")) throw failure(HttpStatus.BAD_REQUEST, "封面只支持图片");
        String endpoint = setting("S3_ENDPOINT"), bucket = setting("S3_BUCKET"), publicUrl = setting("S3_PUBLIC_URL");
        String keyId = setting("S3_ACCESS_KEY_ID"), secret = setting("S3_SECRET_ACCESS_KEY");
        var suffix = java.util.regex.Pattern.compile("\\.([a-zA-Z0-9]{1,8})$").matcher(name);
        String key = "attachments/" + (communityCover || communityId == null ? "covers" : communityId) + "/" + UUID.randomUUID().toString().replace("-", "") + "." + (suffix.find() ? suffix.group(1).toLowerCase(java.util.Locale.ROOT) : "bin");
        try (var stream = file.getInputStream(); var client = MinioClient.builder().endpoint(endpoint)
            .region(env.getProperty("S3_REGION", "us-east-1")).credentials(keyId, secret).build()) {
            client.setTimeout(15000, 60000, 60000);
            client.putObject(PutObjectArgs.builder().bucket(bucket).object(key).stream(stream, file.getSize(), -1).contentType(type)
                .headers(Map.of("Content-Disposition", (type.startsWith("image/") || type.equals("application/pdf") ? "inline" : "attachment")
                    + "; filename*=UTF-8''" + URLEncoder.encode(name, StandardCharsets.UTF_8).replace("+", "%20"))).build());
            return Map.of("url", publicUrl.replaceAll("/+$", "") + "/" + key, "name", name, "type", type, "size", file.getSize());
        } catch (Exception ex) {
            throw failure(HttpStatus.SERVICE_UNAVAILABLE, "附件上传失败，请检查对象存储连接和写入权限");
        }
    }
    public Map<String, String> readUrl(String url) {
        if (url == null) throw failure(HttpStatus.BAD_REQUEST, "无效的附件地址");
        return Map.of("url", readUrls(java.util.List.of(url)).get(url));
    }
    public Map<String, String> readUrls(java.util.List<String> urls) {
        access.userId();
        if (urls == null || urls.isEmpty() || urls.size() > 50) throw failure(HttpStatus.BAD_REQUEST, "一次最多获取50个附件地址");
        String prefix = setting("S3_PUBLIC_URL").replaceAll("/+$", "") + "/";
        var keys = new java.util.LinkedHashMap<String, String>();
        var checked = new java.util.HashSet<String>();
        for (String url : urls) {
            if (url == null || !url.startsWith(prefix)) throw failure(HttpStatus.BAD_REQUEST, "无效的附件地址");
            String key = url.substring(prefix.length());
            if (!key.matches("attachments/(covers|[a-fA-F0-9]{32})/[a-f0-9]{32}\\.[a-z0-9]{1,8}")) throw failure(HttpStatus.BAD_REQUEST, "无效的附件地址");
            String scope = key.split("/")[1];
            if (!scope.equals("covers") && checked.add(scope)) access.requireMember(scope);
            keys.put(url, key);
        }
        try (var client = MinioClient.builder().endpoint(setting("S3_ENDPOINT"))
                .region(env.getProperty("S3_REGION", "us-east-1")).credentials(setting("S3_ACCESS_KEY_ID"), setting("S3_SECRET_ACCESS_KEY")).build()) {
            var result = new java.util.LinkedHashMap<String, String>();
            for (var entry : keys.entrySet()) result.put(entry.getKey(), client.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder().bucket(setting("S3_BUCKET"))
                .object(entry.getValue()).method(Method.GET).expiry(600).build()));
            return result;
        } catch (ResponseStatusException ex) { throw ex; }
        catch (Exception ex) { throw failure(HttpStatus.SERVICE_UNAVAILABLE, "无法获取附件访问地址"); }
    }
    private String setting(String name) {
        String value = env.getProperty(name);
        if (value == null || value.isBlank()) throw failure(HttpStatus.SERVICE_UNAVAILABLE, "对象存储尚未配置，请在 Java 服务端配置 S3 环境变量");
        return value;
    }
    private ResponseStatusException failure(HttpStatus status, String message) { return new ResponseStatusException(status, message); }
}
