package com.alisa.controller;

import com.alisa.mapper.DocumentProposalMapper.Summary;
import com.alisa.service.DocumentProposalService;
import com.alisa.service.DocumentProposalService.Contribution;
import com.alisa.service.DocumentProposalService.Detail;
import com.alisa.service.DocumentProposalService.Draft;
import com.alisa.service.DocumentProposalService.Review;
import com.alisa.util.Result;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/document-proposal")
public class DocumentProposalController {
    private final DocumentProposalService proposals;

    public DocumentProposalController(DocumentProposalService proposals) {
        this.proposals = proposals;
    }

    public record License(String license) {}

    @GetMapping("/document/{id}/settings")
    public Result<Contribution> settings(@PathVariable String id) {
        return new Result<>(proposals.contribution(id));
    }

    @PutMapping("/document/{id}/settings")
    public Result<Contribution> settings(@PathVariable String id, @RequestBody License body) {
        return new Result<>(proposals.setLicense(id, body.license()));
    }

    @GetMapping("/document/{id}")
    public Result<List<Summary>> list(@PathVariable String id) {
        return new Result<>(proposals.list(id));
    }

    @PostMapping("/document/{id}")
    public Result<String> fork(@PathVariable String id) {
        return new Result<>(proposals.fork(id));
    }

    @GetMapping("/mine")
    public Result<List<Summary>> mine() {
        return new Result<>(proposals.mine());
    }

    @GetMapping("/{id}")
    public Result<Detail> detail(@PathVariable String id) {
        return new Result<>(proposals.detail(id));
    }

    @PutMapping("/{id}")
    public Result<Detail> save(@PathVariable String id, @RequestBody Draft draft) {
        return new Result<>(proposals.save(id, draft));
    }

    @PostMapping("/{id}/review")
    public Result<Detail> review(@PathVariable String id, @RequestBody Review review) {
        return new Result<>(proposals.review(id, review));
    }
}
