package com.alisa.interceptors;

import com.alisa.model.UserContext;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

/** Delegates JWT validation to the independent user service without sharing its signing key. */
public class UserServiceAuthenticationInterceptor implements HandlerInterceptor {
    private final URI profileUri;
    private final URI tenantsUri;
    private final String writeTenantId;
    private final com.alisa.security.TokenVerifier oauth;
    private final HttpClient http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(3))
        .followRedirects(HttpClient.Redirect.NEVER).build();
    private final ObjectMapper json = new ObjectMapper();

    public UserServiceAuthenticationInterceptor(String baseUrl) {
        this(baseUrl, "");
    }

    public UserServiceAuthenticationInterceptor(String baseUrl, String writeTenantId) {
        this(baseUrl, writeTenantId, null);
    }

    public UserServiceAuthenticationInterceptor(String baseUrl, String writeTenantId, com.alisa.security.TokenVerifier oauth) {
        this.oauth = oauth;
        String userApi = baseUrl.replaceAll("/+$", "") + "/api/v1/user";
        profileUri = URI.create(userApi + "/profile");
        tenantsUri = URI.create(userApi + "/tenants");
        this.writeTenantId = writeTenantId;
        if (profileUri.getHost() == null || profileUri.getRawUserInfo() != null
            || !("https".equals(profileUri.getScheme()) || "http".equals(profileUri.getScheme()))) {
            throw new IllegalArgumentException("USER_SERVICE_BASE_URL must be an HTTP(S) gateway URL");
        }
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        UserContext.remove();
        String authorization = request.getHeader("Authorization");
        boolean checkMembership = !writeTenantId.isEmpty() && requiresWriteMembership(request);
        if (authorization == null || authorization.isBlank()) {
            return !checkMembership || failure(response, 401, "请登录后再修改社区内容");
        }
        if (!authorization.startsWith("Bearer ") || authorization.length() > 16384)
            return failure(response, 401, "登录凭据无效，请重新登录");
        if (authorization.substring(7).indexOf('.') < 0) {
            return authenticateOAuth(request, response, authorization);
        }
        var parts = authorization.substring(7).split("\\.", -1);
        if (parts.length != 3) return failure(response, 401, "登录凭据无效，请重新登录");

        HttpResponse<String> verified;
        try {
            verified = http.send(HttpRequest.newBuilder(profileUri).timeout(Duration.ofSeconds(5))
                .header("Authorization", authorization).header("Accept", "application/json")
                .GET().build(), HttpResponse.BodyHandlers.ofString());
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            return failure(response, 503, "用户服务暂时不可用，请稍后重试");
        } catch (Exception error) {
            return failure(response, 503, "用户服务暂时不可用，请稍后重试");
        }
        if (verified.statusCode() == 401 || verified.statusCode() == 403)
            return failure(response, 401, "登录已失效，请重新登录");
        if (verified.statusCode() != 200)
            return failure(response, 503, "用户服务暂时不可用，请稍后重试");
        try {
            var profile = json.readTree(verified.body());
            if (profile.path("code").asInt() != 200 || profile.path("data").path("username").asText().isBlank())
                return failure(response, 503, "用户服务返回了无效的身份信息");
            // Decode claims only after the authority has validated this exact bearer token.
            var claims = json.readTree(Base64.getUrlDecoder().decode(parts[1]));
            String id = claims.path("userId").asText();
            String username = claims.path("sub").asText();
            if (id.isBlank() || !username.equals(profile.path("data").path("username").asText())
                || claims.path("exp").asLong() <= Instant.now().getEpochSecond())
                return failure(response, 401, "登录凭据无效，请重新登录");
            if (checkMembership && !checkWriteMembership(authorization, response)) return false;
            var user = new UserContext();
            user.setUserId(id);
            user.setUsername(username);
            user.setTenantId(claims.path("tenantId").asText(""));
            UserContext.set(user);
            return true;
        } catch (Exception error) {
            return failure(response, 401, "登录凭据无效，请重新登录");
        }
    }

    private boolean authenticateOAuth(HttpServletRequest request, HttpServletResponse response,
                                      String authorization) throws Exception {
        if (oauth == null) return failure(response, 401, "当前服务尚未配置 Alisa OAuth");
        try {
            var identity = oauth.verify(authorization, "science-community");
            if (identity.application() || identity.userId() == null || identity.userId().isBlank()) {
                return failure(response, 403, "社区操作需要用户身份");
            }
            if (identity.tenantId().isBlank() ||
                !writeTenantId.isBlank() && !writeTenantId.equals(identity.tenantId())) {
                return failure(response, 403, "访问令牌不属于当前社区租户");
            }
            String action = requiresWriteMembership(request) ? "write" : "read";
            oauth.require(identity, authorization, "science-community", "community", "*", action);
            var user = new UserContext();
            user.setUserId(identity.userId());
            user.setUsername(identity.username());
            user.setTenantId(identity.tenantId());
            UserContext.set(user);
            return true;
        } catch (com.alisa.security.AccessFailure error) {
            return failure(response, error.status(), switch (error.status()) {
                case 401 -> "登录已失效，请重新登录";
                case 403 -> "当前授权范围或租户权限不足";
                default -> "Alisa 授权服务暂时不可用";
            });
        }
    }

    private boolean requiresWriteMembership(HttpServletRequest request) {
        return switch (request.getMethod()) {
            case "GET", "HEAD", "OPTIONS" -> false;
            // Resolves signed read URLs for public content without changing stored data.
            case "POST" -> !"/storage/read-urls".equals(request.getRequestURI().substring(request.getContextPath().length()));
            default -> true;
        };
    }

    private boolean checkWriteMembership(String authorization, HttpServletResponse response) throws Exception {
        try {
            var result = http.send(HttpRequest.newBuilder(tenantsUri).timeout(Duration.ofSeconds(5))
                .header("Authorization", authorization).header("Accept", "application/json")
                .GET().build(), HttpResponse.BodyHandlers.ofString());
            if (result.statusCode() == 401) return failure(response, 401, "登录已失效，请重新登录");
            if (result.statusCode() == 403) return failure(response, 403, "当前账号无权修改社区内容");
            if (result.statusCode() == 200) {
                var tenants = json.readTree(result.body());
                if (tenants != null && tenants.isArray()) {
                    for (var tenant : tenants) {
                        if (writeTenantId.equals(tenant.path("id").asText()) && tenant.path("enabled").asBoolean()) {
                            return true;
                        }
                    }
                    return failure(response, 403, "请加入社区租户后再修改内容");
                }
            }
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
        } catch (java.io.IOException error) {
            // Fail closed if membership cannot be verified.
        }
        return failure(response, 503, "暂时无法确认社区租户权限，请稍后重试");
    }

    private boolean failure(HttpServletResponse response, int status, String message) throws Exception {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        json.writeValue(response.getWriter(), java.util.Map.of("code", status, "message", message));
        return false;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception error) {
        UserContext.remove();
    }
}
