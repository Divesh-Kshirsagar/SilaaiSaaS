package com.silaaisaas.report;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportsController {

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        // Mock data until real aggregation queries are implemented
        return ResponseEntity.ok(Map.of(
            "totalRevenue", 25000.0,
            "totalOrders", 42
        ));
    }
}
