package com.carrot.backend.repository;

import com.carrot.backend.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    org.springframework.data.domain.Page<Product> findAllByStatusNotInOrderByCreatedAtDesc(java.util.Collection<String> statuses, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findByTitleContainingIgnoreCaseAndStatusNotInOrderByCreatedAtDesc(String keyword, java.util.Collection<String> statuses, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findBySeller_IdNotAndStatusNotInOrderByCreatedAtDesc(Long sellerId, java.util.Collection<String> statuses, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findByTitleContainingIgnoreCaseAndSeller_IdNotAndStatusNotInOrderByCreatedAtDesc(String keyword, Long sellerId, java.util.Collection<String> statuses, org.springframework.data.domain.Pageable pageable);
    org.springframework.data.domain.Page<Product> findBySeller_IdAndStatusNotInOrderByCreatedAtDesc(Long sellerId, java.util.Collection<String> statuses, org.springframework.data.domain.Pageable pageable);
    java.util.List<Product> findAllBySeller_Id(Long sellerId);
}
