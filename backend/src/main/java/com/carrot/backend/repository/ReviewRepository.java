package com.carrot.backend.repository;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.Review;
import com.carrot.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByReviewerAndProduct(User reviewer, Product product);
}
