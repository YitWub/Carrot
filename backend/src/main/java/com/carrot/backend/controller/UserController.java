package com.carrot.backend.controller;

import com.carrot.backend.domain.User;
import com.carrot.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 누군가 "api/users/login?email=xxx" 이렇게 물어보면 실행! ???
    @GetMapping("/login")
    public User login(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));
    }
}
