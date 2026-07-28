package com.carrot.backend.controller;

import com.carrot.backend.dto.FavoriteResponse;
import com.carrot.backend.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController
@RequestMapping("/api/v1/products/{productId}/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(
            @PathVariable Long productId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            FavoriteResponse response = favoriteService.addFavorite(productId, userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> removeFavorite(
            @PathVariable Long productId,
            @RequestHeader("X-User-Id") Long userId) {
        try {
            FavoriteResponse response = favoriteService.removeFavorite(productId, userId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
