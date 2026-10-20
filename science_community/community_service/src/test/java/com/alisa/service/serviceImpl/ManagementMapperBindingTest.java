package com.alisa.service.serviceImpl;

import org.apache.ibatis.builder.xml.XMLMapperBuilder;
import org.apache.ibatis.session.Configuration;
import org.junit.jupiter.api.Test;
import com.alisa.dto.ChannelUserFilter;
import com.alisa.model.Document;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class ManagementMapperBindingTest {
    @Test void largeMessageCursorIsSerializedAsString() throws Exception {
        var row = new com.alisa.model.ChannelMessage();
        row.setSequenceId(9007199254740993L);
        var json = new com.fasterxml.jackson.databind.ObjectMapper();
        assertEquals("9007199254740993", json.readTree(json.writeValueAsString(row)).get("sequenceId").textValue());
    }
    @Test void mapperBindingsIncludeDocumentContentAndCorrectMembershipColumn() throws Exception {
        var config = new Configuration();
        for (String name : new String[]{"DocumentMapper", "CommunityUserMapper", "ChannelUserMapper", "ChannelMapper"}) {
            String resource = "com/alisa/mapper/xml/" + name + ".xml";
            try (var input = getClass().getClassLoader().getResourceAsStream(resource)) {
                assertNotNull(input);
                new XMLMapperBuilder(input, config, resource, config.getSqlFragments()).parse();
            }
        }
        String update = config.getMappedStatement("com.alisa.mapper.DocumentMapper.updateByPrimaryKeyWithBLOBs").getBoundSql(new Document()).getSql();
        assertTrue(update.contains("document_content ="));
        var filter = new ChannelUserFilter();
        filter.createCriteria().andChannelIdEqualTo("channel").andCommunityUserIdEqualTo("member");
        String select = config.getMappedStatement("com.alisa.mapper.ChannelUserMapper.selectByExample").getBoundSql(filter).getSql();
        assertTrue(select.contains("community_user_id ="));
        var memberMap = config.getResultMap("com.alisa.mapper.CommunityUserMapper.ExBaseResultMap");
        assertTrue(memberMap.getResultMappings().stream().anyMatch(mapping -> "userId".equals(mapping.getProperty())));
        String insertChannel = config.getMappedStatement("com.alisa.mapper.ChannelMapper.insert").getBoundSql(new com.alisa.model.Channel()).getSql();
        assertTrue(insertChannel.contains("channel_description"));
        String updateChannel = config.getMappedStatement("com.alisa.mapper.ChannelMapper.updateByPrimaryKey").getBoundSql(new com.alisa.model.Channel()).getSql();
        assertTrue(updateChannel.contains("channel_description ="));
    }

    @Test void messageHistorySqlBindsDirectionalCursorsAndLimits() {
        var config = new Configuration();
        config.addMapper(com.alisa.mapper.ChannelMessageMapper.class);
        var params = new java.util.HashMap<String, Object>();
        params.put("channelId", "channel"); params.put("limit", 51); params.put("after", 100L); params.put("before", null);
        var statement = config.getMappedStatement("com.alisa.mapper.ChannelMessageMapper.history");
        String incremental = statement.getBoundSql(params).getSql().replaceAll("\\s+", " ");
        assertTrue(incremental.contains("sequence_id > ?"));
        assertTrue(incremental.contains("order by sequence_id asc"));
        params.put("after", null); params.put("before", 100L);
        String older = statement.getBoundSql(params).getSql().replaceAll("\\s+", " ");
        assertTrue(older.contains("sequence_id < ?"));
        assertTrue(older.contains("order by sequence_id desc"));
    }
}
