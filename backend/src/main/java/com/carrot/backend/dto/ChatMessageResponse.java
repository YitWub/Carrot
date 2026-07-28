package com.carrot.backend.dto;

import java.time.LocalDateTime;

public record ChatMessageResponse(
    Long messageId,
    Long senderId,
    String text,
    Boolean isRead,
    LocalDateTime createdAt
) {}
