package com.carrot.backend.dto;

import java.util.List;

public record ProductCreateResponse(
    Long productId,
    String status,
    List<String> imageUrls
) {}
