package com.carrot.backend.dto;

public record FavoriteResponse(
    Long productId,
    Boolean isFavorited,
    Integer totalFavorites
) {}
