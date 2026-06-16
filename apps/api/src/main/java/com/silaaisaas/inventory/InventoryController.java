package com.silaaisaas.inventory;

import com.silaaisaas.common.enums.ItemCategory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public ResponseEntity<List<InventoryService.InventoryResponse>> list(
            @RequestParam(required = false) ItemCategory category) {
        if (category != null) {
            return ResponseEntity.ok(inventoryService.listByCategory(category));
        }
        return ResponseEntity.ok(inventoryService.list());
    }

    @PostMapping
    public ResponseEntity<InventoryService.InventoryResponse> create(
            @RequestBody InventoryService.InventoryRequest req) {
        return ResponseEntity.status(201).body(inventoryService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryService.InventoryResponse> update(
            @PathVariable Long id,
            @RequestBody InventoryService.InventoryRequest req) {
        return ResponseEntity.ok(inventoryService.update(id, req));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<InventoryService.InventoryResponse> adjustStock(
            @PathVariable Long id,
            @RequestBody InventoryService.StockAdjustRequest req) {
        return ResponseEntity.ok(inventoryService.adjustStock(id, req));
    }
}
