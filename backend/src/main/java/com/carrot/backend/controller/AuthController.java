package com.carrot.backend.controller;

import com.carrot.backend.dto.AuthLoginRequest;
import com.carrot.backend.dto.AuthLoginResponse;
import com.carrot.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "${cors.allowed-origins}")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest request) {
        if (request.firebaseToken() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        AuthLoginResponse response = authService.loginOrSignup(request);
        return ResponseEntity.ok(response);
    }
}
