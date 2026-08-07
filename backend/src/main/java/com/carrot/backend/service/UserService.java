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
    private final com.carrot.backend.repository.ProductRepository productRepository;

    public UserService(UserRepository userRepository, com.carrot.backend.repository.ProductRepository productRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
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
    public UserProfileResponse updateUserProfile(Long userId, String nickname, org.springframework.web.multipart.MultipartFile profileImage) {
        User user = getUserById(userId);

        if (nickname != null) {
            if (!nickname.matches("^[a-zA-Z0-9가-힣]{2,10}$")) {
                throw new IllegalArgumentException("닉네임은 2~10자의 영문, 숫자, 한글만 가능합니다.");
            }
            user.setNickname(nickname);
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String uploadDir = java.nio.file.Paths.get("uploads").toFile().getAbsolutePath();
                java.io.File dir = new java.io.File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String filename = java.util.UUID.randomUUID().toString() + ".webp";
                java.io.File targetFile = new java.io.File(uploadDir, filename);
                profileImage.transferTo(targetFile);

                // Assuming frontend URL uses UPLOADS_URL, so just save filename
                user.setProfileImageUrl(filename);
            } catch (java.io.IOException e) {
                throw new RuntimeException("프로필 이미지 저장 실패", e);
            }
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
        
        // 탈퇴 후 동일 계정(이메일)으로 재가입(옵션 B)을 허용하기 위해 firebaseUid를 무효화합니다.
        user.setFirebaseUid(user.getFirebaseUid() + "_deleted_" + System.currentTimeMillis());
        
        // 탈퇴한 유저의 상품들도 숨김 처리
        java.util.List<com.carrot.backend.domain.Product> products = productRepository.findAllBySeller_Id(userId);
        for (com.carrot.backend.domain.Product product : products) {
            product.setStatus("DELETED");
        }
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
