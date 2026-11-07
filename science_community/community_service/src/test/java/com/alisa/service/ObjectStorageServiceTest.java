package com.alisa.service;

import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ObjectStorageServiceTest {
    @Test void batchSigningChecksEachCommunityOnceAndRejectsOversizedBatches() {
        var access = mock(CommunityAccessService.class);
        var env = new MockEnvironment().withProperty("S3_ENDPOINT", "https://s3.example.org")
            .withProperty("S3_BUCKET", "test-bucket").withProperty("S3_REGION", "us-east-1")
            .withProperty("S3_ACCESS_KEY_ID", "server-key").withProperty("S3_SECRET_ACCESS_KEY", "server-secret")
            .withProperty("S3_PUBLIC_URL", "https://s3.example.org/test-bucket/");
        var service = new ObjectStorageService(access, env);
        String prefix="https://s3.example.org/test-bucket/attachments/"+"a".repeat(32)+"/";
        var urls=java.util.List.of(prefix+"b".repeat(32)+".png",prefix+"c".repeat(32)+".png");
        assertEquals(2,service.readUrls(urls).size());
        verify(access,times(1)).requireMember("a".repeat(32));
        assertThrows(ResponseStatusException.class,()->service.readUrls(java.util.Collections.nCopies(51,urls.get(0))));
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(access).requireMember("a".repeat(32));
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.readUrls(urls)).getStatusCode().value());
    }
    @Test void coversRequireImagesSizeLimitsAndCommunityManager() {
        var access = mock(CommunityAccessService.class);
        var service = new ObjectStorageService(access, new MockEnvironment());
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.upload(file("application/pdf"), null, "community-cover")).getStatusCode().value());
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), null, "document-cover")).getStatusCode().value());
        var large = mock(org.springframework.web.multipart.MultipartFile.class);
        when(large.getSize()).thenReturn(6L * 1024 * 1024);
        assertEquals(413, assertThrows(ResponseStatusException.class, () -> service.upload(large, null, "community-cover")).getStatusCode().value());
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(access).requireManager(anyString());
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), "a".repeat(32), "community-cover")).getStatusCode().value());
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), null, "bad-purpose")).getStatusCode().value());
    }
    private MockMultipartFile file(String type) { return new MockMultipartFile("file", "fixture.png", type, "fixture".getBytes(StandardCharsets.UTF_8)); }
    @Test void authenticationAndMembershipAreRequiredBeforeStorage() {
        var access = mock(CommunityAccessService.class);
        var service = new ObjectStorageService(access, new MockEnvironment());
        when(access.userId()).thenThrow(new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        assertEquals(401, assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), null)).getStatusCode().value());
        reset(access);
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(access).requireMember(anyString());
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), "a".repeat(32))).getStatusCode().value());
    }
    @Test void invalidFilesAndMissingConfigurationFailClearly() {
        var service = new ObjectStorageService(mock(CommunityAccessService.class), new MockEnvironment());
        assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.upload(file("text/html"), null)).getStatusCode().value());
        var large = mock(org.springframework.web.multipart.MultipartFile.class);
        when(large.getSize()).thenReturn(21L * 1024 * 1024);
        assertEquals(413, assertThrows(ResponseStatusException.class, () -> service.upload(large, null)).getStatusCode().value());
        assertTrue(assertThrows(ResponseStatusException.class, () -> service.upload(file("image/png"), null)).getReason().contains("尚未配置"));
    }
    @Test void writesSignedS3RequestAndReturnsOnlyFileMetadata() throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        var path = new AtomicReference<String>();
        var auth = new AtomicReference<String>();
        server.createContext("/", exchange -> {
            path.set(exchange.getRequestURI().getPath()); auth.set(exchange.getRequestHeaders().getFirst("Authorization"));
            exchange.getRequestBody().readAllBytes();
            exchange.getResponseHeaders().set("ETag", "\"fixture\"");
            exchange.sendResponseHeaders(200, -1); exchange.close();
        });
        server.start();
        try {
            var env = new MockEnvironment().withProperty("S3_ENDPOINT", "http://127.0.0.1:" + server.getAddress().getPort())
                .withProperty("S3_BUCKET", "test-bucket").withProperty("S3_REGION", "garage")
                .withProperty("S3_ACCESS_KEY_ID", "server-key").withProperty("S3_SECRET_ACCESS_KEY", "server-secret")
                .withProperty("S3_PUBLIC_URL", "https://files.example.org/test-bucket/");
            var result = new ObjectStorageService(mock(CommunityAccessService.class), env).upload(file("image/png"), null);
            assertTrue(path.get().matches("/test-bucket/attachments/covers/[a-f0-9]{32}\\.png"));
            assertTrue(auth.get().startsWith("AWS4-HMAC-SHA256"));
            assertTrue(result.get("url").toString().startsWith("https://files.example.org/test-bucket/attachments/"));
            assertFalse(result.toString().contains("server-secret"));
            assertFalse(result.toString().contains("server-key"));
        } finally { server.stop(0); }
    }
    @Test void signedReadsCheckScopeAndRejectArbitraryKeys() {
        var access = mock(CommunityAccessService.class);
        var env = new MockEnvironment().withProperty("S3_ENDPOINT", "https://s3.example.org")
            .withProperty("S3_BUCKET", "test-bucket").withProperty("S3_REGION", "us-east-1")
            .withProperty("S3_ACCESS_KEY_ID", "server-key").withProperty("S3_SECRET_ACCESS_KEY", "server-secret")
            .withProperty("S3_PUBLIC_URL", "https://s3.example.org/test-bucket/");
        var service = new ObjectStorageService(access, env);
        String url = "https://s3.example.org/test-bucket/attachments/" + "a".repeat(32) + "/" + "b".repeat(32) + ".png";
        String signed = service.readUrl(url).get("url");
        assertTrue(signed.contains("X-Amz-Signature="));
        verify(access).requireMember("a".repeat(32));
        assertFalse(signed.contains("server-secret"));
        assertThrows(ResponseStatusException.class, () -> service.readUrl("https://evil.example/anything"));
        assertThrows(ResponseStatusException.class, () -> service.readUrl("https://s3.example.org/test-bucket/../secret"));
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(access).requireMember(anyString());
        assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.readUrl(url)).getStatusCode().value());
    }
    @Test void browserProxyUsesPublicPathWhileSigningWithTheInternalEndpoint() {
        var access = mock(CommunityAccessService.class);
        var env = new MockEnvironment().withProperty("S3_ENDPOINT", "https://s3.internal.example")
            .withProperty("S3_BUCKET", "test-bucket").withProperty("S3_REGION", "us-east-1")
            .withProperty("S3_ACCESS_KEY_ID", "server-key").withProperty("S3_SECRET_ACCESS_KEY", "server-secret")
            .withProperty("S3_PUBLIC_URL", "https://old.example/test-bucket/")
            .withProperty("S3_DOWNLOAD_PROXY_URL", "https://files.example/s3/");
        String key = "attachments/" + "a".repeat(32) + "/" + "b".repeat(32) + ".webp";
        String savedUrl = "https://old.example/test-bucket/" + key;
        var service = new ObjectStorageService(access, env);
        var signed = java.net.URI.create(service.readUrl(savedUrl).get("url"));
        assertEquals("files.example", signed.getHost());
        assertEquals("/s3/test-bucket/" + key, signed.getRawPath());
        assertTrue(signed.getRawQuery().contains("X-Amz-Signature="));
        assertTrue(signed.getRawQuery().contains("X-Amz-SignedHeaders=host"));
        verify(access).requireMember("a".repeat(32));
        assertThrows(ResponseStatusException.class, () -> service.readUrl("https://files.example/s3/test-bucket/" + key));
        env.setProperty("S3_DOWNLOAD_PROXY_URL", "https://files.example/s3?unexpected=value");
        assertEquals(503, assertThrows(ResponseStatusException.class, () -> service.readUrl(savedUrl)).getStatusCode().value());
    }
}
