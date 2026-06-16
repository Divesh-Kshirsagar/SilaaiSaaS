package com.silaaisaas.order;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/garments")
@RequiredArgsConstructor
public class GarmentCatalogController {

    private final GarmentCatalogService garmentCatalogService;

    @GetMapping
    public ResponseEntity<List<GarmentCatalog>> list() {
        return ResponseEntity.ok(garmentCatalogService.list());
    }

    @PostMapping
    public ResponseEntity<GarmentCatalog> create(@RequestBody GarmentCatalogService.GarmentRequest req) {
        return ResponseEntity.status(201).body(garmentCatalogService.create(req));
    }
}
