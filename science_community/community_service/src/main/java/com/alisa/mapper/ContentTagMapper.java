package com.alisa.mapper;

import org.apache.ibatis.annotations.Arg;
import org.apache.ibatis.annotations.ConstructorArgs;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ContentTagMapper {
    record Assignment(String contentId, String tagName) {}

    @ConstructorArgs({
        @Arg(column = "contentId", javaType = String.class),
        @Arg(column = "tagName", javaType = String.class)
    })
    @Select("""
        <script>
        select tc.community_id as contentId, t.tag_name as tagName
        from tb_tag_community tc join tb_tag t on t.tag_id = tc.tag_id
        where tc.community_id in
        <foreach collection="ids" item="id" open="(" separator="," close=")">#{id}</foreach>
        order by t.tag_name, t.tag_id
        </script>
        """)
    List<Assignment> communityTags(@Param("ids") List<String> ids);

    @ConstructorArgs({
        @Arg(column = "contentId", javaType = String.class),
        @Arg(column = "tagName", javaType = String.class)
    })
    @Select("""
        <script>
        select td.document_id as contentId, t.tag_name as tagName
        from tb_tag_document td join tb_tag t on t.tag_id = td.tag_id
        where td.document_id in
        <foreach collection="ids" item="id" open="(" separator="," close=")">#{id}</foreach>
        order by t.tag_name, t.tag_id
        </script>
        """)
    List<Assignment> documentTags(@Param("ids") List<String> ids);

    @Select("select tag_id from tb_tag where tag_name = #{name} order by tag_id limit 1")
    String findTagId(String name);

    @Insert("""
        insert into tb_tag (tag_id, tag_name, tag_owner_id) values (#{id}, #{name}, #{owner})
        on duplicate key update tag_id = tag_id
        """)
    void ensureTag(@Param("id") String id, @Param("name") String name, @Param("owner") String owner);

    @Insert("insert into tb_tag_community (tag_community_id, community_id, tag_id) values (#{id}, #{contentId}, #{tagId})")
    void linkCommunity(@Param("id") String id, @Param("contentId") String contentId, @Param("tagId") String tagId);

    @Insert("insert into tb_tag_document (tag_document_id, document_id, tag_id) values (#{id}, #{contentId}, #{tagId})")
    void linkDocument(@Param("id") String id, @Param("contentId") String contentId, @Param("tagId") String tagId);
}
