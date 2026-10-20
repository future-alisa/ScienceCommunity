package com.alisa.mapper;

import org.apache.ibatis.annotations.*;
import java.util.List;
import java.util.Map;

@Mapper
public interface ManagementMapper {
    @Select("select user_name from db_user.tb_user where user_id = #{id}")
    String userName(String id);
    @Select("select community_id from tb_community where community_id = #{id} for update")
    String lockCommunity(String id);

    @Select("select community_role_name from tb_community_role where community_role_id = #{id}")
    String roleName(String id);

    @Select("select community_role_id from tb_community_role where community_role_name = #{name}")
    String roleId(String name);

    @Select("select community_role_id as id, community_role_name as name from tb_community_role where community_role_name in ('owner', 'admin', 'member')")
    List<Map<String, String>> roles();

    @Select("select user_id from db_user.tb_user where user_id = #{identity} or user_email = #{identity} or user_name = #{identity}")
    List<String> findUsers(String identity);

    @Delete("delete from tb_channel_user where community_user_id = #{id}")
    int deleteMemberChannels(String id);

    @Delete("delete from tb_channel_user where channel_id = #{id}")
    int deleteChannelMembers(String id);

    @Delete("delete from tb_tag_community where community_id = #{id}")
    int deleteCommunityTags(String id);

    @Delete("delete from tb_tag_document where document_id = #{id}")
    int deleteDocumentTags(String id);

    @Delete("delete from tb_basis where basis_document_id = #{id}")
    int deleteDocumentBasis(String id);

    @Delete("delete from tb_case where case_document_id = #{id}")
    int deleteDocumentCases(String id);

    @Delete("delete from tb_post where post_document_id = #{id}")
    int deleteDocumentPosts(String id);
}
