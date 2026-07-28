package com.carrot.backend.repository;

import com.carrot.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    org.springframework.data.domain.Page<Product> findAllByOrderByCreatedAtDesc(org.springframework.data.domain.Pageable pageable);
}
