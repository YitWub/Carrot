package com.carrot.backend.controller;

import com.carrot.backend.dto.UserProfileResponse;
import com.carrot.backend.dto.UserProfileUpdateRequest;
import com.carrot.backend.service.UserService;
import com.carrot.backend.service.FavoriteService;
import com.carrot.backend.dto.ProductListResponse;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;
    private final FavoriteService favoriteService;
    private final com.carrot.backend.service.ProductService productService;

    public UserController(UserService userService, FavoriteService favoriteService, com.carrot.backend.service.ProductService productService) {
        this.userService = userService;
        this.favoriteService = favoriteService;
        this.productService = productService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile(@RequestHeader("X-User-Id") Long userId) {
        UserProfileResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) String nickname,
            @RequestParam(required = false) org.springframework.web.multipart.MultipartFile profileImage) {
        
        try {
            UserProfileResponse response = userService.updateUserProfile(userId, nickname, profileImage);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyProfile(@RequestHeader("X-User-Id") Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me/favorites")
    public ResponseEntity<List<ProductListResponse>> getMyFavorites(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(favoriteService.getMyFavorites(userId));
    }

    @GetMapping("/me/products")
    public ResponseEntity<org.springframework.data.domain.Page<ProductListResponse>> getMyProducts(
            @RequestHeader("X-User-Id") Long userId,
            @org.springframework.data.web.PageableDefault(size = 20) org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(productService.getMyProducts(pageable, userId));
    }
}
