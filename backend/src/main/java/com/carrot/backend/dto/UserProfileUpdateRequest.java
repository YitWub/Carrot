package com.carrot.backend.dto;

public record UserProfileUpdateRequest(
    String nickname,
    String profileImageUrl
) {}
