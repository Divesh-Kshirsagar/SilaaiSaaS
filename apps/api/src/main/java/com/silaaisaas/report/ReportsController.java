package com.silaaisaas.report;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
@lombok.RequiredArgsConstructor
public class ReportsController {

    private final ReportsService reportsService;

    @GetMapping("/summary")
    public ResponseEntity<ReportsService.ReportSummaryResponse> getSummary() {
        return ResponseEntity.ok(reportsService.getSummary());
    }
}
