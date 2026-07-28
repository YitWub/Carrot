package com.carrot.backend.dto;

public record ChatRoomResponse(
    Long roomId,
    Long productId,
    Long buyerId,
    Long sellerId
) {}
