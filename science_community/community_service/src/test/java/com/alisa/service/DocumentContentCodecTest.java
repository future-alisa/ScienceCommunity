package com.alisa.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;

class DocumentContentCodecTest {
    ObjectMapper json = new ObjectMapper();
    String paragraph(String text) { return "[{\"type\":\"paragraph\",\"children\":[{\"text\":\""+text+"\"}]}]"; }
    @Test void longUnicodeDocumentFitsUnifiedFormat() {
        String source=paragraph("理论案例文章".repeat(12000));
        assertTrue(source.getBytes(java.nio.charset.StandardCharsets.UTF_8).length>65535);
        assertDoesNotThrow(()->DocumentContentCodec.normalize(source,json));
    }
    @Test void legacyListIsNormalizedWithoutLosingContent() throws Exception {
        var result=json.readTree(DocumentContentCodec.normalize("[{\"type\":\"list\",\"children\":[{\"type\":\"list-item\",\"children\":[{\"text\":\"历史资料\"}]}]}]",json));
        assertEquals("bulleted-list",result.get(0).get("type").asText());
        assertEquals("历史资料",result.get(0).get("children").get(0).get("children").get(0).get("text").asText());
    }
    @Test void invalidAndEmptyDocumentsAreRejected() {
        for(String source:new String[]{"[]", "{}", paragraph("  "), "[{\"type\":\"script\",\"children\":[{\"text\":\"x\"}]}]", "[{\"type\":\"heading\",\"level\":7,\"children\":[{\"text\":\"x\"}]}]", "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"x\",\"bold\":\"yes\"}]}]"})
            assertThrows(ResponseStatusException.class,()->DocumentContentCodec.normalize(source,json));
    }
    @Test void oversizedDocumentIsRejectedBeforeParsing() {
        assertThrows(ResponseStatusException.class,()->DocumentContentCodec.normalize(paragraph("x".repeat(DocumentContentCodec.MAX_BYTES)),json));
    }
    @Test void mixedTextAndElementNodesCannotBypassValidation() {
        assertThrows(ResponseStatusException.class,()->DocumentContentCodec.normalize("[{\"type\":\"paragraph\",\"text\":\"bypass\",\"children\":[]}]",json));
    }
    @Test void embeddedAssetsAndCodeBlocksShareTheDocumentFormat() {
        for(String content:new String[]{
            "[{\"type\":\"image\",\"url\":\"https://files.example.org/a.png\",\"name\":\"示意图\",\"children\":[{\"text\":\"\"}]}]",
            "[{\"type\":\"attachment\",\"url\":\"https://files.example.org/a.pdf\",\"name\":\"论文\",\"children\":[{\"text\":\"\"}]}]",
            "[{\"type\":\"document-reference\",\"documentId\":\"0123456789abcdef0123456789abcdef\",\"name\":\"原文\",\"children\":[{\"text\":\"\"}]}]",
            "[{\"type\":\"code-block\",\"language\":\"java\",\"children\":[{\"text\":\"int x = 1;\"}]}]"}) assertDoesNotThrow(()->DocumentContentCodec.normalize(content,json));
    }
    @Test void assetUrlsAndReferenceIdsAreValidated() {
        for(String url:new String[]{"javascript:alert(1)","data:text/html,bad","https://user:secret@example.org/file","https://example.org/a\nb"}) {
            String source="[{\"type\":\"image\",\"url\":"+json.valueToTree(url)+",\"name\":\"x\",\"children\":[{\"text\":\"\"}]}]";
            assertThrows(ResponseStatusException.class,()->DocumentContentCodec.normalize(source,json));
        }
        assertThrows(ResponseStatusException.class,()->DocumentContentCodec.normalize("[{\"type\":\"document-reference\",\"documentId\":\"bad\",\"name\":\"x\",\"children\":[{\"text\":\"\"}]}]",json));
    }
}
