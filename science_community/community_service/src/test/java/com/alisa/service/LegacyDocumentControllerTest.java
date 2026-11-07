package com.alisa.service;
import com.alisa.controller.LegacyDocumentController;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class LegacyDocumentControllerTest {
    @Test void oldCategoryEndpointsCannotWriteIndependentRecords() throws Exception {
        var mvc=MockMvcBuilders.standaloneSetup(new LegacyDocumentController()).build();
        for(String prefix:new String[]{"/basis","/case","/post"}) {
            mvc.perform(post(prefix+"/upsert").contentType("application/json").content("{}")).andExpect(status().isGone());
            mvc.perform(get(prefix+"/getAll")).andExpect(status().isGone());
            mvc.perform(delete(prefix+"/batch-delete").contentType("application/json").content("[]")).andExpect(status().isGone());
        }
    }
}
