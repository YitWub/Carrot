package com.carrot.backend.controller;

import com.carrot.backend.dto.ReviewRequest;
import com.carrot.backend.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Void> createReview(@RequestHeader("X-User-Id") Long userId, @RequestBody ReviewRequest request) {
        reviewService.createReview(userId, request);
        return ResponseEntity.ok().build();
    }
}
