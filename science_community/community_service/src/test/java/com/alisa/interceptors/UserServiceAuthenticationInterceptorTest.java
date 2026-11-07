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
    String profile = "{\"code\":200,\"data\":{\"username\":\"alice\"}}";

    @BeforeEach void startAuthority() throws Exception {
        server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/gateway/api/v1/user/profile", exchange -> {
            receivedAuthorization = exchange.getRequestHeaders().getFirst("Authorization");
            byte[] bytes = profile.getBytes(StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(upstreamStatus, bytes.length);
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
}
