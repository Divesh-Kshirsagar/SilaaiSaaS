package com.silaaisaas.shop;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final ShopService shopService;
    private final OrganizationRepository organizationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCurrentOrganization() {
        Organization org = shopService.getCurrentOrganization();
        return ResponseEntity.ok(Map.of(
            "name", org.getName(),
            "taxRate", org.getDefaultTaxRate() != null ? org.getDefaultTaxRate() : 0.0,
            "taxId", org.getTaxId() != null ? org.getTaxId() : "",
            "currency", "INR",
            "receiptFooter", "Thank you for shopping with " + org.getName() + "!"
        ));
    }

    @PutMapping
    public ResponseEntity<Organization> updateOrganization(@RequestBody Map<String, Object> update) {
        Organization org = shopService.getCurrentOrganization();
        
        if (update.containsKey("taxId")) {
            org.setTaxId((String) update.get("taxId"));
        }
        if (update.containsKey("taxRate")) {
            Object taxRateObj = update.get("taxRate");
            if (taxRateObj instanceof Number) {
                org.setDefaultTaxRate(((Number) taxRateObj).doubleValue());
            }
        }
        
        return ResponseEntity.ok(organizationRepository.save(org));
    }
}
