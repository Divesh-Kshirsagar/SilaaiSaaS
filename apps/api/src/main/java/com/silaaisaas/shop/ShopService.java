package com.silaaisaas.shop;

import com.silaaisaas.common.exception.ResourceNotFoundException;
import com.silaaisaas.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ShopService {

    private final ShopRepository shopRepository;
    private final OrganizationRepository organizationRepository;

    /**
     * Returns the Shop for the currently authenticated user,
     * derived from the shopId embedded in their JWT (via TenantContext).
     * This is the CORRECT multi-tenant approach.
     */
    public Shop getCurrentShop() {
        Long shopId = TenantContext.getCurrentShopId();
        if (shopId == null) {
            throw new ResourceNotFoundException("No shop context found for current request");
        }
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResourceNotFoundException("Shop not found: " + shopId));
    }

    /**
     * Returns the Organization for the currently authenticated user.
     */
    public Organization getCurrentOrganization() {
        Long orgId = TenantContext.getCurrentOrgId();
        if (orgId == null) {
            throw new ResourceNotFoundException("No organization context found for current request");
        }
        return organizationRepository.findById(orgId)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found: " + orgId));
    }
}
