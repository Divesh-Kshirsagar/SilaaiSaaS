package com.silaaisaas.common.tenant;

/**
 * Thread-local holder for the current request's tenant context.
 * Populated by JwtAuthenticationFilter after JWT validation.
 * Must be cleared after every request to prevent context leaks.
 */
public class TenantContext {

    private static final ThreadLocal<Long> currentShopId = new ThreadLocal<>();
    private static final ThreadLocal<Long> currentOrgId = new ThreadLocal<>();
    private static final ThreadLocal<Long> currentUserId = new ThreadLocal<>();

    public static Long getCurrentShopId() { return currentShopId.get(); }
    public static Long getCurrentOrgId()  { return currentOrgId.get(); }
    public static Long getCurrentUserId() { return currentUserId.get(); }

    public static void setCurrentShopId(Long shopId) { currentShopId.set(shopId); }
    public static void setCurrentOrgId(Long orgId)   { currentOrgId.set(orgId); }
    public static void setCurrentUserId(Long userId)  { currentUserId.set(userId); }

    public static void clear() {
        currentShopId.remove();
        currentOrgId.remove();
        currentUserId.remove();
    }
}
