package com.carrot.backend.dto;

import java.time.LocalDateTime;

public record ChatRoomListResponse(
    Long roomId,
    Long productId,
    String productTitle,
    String productThumbnailUrl,
    Long partnerId,
    String partnerNickname,
    String partnerProfileImageUrl,
    String lastMessage,
    LocalDateTime lastMessageTime
) {}
