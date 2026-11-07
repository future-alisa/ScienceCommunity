import java.sql.*;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.support.ResourcePropertySource;

/** Read-only audit. Run from science_community with the service runtime classpath. */
class AuditDocuments {
    public static void main(String[] args) throws Exception {
        boolean schemaOnly = args.length == 1 && "--schema-only".equals(args[0]);
        if (args.length != 0 && !schemaOnly) throw new IllegalArgumentException("Usage: AuditDocuments [--schema-only]");
        var env = new StandardEnvironment();
        env.getPropertySources().addLast(new ResourcePropertySource("file:community_service/.env"));
        try (var db = DriverManager.getConnection(env.getRequiredProperty("MYSQL_URL"), env.getRequiredProperty("MYSQL_USERNAME"), env.getRequiredProperty("MYSQL_PASSWORD"))) {
            db.setReadOnly(true);
            String[] queries = {
                "select column_name,data_type,character_maximum_length from information_schema.columns where table_schema=database() and table_name='tb_document'",
                "select index_name,column_name,seq_in_index from information_schema.statistics where table_schema=database() and table_name='tb_document'",
                "select c.category_name,count(d.document_id) as documents from tb_category c left join tb_document d on d.document_category_id=c.category_id group by c.category_id,c.category_name",
                "select count(*) as documents,max(octet_length(document_content)) as max_content_bytes,sum(not json_valid(document_content)) as invalid_json from tb_document",
                "select count(*) as missing_categories from tb_document d left join tb_category c on c.category_id=d.document_category_id where c.category_id is null",
                "select count(*) as missing_communities from tb_document d left join tb_community c on c.community_id=d.document_community_id where c.community_id is null",
                "select count(*) as missing_authors from tb_document d left join db_user.tb_user u on u.user_id=d.document_author_id where u.user_id is null",
                "select 'basis' as legacy_type,count(*) as relations from tb_basis union all select 'case',count(*) from tb_case union all select 'post',count(*) from tb_post",
                "select count(*) as orphan_legacy_links from (select basis_document_id id from tb_basis union all select case_document_id from tb_case union all select post_document_id from tb_post) r left join tb_document d on d.document_id=r.id where d.document_id is null",
                "select count(*) as conflicting_legacy_types from (select id from (select basis_document_id id,'base' kind from tb_basis union all select case_document_id,'case' from tb_case union all select post_document_id,'post' from tb_post) r group by id having count(distinct kind)>1) conflicts"
            };
            for (int q = 0; q < (schemaOnly ? 2 : queries.length); q++) {
                String sql = queries[q];
                try (var statement = db.createStatement(); var rows = statement.executeQuery(sql)) {
                    var meta = rows.getMetaData();
                    while (rows.next()) {
                        for (int i=1; i<=meta.getColumnCount(); i++) System.out.print(meta.getColumnLabel(i)+"="+rows.getString(i)+" ");
                        System.out.println();
                    }
                }
            }
        }
    }
}
