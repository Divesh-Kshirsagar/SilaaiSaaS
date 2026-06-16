package com.silaaisaas.auth;

import com.silaaisaas.common.enums.UserRole;
import com.silaaisaas.shop.Organization;
import com.silaaisaas.shop.OrganizationRepository;
import com.silaaisaas.shop.Shop;
import com.silaaisaas.shop.ShopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ShopRepository shopRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public record LoginRequest(String phone, String password) {}
    public record LoginResponse(String token, Long userId, String name, String role,
                                Long shopId, Long orgId, String shopName) {}
    public record RegisterRequest(String shopName, String ownerName, String phone, String password) {}
    public record RegisterStaffRequest(String name, String phone, String password) {}

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        Shop shop = user.getShop();
        Long orgId = shop.getOrganization().getId();

        String token = jwtUtil.generateToken(
                user.getPhone(),
                user.getRole().name(),
                user.getId(),
                shop.getId(),
                orgId
        );

        return new LoginResponse(token, user.getId(), user.getName(), user.getRole().name(),
                                 shop.getId(), orgId, shop.getName());
    }

    @Transactional
    public LoginResponse register(RegisterRequest req) {
        if (userRepository.findByPhone(req.phone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        // Create Organization first (top-level tenant)
        Organization org = organizationRepository.save(
                Organization.builder().name(req.shopName()).build()
        );

        // Create Shop under the Organization
        Shop shop = shopRepository.save(
                Shop.builder().organization(org).name(req.shopName()).phone(req.phone()).build()
        );

        // Create Owner user linked to the Shop
        User owner = userRepository.save(User.builder()
                .shop(shop)
                .name(req.ownerName())
                .phone(req.phone())
                .role(UserRole.OWNER)
                .passwordHash(passwordEncoder.encode(req.password()))
                .build());

        String token = jwtUtil.generateToken(
                owner.getPhone(), owner.getRole().name(), owner.getId(),
                shop.getId(), org.getId()
        );
        return new LoginResponse(token, owner.getId(), owner.getName(), owner.getRole().name(),
                                 shop.getId(), org.getId(), shop.getName());
    }

    @Transactional
    public LoginResponse registerStaff(RegisterStaffRequest req, String ownerPhone) {
        User owner = userRepository.findByPhone(ownerPhone)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        if (userRepository.findByPhone(req.phone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        Shop shop = owner.getShop();
        User staff = userRepository.save(User.builder()
                .shop(shop)
                .name(req.name())
                .phone(req.phone())
                .role(UserRole.TAILOR)
                .passwordHash(passwordEncoder.encode(req.password()))
                .build());
        String token = jwtUtil.generateToken(
                staff.getPhone(), staff.getRole().name(), staff.getId(),
                shop.getId(), shop.getOrganization().getId()
        );
        return new LoginResponse(token, staff.getId(), staff.getName(), staff.getRole().name(),
                                 shop.getId(), shop.getOrganization().getId(), shop.getName());
    }
}
