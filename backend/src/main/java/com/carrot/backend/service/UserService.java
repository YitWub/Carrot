package com.carrot.backend.service;

import com.carrot.backend.domain.User;
import com.carrot.backend.dto.UserProfileResponse;
import com.carrot.backend.dto.UserProfileUpdateRequest;
import com.carrot.backend.exception.UserDeletedException;
import com.carrot.backend.exception.UserNotFoundException;
import com.carrot.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = getUserById(userId);
        return new UserProfileResponse(
                user.getId(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getMannerTemp(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public UserProfileResponse updateUserProfile(Long userId, UserProfileUpdateRequest request) {
        User user = getUserById(userId);

        if (request.nickname() != null) {
            if (request.nickname().length() < 2 || request.nickname().length() > 10) {
                throw new IllegalArgumentException("닉네임은 2자 이상 10자 이하이어야 합니다.");
            }
            user.setNickname(request.nickname());
        }

        if (request.profileImageUrl() != null) {
            user.setProfileImageUrl(request.profileImageUrl());
        }

        // JPA Dirty Checking automatically saves changes
        return new UserProfileResponse(
                user.getId(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getMannerTemp(),
                user.getCreatedAt()
        );
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        user.setIsDeleted(true);
    }

    private User getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 유저입니다."));
        if (user.getIsDeleted()) {
            throw new UserDeletedException("탈퇴 처리된 회원입니다.");
        }
        return user;
    }
}
