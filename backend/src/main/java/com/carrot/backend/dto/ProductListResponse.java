package com.carrot.backend.dto;

import java.time.LocalDateTime;

public record ProductListResponse(
    Long productId,
    String title,
    Integer price,
    String status,
    String thumbnailUrl,
    String sellerNickname,
    LocalDateTime createdAt
) {}
