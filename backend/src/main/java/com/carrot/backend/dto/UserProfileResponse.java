package com.carrot.backend.dto;

import java.time.LocalDateTime;

public record UserProfileResponse(
    Long userId,
    String nickname,
    String profileImageUrl,
    Double mannerTemp,
    LocalDateTime createdAt
) {}
