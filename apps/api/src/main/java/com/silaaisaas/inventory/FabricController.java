package com.silaaisaas.inventory;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fabrics")
@RequiredArgsConstructor
public class FabricController {

    private final FabricService fabricService;

    @GetMapping
    public ResponseEntity<List<FabricService.FabricResponse>> list() {
        return ResponseEntity.ok(fabricService.list());
    }

    @PostMapping
    public ResponseEntity<Fabric> create(@RequestBody FabricService.FabricRequest req) {
        return ResponseEntity.status(201).body(fabricService.create(req));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<FabricService.FabricResponse> adjustStock(
            @PathVariable Long id,
            @RequestBody FabricService.StockAdjustRequest req) {
        return ResponseEntity.ok(fabricService.adjustStock(id, req));
    }
}
