package com.carrot.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDetailResponse(
    Long productId,
    String title,
    String content,
    Integer price,
    String status,
    String location,
    Long sellerId,
    String sellerNickname,
    String sellerProfileImageUrl,
    Double sellerMannerTemp,
    List<String> imageUrls,
    LocalDateTime createdAt,
    Integer favoriteCount,
    Integer viewCount,
    Boolean isFavorite
) {}
