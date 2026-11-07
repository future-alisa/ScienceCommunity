import com.alisa.CommunityServiceApplication;
import com.alisa.model.*;
import com.alisa.mapper.CategoryMapper;
import com.alisa.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

/** Real database/service round trip with all fixture data rolled back. */
class DocumentDatabaseSmoke {
    public static void main(String[] args) {
        try(var app=new SpringApplicationBuilder(CommunityServiceApplication.class).web(WebApplicationType.NONE).run(
                "--spring.cloud.nacos.discovery.enabled=false", "--spring.sql.init.mode=never", "--spring.main.banner-mode=off", "--logging.level.root=ERROR")) {
            var jdbc=app.getBean(JdbcTemplate.class);
            String user=UUID.randomUUID().toString().replace("-", "");
            String community=UUID.randomUUID().toString().replace("-", "");
            var transaction=new TransactionTemplate(app.getBean(PlatformTransactionManager.class));
            transaction.execute(status->{
                status.setRollbackOnly();
                try {
                    jdbc.update("insert into db_user.tb_user(user_id,user_name,user_password,user_email) values(?,?,?,?)",user,"qa"+user,"unusable-test-fixture","qa"+user+"@example.invalid");
                    var context=new UserContext();context.setUserId(user);context.setUsername("qa"+user);UserContext.set(context);
                    var model=new Community();model.setCommunityId(community);model.setCommunityName("Document transaction smoke");model.setCommunityDescription("Rolled back");model.setCommunityUrl("");model.setCommunityImageUrl("");
                    app.getBean(CommunityService.class).upsert(model);
                    var categories=app.getBean(CategoryMapper.class).selectByExample(null);
                    var service=app.getBean(DocumentService.class);
                    var mapper=app.getBean(ObjectMapper.class);
                    var created=new ArrayList<Document>();
                    for(String kind:List.of("base","case","post")) {
                        var category=categories.stream().filter(item->kind.equals(item.getCategoryName())).findFirst().orElseThrow();
                        var doc=new Document();doc.setDocumentCommunityId(community);doc.setDocumentCategoryId(category.getCategoryId());doc.setDocumentName("Unified "+kind);doc.setDocumentDescription("Long Unicode round trip");doc.setDocumentThumbnailUrl("");
                        String text="理论案例文章".repeat(6000);
                        doc.setDocumentContent(mapper.writeValueAsString(List.of(Map.of("type","paragraph","children",List.of(Map.of("text",text,"bold",true))))));
                        service.upsert(doc);
                        var saved=service.getById(doc.getDocumentId());
                        if(!saved.getDocumentContent().equals(doc.getDocumentContent()) || !saved.getDocumentAuthorId().equals(user))throw new IllegalStateException("Content or author mismatch");
                        if(saved.getDocumentContent().getBytes(java.nio.charset.StandardCharsets.UTF_8).length<=65535)throw new IllegalStateException("Fixture must exceed old TEXT limit");
                        created.add(saved);System.out.println("PASS: "+kind+" long Unicode document round trip");
                    }
                    var changed=created.get(0);var createdAt=changed.getDocumentCreateDate();
                    changed.setDocumentCategoryId(created.get(2).getDocumentCategoryId());changed.setDocumentName("Recategorized article");service.upsert(changed);
                    var saved=service.getById(changed.getDocumentId());
                    if(!saved.getDocumentCreateDate().equals(createdAt)||!saved.getDocumentAuthorId().equals(user)||!saved.getDocumentCategoryId().equals(created.get(2).getDocumentCategoryId()))throw new IllegalStateException("Recategorization changed identity");
                    if(service.getAllByComunityId(community,null).size()!=3)throw new IllegalStateException("Recategorization duplicated document");
                    System.out.println("PASS: recategorization preserves identity, author, creation time and content without duplicating rows");
                    var embedded=new Document();embedded.setDocumentCommunityId(community);embedded.setDocumentCategoryId(created.get(2).getDocumentCategoryId());embedded.setDocumentName("Embedded materials");embedded.setDocumentDescription("Structured reference and assets");embedded.setDocumentThumbnailUrl("");
                    embedded.setDocumentContent(mapper.writeValueAsString(List.of(
                        Map.of("type","document-reference","documentId",created.get(0).getDocumentId(),"name","Referenced source","children",List.of(Map.of("text",""))),
                        Map.of("type","image","url","https://files.example.org/test.png","name","Image","children",List.of(Map.of("text",""))),
                        Map.of("type","attachment","url","https://files.example.org/test.pdf","name","Paper","children",List.of(Map.of("text",""))),
                        Map.of("type","code-block","language","java","children",List.of(Map.of("text","int answer = 42;"))))));
                    service.upsert(embedded);var reopened=service.getById(embedded.getDocumentId());
                    if(!reopened.getDocumentContent().equals(embedded.getDocumentContent()))throw new IllegalStateException("Embedded materials did not persist");
                    System.out.println("PASS: document reference, image/attachment metadata and code block persist in one document format");
                } catch(Exception error){throw new RuntimeException(error);} finally {UserContext.remove();}
                return null;
            });
            if(jdbc.queryForObject("select count(*) from tb_document where document_community_id=?",Integer.class,community)!=0 || jdbc.queryForObject("select count(*) from db_user.tb_user where user_id=?",Integer.class,user)!=0 || jdbc.queryForObject("select count(*) from tb_community where community_id=?",Integer.class,community)!=0)throw new IllegalStateException("Fixture rollback failed");
            System.out.println("PASS: all documents, memberships, community and test identity rolled back");
        }
    }
}
