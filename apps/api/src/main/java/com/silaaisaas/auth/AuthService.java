package com.silaaisaas.auth;

import com.silaaisaas.common.enums.UserRole;
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
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public record LoginRequest(String phone, String password) {}
    public record LoginResponse(String token, Long userId, String name, String role) {}
    public record RegisterRequest(String shopName, String ownerName, String phone, String password) {}
    public record RegisterStaffRequest(String name, String phone, String password) {}

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByPhone(request.phone())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(
                user.getPhone(),
                user.getRole().name(),
                user.getId()
        );

        return new LoginResponse(token, user.getId(), user.getName(), user.getRole().name());
    }

    @Transactional
    public LoginResponse register(RegisterRequest req) {
        if (userRepository.findByPhone(req.phone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        Shop shop = shopRepository.save(Shop.builder().name(req.shopName()).phone(req.phone()).build());
        User owner = userRepository.save(User.builder()
                .shop(shop)
                .name(req.ownerName())
                .phone(req.phone())
                .role(UserRole.OWNER)
                .passwordHash(passwordEncoder.encode(req.password()))
                .build());
        String token = jwtUtil.generateToken(owner.getPhone(), owner.getRole().name(), owner.getId());
        return new LoginResponse(token, owner.getId(), owner.getName(), owner.getRole().name());
    }

    @Transactional
    public LoginResponse registerStaff(RegisterStaffRequest req, String ownerPhone) {
        User owner = userRepository.findByPhone(ownerPhone)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        if (userRepository.findByPhone(req.phone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        User staff = userRepository.save(User.builder()
                .shop(owner.getShop())
                .name(req.name())
                .phone(req.phone())
                .role(UserRole.TAILOR)
                .passwordHash(passwordEncoder.encode(req.password()))
                .build());
        String token = jwtUtil.generateToken(staff.getPhone(), staff.getRole().name(), staff.getId());
        return new LoginResponse(token, staff.getId(), staff.getName(), staff.getRole().name());
    }
}
