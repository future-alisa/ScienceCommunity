import java.nio.file.*;
import java.sql.*;
import java.util.*;
import com.fasterxml.jackson.databind.*;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.support.ResourcePropertySource;

/** Run from science_community with the community runtime classpath and fixture JSON paths.
 * Deletes only exact qa-prefixed identities recorded by the development smoke test.
 * Community fixtures must be cleaned first; no existing member accounts are deleted.
 */
class CleanupFlowAccounts {
    public static void main(String[] args) throws Exception {
        if (args.length == 0) throw new IllegalArgumentException("Provide exact fixture JSON paths");
        var accounts = new LinkedHashMap<String, String>();
        var json = new ObjectMapper();
        for (String file : args) {
            var root = json.readTree(Path.of(file).toFile());
            var users = root.has("users") ? root.get("users") : json.createArrayNode().add(root);
            for (var user : users) {
                String name = user.path("username").asText();
                String email = user.path("email").asText(name + "@example.invalid");
                if (!name.matches("qa[a-f0-9]{12}(_[0-3])?") || !email.equals(name + "@example.invalid"))
                    throw new IllegalArgumentException("Not an isolated test fixture");
                accounts.put(name, email);
            }
        }
        var environment = new StandardEnvironment();
        environment.getPropertySources().addLast(new ResourcePropertySource("file:community_service/.env"));
        int removed = 0;
        try (var connection = DriverManager.getConnection(environment.getRequiredProperty("MYSQL_URL"), environment.getRequiredProperty("MYSQL_USERNAME"), environment.getRequiredProperty("MYSQL_PASSWORD"))) {
            connection.setAutoCommit(false);
            try {
                for (var account : accounts.entrySet()) {
                    try (var check = connection.prepareStatement("select count(*) from tb_community_user m join db_user.tb_user u on u.user_id=m.user_id where u.user_name=? and u.user_email=?")) {
                        check.setString(1, account.getKey()); check.setString(2, account.getValue());
                        try (var rows = check.executeQuery()) {
                            rows.next(); if (rows.getInt(1) != 0) throw new IllegalStateException("Clean test memberships before deleting accounts");
                        }
                    }
                    try (var delete = connection.prepareStatement("delete from db_user.tb_user where user_name=? and user_email=?")) {
                        delete.setString(1, account.getKey()); delete.setString(2, account.getValue());
                        int count = delete.executeUpdate();
                        if (count > 1) throw new IllegalStateException("Ambiguous test identity");
                        removed += count;
                    }
                }
                connection.commit();
            } catch (Exception error) { connection.rollback(); throw error; }
        }
        System.out.println("CLEANUP: removed " + removed + " exact test accounts.");
    }
}
