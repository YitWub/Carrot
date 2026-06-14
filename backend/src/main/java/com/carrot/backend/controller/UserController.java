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

    @GetMapping("/login")
    public User login(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("가입되지 않은 이메일입니다."));
    }

    @PostMapping("/auth")
    public User googleAuth(@RequestBody java.util.Map<String, String> userData) {
        String email = userData.get("email");
        String nickname = userData.get("nickname");

        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setNickname(nickname != null ? nickname : "당근유저");
            return userRepository.save(newUser);
        });
    }
}
