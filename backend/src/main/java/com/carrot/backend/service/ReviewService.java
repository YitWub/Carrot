package com.carrot.backend.service;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.Review;
import com.carrot.backend.domain.User;
import com.carrot.backend.dto.ReviewRequest;
import com.carrot.backend.repository.ProductRepository;
import com.carrot.backend.repository.ReviewRepository;
import com.carrot.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void createReview(Long reviewerId, ReviewRequest request) {
        User reviewer = userRepository.findById(reviewerId).orElseThrow(() -> new RuntimeException("작성자를 찾을 수 없습니다."));
        User reviewee = userRepository.findById(request.getRevieweeId()).orElseThrow(() -> new RuntimeException("대상자를 찾을 수 없습니다."));
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (!product.getStatus().equals("SOLD")) {
            throw new RuntimeException("거래 완료된 상품에만 후기를 남길 수 있습니다.");
        }

        if (reviewRepository.existsByReviewerAndProduct(reviewer, product)) {
            throw new RuntimeException("이미 이 상품에 대한 후기를 남겼습니다.");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setProduct(product);
        review.setScore(request.getScore());

        reviewRepository.save(review);

        // Update mannerTemp
        double currentTemp = reviewee.getMannerTemp();
        double newTemp = currentTemp + request.getScore();
        
        if (newTemp > 99.0) newTemp = 99.0;
        if (newTemp < 0.0) newTemp = 0.0;
        
        // Round to 1 decimal place
        newTemp = Math.round(newTemp * 10.0) / 10.0;
        
        reviewee.setMannerTemp(newTemp);
        userRepository.save(reviewee);
    }
}
