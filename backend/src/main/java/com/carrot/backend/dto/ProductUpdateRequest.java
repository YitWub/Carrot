package com.carrot.backend.dto;

public record ProductUpdateRequest(
    String title,
    String content,
    Integer price
) {}
