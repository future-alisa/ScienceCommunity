import io.minio.*;
import io.minio.http.Method;
import java.nio.file.*;
import java.io.*;
import java.util.*;
import java.nio.charset.StandardCharsets;

// Isolated fixture: never changes bucket policy or existing objects.
class StorageSmoke {
    public static void main(String[] args) throws Exception {
        var settings = new Properties();
        try (var reader = Files.newBufferedReader(Path.of(args[0]), StandardCharsets.UTF_8)) { settings.load(reader); }
        var client = MinioClient.builder().endpoint(settings.getProperty("S3_ENDPOINT"))
            .region(settings.getProperty("S3_REGION", "us-east-1"))
            .credentials(settings.getProperty("S3_ACCESS_KEY_ID"), settings.getProperty("S3_SECRET_ACCESS_KEY")).build();
        client.setTimeout(15000, 20000, 20000);
        String bucket = settings.getProperty("S3_BUCKET");
        String key = "attachments/covers/" + UUID.randomUUID().toString().replace("-", "") + ".txt";
        byte[] data = "science-community-storage-smoke".getBytes(StandardCharsets.UTF_8);
        boolean written = false;
        try {
            client.putObject(PutObjectArgs.builder().bucket(bucket).object(key).stream(new ByteArrayInputStream(data), data.length, -1).contentType("text/plain").build());
            written = true;
            System.out.println("PASS: authenticated SeaweedFS upload");
            try (var result = client.getObject(GetObjectArgs.builder().bucket(bucket).object(key).build())) {
                if (!Arrays.equals(data, result.readAllBytes())) throw new IllegalStateException("Content mismatch");
            }
            System.out.println("PASS: authenticated read matches uploaded content");
            String signed = client.getPresignedObjectUrl(GetPresignedObjectUrlArgs.builder().bucket(bucket).object(key).method(Method.GET).expiry(60).build());
            var http = java.net.http.HttpClient.newBuilder().proxy(new java.net.ProxySelector() {
                public java.util.List<java.net.Proxy> select(java.net.URI uri) { return java.util.List.of(java.net.Proxy.NO_PROXY); }
                public void connectFailed(java.net.URI uri, java.net.SocketAddress address, IOException error) { }
            }).build();
            var response = http.send(java.net.http.HttpRequest.newBuilder(java.net.URI.create(signed)).GET().build(), java.net.http.HttpResponse.BodyHandlers.ofByteArray());
            if (response.statusCode() != 200 || !Arrays.equals(data, response.body())) throw new IllegalStateException("Signed read failed: " + response.statusCode());
            System.out.println("PASS: presigned URL read");
        } finally {
            try {
                if (written) {
                    client.removeObject(RemoveObjectArgs.builder().bucket(bucket).object(key).build());
                    System.out.println("PASS: temporary object removed");
                }
            } finally { client.close(); }
        }
    }
}
