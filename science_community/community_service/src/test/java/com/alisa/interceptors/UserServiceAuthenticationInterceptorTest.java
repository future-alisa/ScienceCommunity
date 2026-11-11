package com.alisa.interceptors;

import com.alisa.model.UserContext;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.*;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceAuthenticationInterceptorTest {
    HttpServer server;
    UserServiceAuthenticationInterceptor interceptor;
    int upstreamStatus = 200;
    String receivedAuthorization;
    String memberships = "[]";
    int membershipStatus = 200;
    String oauthScopes = "science-community:community:read";
    String oauthTenant = "science-tenant";
    boolean oauthActive = true;
    String policyEffect = "PERMIT";
    String policyAuthorization;

    String profile = "{\"code\":200,\"data\":{\"username\":\"alice\"}}";

    @BeforeEach void startAuthority() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/gateway/api/v1/user/profile", exchange -> {
            receivedAuthorization = exchange.getRequestHeaders().getFirst("Authorization");
            byte[] bytes = profile.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(upstreamStatus, bytes.length);
            try (var body = exchange.getResponseBody()) { body.write(bytes); }
        });
        server.createContext("/gateway/api/v1/user/tenants", exchange -> {
            byte[] bytes = memberships.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(membershipStatus, bytes.length);
            try (var body = exchange.getResponseBody()) { body.write(bytes); }
        });
        server.createContext("/oauth2/introspect", exchange -> {
            String claims = "{\"active\":" + oauthActive +
                ",\"application_id\":\"science-community\",\"iss\":\"https://identity.example\"," +
                "\"aud\":\"science-community\",\"exp\":" + (Instant.now().getEpochSecond() + 300) +
                ",\"userId\":\"user-123\",\"username\":\"alice\",\"client_id\":\"web-client\"," +
                "\"identity_type\":\"user\",\"tenant_id\":\"" + oauthTenant + "\",\"scope\":\"" + oauthScopes + "\"}";
            byte[] bytes = claims.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, bytes.length);
            try (var body = exchange.getResponseBody()) { body.write(bytes); }
        });
        server.createContext("/authorization/check", exchange -> {
            policyAuthorization = exchange.getRequestHeaders().getFirst("Authorization");
            byte[] bytes = ("{\"data\":{\"effect\":\"" + policyEffect + "\"}}").getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200, bytes.length);
            try (var body = exchange.getResponseBody()) { body.write(bytes); }
        });
        server.start();
        interceptor = new UserServiceAuthenticationInterceptor("http://127.0.0.1:" + server.getAddress().getPort() + "/gateway/");
    }

    @AfterEach void stopAuthority() { server.stop(0); UserContext.remove(); }

    String token(long expiration) {
        String claims = "{\"userId\":\"user-123\",\"sub\":\"alice\",\"exp\":" + expiration + "}";
        return "Bearer header." + Base64.getUrlEncoder().withoutPadding().encodeToString(claims.getBytes(StandardCharsets.UTF_8)) + ".signature";
    }

    @Test void establishesIdentityOnlyAfterAuthorityAcceptsTokenAndCleansUp() throws Exception {
        var request = new MockHttpServletRequest();
        String token = token(Instant.now().getEpochSecond() + 300);
        request.addHeader("Authorization", token);
        var response = new MockHttpServletResponse();
        assertTrue(interceptor.preHandle(request, response, new Object()));
        assertEquals(token, receivedAuthorization);
        assertEquals("user-123", UserContext.get().getUserId());
        interceptor.afterCompletion(request, response, new Object(), null);
        assertNull(UserContext.get());
    }

    @Test void anonymousRequestsCannotReuseGatewayHeaderOrPreviousThreadIdentity() throws Exception {
        var forged = new UserContext(); forged.setUserId("forged"); UserContext.set(forged);
        var request = new MockHttpServletRequest(); request.addHeader("X-User-Header", forged.toBase64Json());
        assertTrue(interceptor.preHandle(request, new MockHttpServletResponse(), new Object()));
        assertNull(UserContext.get());
        assertNull(receivedAuthorization);
    }

    @Test void decodableClaimsDoNotAuthenticateWhenAuthorityRejectsToken() throws Exception {
        upstreamStatus = 401;
        var request = new MockHttpServletRequest(); request.addHeader("Authorization", token(Instant.now().getEpochSecond() + 300));
        var response = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(request, response, new Object()));
        assertEquals(401, response.getStatus());
        assertNull(UserContext.get());
    }

    @Test void keepsPublicReadsOpenAndRequiresActiveTenantMembershipForWrites() throws Exception {
        interceptor = new UserServiceAuthenticationInterceptor(
            "http://127.0.0.1:" + server.getAddress().getPort() + "/gateway", "science");
        assertTrue(interceptor.preHandle(new MockHttpServletRequest("GET", "/document/getAll"),
            new MockHttpServletResponse(), new Object()));
        assertTrue(interceptor.preHandle(new MockHttpServletRequest("POST", "/storage/read-urls"),
            new MockHttpServletResponse(), new Object()));

        var write = new MockHttpServletRequest("POST", "/document/save");
        var anonymous = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(write, anonymous, new Object()));
        assertEquals(401, anonymous.getStatus());

        write.addHeader("Authorization", token(Instant.now().getEpochSecond() + 300));
        memberships = "[{\"id\":\"other\",\"enabled\":true},{\"id\":\"science\",\"enabled\":false}]";
        var forbidden = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(write, forbidden, new Object()));
        assertEquals(403, forbidden.getStatus());
        assertNull(UserContext.get());

        membershipStatus = 503;
        var unavailable = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(write, unavailable, new Object()));
        assertEquals(503, unavailable.getStatus());

        membershipStatus = 200;
        memberships = "[{\"id\":\"science\",\"enabled\":true}]";
        assertTrue(interceptor.preHandle(write, new MockHttpServletResponse(), new Object()));
        assertEquals("user-123", UserContext.get().getUserId());
    }

    @Test void upstreamFailureIsNotReportedAsExpiredLogin() throws Exception {
        upstreamStatus = 500;
        var request = new MockHttpServletRequest(); request.addHeader("Authorization", token(Instant.now().getEpochSecond() + 300));
        var response = new MockHttpServletResponse();
        assertFalse(interceptor.preHandle(request, response, new Object()));
        assertEquals(503, response.getStatus());
        assertNull(UserContext.get());
    }

    @Test void rejectsExpiredAndMismatchedIdentities() throws Exception {
        for (boolean expired : new boolean[]{true, false}) {
            if (!expired) profile = "{\"code\":200,\"data\":{\"username\":\"bob\"}}";
            var request = new MockHttpServletRequest();
            request.addHeader("Authorization", token(Instant.now().getEpochSecond() + (expired ? -10 : 300)));
            var response = new MockHttpServletResponse();
            assertFalse(interceptor.preHandle(request, response, new Object()));
            assertEquals(401, response.getStatus());
            assertNull(UserContext.get());
        }
    }
    UserServiceAuthenticationInterceptor oauthInterceptor() {
        String origin = "http://127.0.0.1:" + server.getAddress().getPort();
        var resource = new com.alisa.security.ResourceSecurityProperties.ResourceServer();
        resource.setIssuer("https://identity.example");
        resource.setIntrospectionUri(origin + "/oauth2/introspect");
        resource.setAuthorizationUri(origin + "/authorization/check");
        resource.setClientId("resource-client");
        resource.setClientSecret("test-only-secret");
        resource.setAllowInsecureLoopback(true);
        var properties = new com.alisa.security.ResourceSecurityProperties();
        properties.getResources().put("science-community", resource);
        return new UserServiceAuthenticationInterceptor(origin + "/gateway", "science-tenant",
            new com.alisa.security.TokenVerifier(properties));
    }

    @Test void oauthUsesVerifiedIdentityAndRequiresScopeAndTenantPolicy() throws Exception {
        var request = new MockHttpServletRequest("GET", "/community/community/getAllByUser");
        request.setContextPath("/community");
        request.addHeader("Authorization", "Bearer opaque-token");
        var response = new MockHttpServletResponse();
        assertTrue(oauthInterceptor().preHandle(request, response, new Object()));
        assertEquals("user-123", UserContext.get().getUserId());
        assertEquals("alice", UserContext.get().getUsername());
        assertEquals("science-tenant", UserContext.get().getTenantId());
        assertEquals("Bearer opaque-token", policyAuthorization);
        UserContext.remove();

        policyEffect = "DENY";
        response = new MockHttpServletResponse();
        assertFalse(oauthInterceptor().preHandle(request, response, new Object()));
        assertEquals(403, response.getStatus());
        assertNull(UserContext.get());
    }

    @Test void oauthReadScopeCannotWriteAndWrongTenantCannotRead() throws Exception {
        var request = new MockHttpServletRequest("POST", "/community/community/upsert");
        request.setContextPath("/community");
        request.addHeader("Authorization", "Bearer opaque-token");
        var response = new MockHttpServletResponse();
        assertFalse(oauthInterceptor().preHandle(request, response, new Object()));
        assertEquals(403, response.getStatus());
        assertNull(policyAuthorization);

        oauthTenant = "other-tenant";
        request.setMethod("GET");
        response = new MockHttpServletResponse();
        assertFalse(oauthInterceptor().preHandle(request, response, new Object()));
        assertEquals(403, response.getStatus());
    }

    @Test void revokedOAuthTokenDoesNotAuthenticate() throws Exception {
        oauthActive = false;
        var request = new MockHttpServletRequest("GET", "/community/community/getAllByUser");
        request.setContextPath("/community");
        request.addHeader("Authorization", "Bearer opaque-token");
        var response = new MockHttpServletResponse();
        assertFalse(oauthInterceptor().preHandle(request, response, new Object()));
        assertEquals(401, response.getStatus());
        assertNull(UserContext.get());
    }

}
