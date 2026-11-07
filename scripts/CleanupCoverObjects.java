import io.minio.*;
import java.nio.file.*;
import java.util.*;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
class CleanupCoverObjects {
    public static void main(String[] args) throws Exception {
        var env=new Properties();
        try(var reader=Files.newBufferedReader(Path.of(args[0]),StandardCharsets.UTF_8)){env.load(reader);}
        String prefix=env.getProperty("S3_PUBLIC_URL").replaceAll("/+$", "")+"/";
        var json=new ObjectMapper();
        var urls=json.readTree(Files.readString(Path.of(args[1]),StandardCharsets.UTF_8).replace("\uFEFF",""));
        try(var client=MinioClient.builder().endpoint(env.getProperty("S3_ENDPOINT")).region(env.getProperty("S3_REGION","us-east-1"))
            .credentials(env.getProperty("S3_ACCESS_KEY_ID"),env.getProperty("S3_SECRET_ACCESS_KEY")).build()) {
            for(var entry: urls) {
                String url=entry.asText();
                if(!url.startsWith(prefix))throw new IllegalArgumentException("Unexpected fixture origin");
                String key=url.substring(prefix.length());
                if(!key.matches("attachments/(covers|[a-f0-9]{32})/[a-f0-9]{32}\\.png"))throw new IllegalArgumentException("Unexpected fixture key");
                client.removeObject(RemoveObjectArgs.builder().bucket(env.getProperty("S3_BUCKET")).object(key).build());
                System.out.println("PASS: temporary cover object removed");
            }
        }
    }
}
