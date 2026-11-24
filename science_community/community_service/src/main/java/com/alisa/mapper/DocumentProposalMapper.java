package com.alisa.mapper;

import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface DocumentProposalMapper {
    record Summary(String id, String documentId, String documentName, String communityId, String proposerId,
                   String status, int revision, String summary, String reviewNote, String reviewerId) {}

    @Select("select license_note from tb_document_contribution where document_id=#{id}")
    String license(String id);

    @Insert("""
        insert into tb_document_contribution(document_id, license_note) values(#{id}, #{license})
        on duplicate key update license_note=#{license}
        """)
    void setLicense(@Param("id") String id, @Param("license") String license);

    @Delete("delete from tb_document_contribution where document_id=#{id}")
    void disable(String id);

    String COLUMNS = """
        p.proposal_id as id, p.document_id as documentId, d.document_name as documentName,
        d.document_community_id as communityId, p.proposer_id as proposerId, p.status, p.revision, p.summary,
        p.review_note as reviewNote, p.reviewer_id as reviewerId
        """;
    String FROM = """
        from tb_document_proposal p join tb_document d on d.document_id=p.document_id
        """;

    @Select("select " + COLUMNS + FROM + " where p.proposal_id=#{id}")
    Summary find(String id);

    @Select("select " + COLUMNS + FROM + """
         where p.document_id=#{id}
           and (p.status='merged' or p.proposer_id=#{viewer} or (#{reviewer} and p.status in ('submitted','closed')))
         order by p.updated_at desc, p.proposal_id
        """)
    List<Summary> list(@Param("id") String id, @Param("viewer") String viewer, @Param("reviewer") boolean reviewer);

    @Select("select " + COLUMNS + FROM + " where p.proposer_id=#{viewer} order by p.updated_at desc, p.proposal_id")
    List<Summary> mine(String viewer);

    record Snapshot(String id, String documentId, String documentName, String communityId, String proposerId,
                    String status, int revision, String summary, String reviewNote, String reviewerId,
                    String baseContent, String proposedContent) {
        public Summary header() {
            return new Summary(id, documentId, documentName, communityId, proposerId, status, revision, summary, reviewNote, reviewerId);
        }
    }

    @Select("select " + COLUMNS + ", p.base_content as baseContent, p.proposed_content as proposedContent " + FROM + "where p.proposal_id=#{id}")
    Snapshot snapshot(String id);

    @Select("""
        select proposal_id from tb_document_proposal
        where document_id=#{documentId} and proposer_id=#{userId} and status in ('draft','submitted','returned')
        order by updated_at desc, proposal_id limit 1
        """)
    String active(@Param("documentId") String documentId, @Param("userId") String userId);

    @Select("select base_content from tb_document_proposal where proposal_id=#{id}")
    String base(String id);

    @Select("select proposed_content from tb_document_proposal where proposal_id=#{id}")
    String proposed(String id);

    @Insert("""
        insert into tb_document_proposal(proposal_id, document_id, proposer_id, status, base_content, proposed_content)
        values(#{id}, #{documentId}, #{userId}, 'draft', #{content}, #{content})
        """)
    void create(@Param("id") String id, @Param("documentId") String documentId, @Param("userId") String userId,
                @Param("content") String content);

    @Update("""
        update tb_document_proposal
        set proposed_content=#{content}, summary=#{summary}, status=#{status},
            revision=revision+1, updated_at=current_timestamp(3)
        where proposal_id=#{id}
        """)
    void save(@Param("id") String id, @Param("content") String content, @Param("summary") String summary,
              @Param("status") String status);

    @Update("""
        update tb_document_proposal
        set status=#{status}, review_note=#{note}, reviewer_id=#{reviewer}, revision=revision+1, updated_at=current_timestamp(3)
        where proposal_id=#{id}
        """)
    void decide(@Param("id") String id, @Param("status") String status, @Param("note") String note,
                @Param("reviewer") String reviewer);
}
