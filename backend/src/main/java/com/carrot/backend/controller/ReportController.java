package com.carrot.backend.controller;

import com.carrot.backend.dto.ReportRequest;
import com.carrot.backend.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin(origins = "*") // Nginx proxy anyway
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<?> submitReport(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody ReportRequest request) {
        
        reportService.submitReport(userId, request);
        return ResponseEntity.ok().build();
    }
}
