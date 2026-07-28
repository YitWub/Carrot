package com.carrot.backend.dto;

public record AuthLoginResponse(
    Long userId,
    String nickname,
    Double mannerTemp,
    Boolean isNewUser
) {}
