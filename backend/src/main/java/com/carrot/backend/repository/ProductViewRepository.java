package com.carrot.backend.repository;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.ProductView;
import com.carrot.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductViewRepository extends JpaRepository<ProductView, Long> {
    boolean existsByUserAndProduct(User user, Product product);
}
