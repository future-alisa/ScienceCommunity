import java.sql.*;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.support.ResourcePropertySource;

/** Additive and repeatable migration; never rewrites or deletes existing documents. */
class UpgradeDocumentStorage {
    public static void main(String[] args) throws Exception {
        var env = new StandardEnvironment();
        env.getPropertySources().addLast(new ResourcePropertySource("file:community_service/.env"));
        try(var db=DriverManager.getConnection(env.getRequiredProperty("MYSQL_URL"),env.getRequiredProperty("MYSQL_USERNAME"),env.getRequiredProperty("MYSQL_PASSWORD")); var s=db.createStatement()) {
            String type;
            try(var rows=s.executeQuery("select data_type from information_schema.columns where table_schema=database() and table_name='tb_document' and column_name='document_content'")) { if(!rows.next())throw new IllegalStateException("Document table missing"); type=rows.getString(1); }
            if("text".equals(type) || "tinytext".equals(type)) {
                s.executeUpdate("alter table tb_document modify document_content MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL");
                System.out.println("UPGRADED: document_content to MEDIUMTEXT");
            } else if(!"mediumtext".equals(type) && !"longtext".equals(type)) throw new IllegalStateException("Unexpected document column type");
            String[][] indexes={{"idx_document_community_category_updated","document_community_id,document_category_id,document_update_date,document_id"},{"idx_document_community_updated","document_community_id,document_update_date,document_id"},{"idx_document_author","document_author_id"}};
            for(var index:indexes) {
                boolean found;
                try(var check=db.prepareStatement("select count(*) from information_schema.statistics where table_schema=database() and table_name='tb_document' and index_name=?")){check.setString(1,index[0]);try(var rows=check.executeQuery()){rows.next();found=rows.getInt(1)>0;}}
                if(!found){s.executeUpdate("create index "+index[0]+" on tb_document("+index[1]+")");System.out.println("CREATED: "+index[0]);}
            }
            System.out.println("PASS: document storage upgrade complete; existing rows preserved");
        }
    }
}
