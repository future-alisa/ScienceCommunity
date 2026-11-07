package com.alisa.service.serviceImpl;
import com.alisa.mapper.CommunityMapper;
import com.alisa.service.CommunityAccessService;
import com.alisa.model.Community;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.mockito.ArgumentCaptor;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class CommunityCoverTest {
    CommunityMapper mapper=mock(CommunityMapper.class);
    CommunityAccessService access=mock(CommunityAccessService.class);
    CommunityServiceImpl service=new CommunityServiceImpl();
    CommunityCoverTest() { ReflectionTestUtils.setField(service,"communityMapper",mapper); ReflectionTestUtils.setField(service,"access",access); }
    @Test void savesOnlyCoverAndSupportsRemovalWithoutOverwritingCommunityDetails() {
        service.updateCover("community", "https://files.example/cover.png");
        var patch=ArgumentCaptor.forClass(Community.class);
        verify(mapper).updateByPrimaryKeySelective(patch.capture());
        assertEquals("https://files.example/cover.png",patch.getValue().getCommunityImageUrl());
        assertNull(patch.getValue().getCommunityName()); assertNull(patch.getValue().getCommunityDescription());
        verify(access).requireManager("community");
        reset(mapper);
        service.updateCover("community", "");
        verify(mapper).updateByPrimaryKeySelective(patch.capture());
        assertEquals("",patch.getValue().getCommunityImageUrl());
    }
    @Test void rejectsMemberWritesAndInvalidUrls() {
        doThrow(new ResponseStatusException(HttpStatus.FORBIDDEN)).when(access).requireManager("community");
        assertEquals(403,assertThrows(ResponseStatusException.class,()->service.updateCover("community", "")).getStatusCode().value());
        verifyNoInteractions(mapper);
        reset(access);
        for (String url: java.util.List.of("javascript:alert(1)", "https://name:secret@example.org/x", "a".repeat(256)))
            assertEquals(400,assertThrows(ResponseStatusException.class,()->service.updateCover("community",url)).getStatusCode().value());
        verifyNoInteractions(mapper);
    }
}
