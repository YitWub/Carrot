package com.carrot.backend.dto;

public record AuthLoginRequest(
    String firebaseToken,
    String email,
    String displayName,
    String photoUrl
) {}
