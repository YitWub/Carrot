package com.carrot.backend.service;

import com.carrot.backend.domain.User;
import com.carrot.backend.dto.AuthLoginRequest;
import com.carrot.backend.dto.AuthLoginResponse;
import com.carrot.backend.exception.UserDeletedException;
import com.carrot.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public AuthLoginResponse loginOrSignup(AuthLoginRequest request) {
        // 1. Firebase Token Validation (Mock implementation for now)
        if (request.firebaseToken() == null || request.firebaseToken().isBlank()) {
            throw new IllegalArgumentException("Invalid Firebase Token");
        }

        // 2. Mock extracting UID from token (In real world, use Firebase SDK)
        // For development, we'll use the email as the UID since the token string is too long for VARCHAR(255)
        // and changes every hour, preventing returning logins.
        String uid = request.email() != null ? request.email() : request.firebaseToken().substring(0, Math.min(request.firebaseToken().length(), 200)); 

        Optional<User> userOptional = userRepository.findByFirebaseUid(uid);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getIsDeleted()) {
                throw new UserDeletedException("탈퇴 처리된 회원입니다.");
            }
            return new AuthLoginResponse(user.getId(), user.getNickname(), user.getMannerTemp(), false);
        } else {
            // New user registration
            User newUser = new User();
            newUser.setFirebaseUid(uid);
            newUser.setEmail(request.email());
            
            // Random nickname generation (e.g., User-a1b2)
            String randomNickname = "당근유저_" + UUID.randomUUID().toString().substring(0, 6);
            newUser.setNickname(request.displayName() != null ? request.displayName() : randomNickname);
            newUser.setProfileImageUrl(request.photoUrl());
            newUser.setMannerTemp(36.5);
            newUser.setIsDeleted(false);

            User savedUser = userRepository.save(newUser);
            return new AuthLoginResponse(savedUser.getId(), savedUser.getNickname(), savedUser.getMannerTemp(), true);
        }
    }
}
