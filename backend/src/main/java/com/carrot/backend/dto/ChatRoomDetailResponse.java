package com.carrot.backend.dto;

public record ChatRoomDetailResponse(
    Long roomId,
    Long productId,
    String productTitle,
    Integer productPrice,
    String productThumbnailUrl,
    Long partnerId,
    String partnerNickname,
    String partnerProfileImageUrl,
    Double partnerMannerTemp,
    boolean isProductSold,
    boolean isSeller,
    boolean hasReviewed
) {}
