package com.silaaisaas.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthService.LoginResponse> login(@RequestBody AuthService.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthService.LoginResponse> register(@RequestBody AuthService.RegisterRequest req) {
        return ResponseEntity.status(201).body(authService.register(req));
    }

    @PostMapping("/register/staff")
    public ResponseEntity<AuthService.LoginResponse> registerStaff(
            @RequestBody AuthService.RegisterStaffRequest req,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(201).body(authService.registerStaff(req, principal.getUsername()));
    }
}
