package com.alisa.controller;

import com.alisa.model.CommunityUser;
import com.alisa.service.CommunityUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communityuser")
public class CommunityUserController {

    @Autowired
    private CommunityUserService communityuserService;

    @GetMapping("/getAll")
    public List<CommunityUser> getAll() {
        return communityuserService.getAll();
    }

    @GetMapping("/{id}")
    public CommunityUser getById(@PathVariable String id) {
        return communityuserService.getById(id);
    }

    @PostMapping("/upsert")
    public void upsert(@RequestBody CommunityUser communityuser) {
        communityuserService.upsert(communityuser);
    }

    @PostMapping("/batch-upsert")
    public void batchUpsert(@RequestBody List<CommunityUser> list) {
        communityuserService.batchUpsert(list);
    }

    @DeleteMapping("/batch-delete")
    public void batchDelete(@RequestBody List<String> ids) {
        communityuserService.batchDelete(ids);
    }
}