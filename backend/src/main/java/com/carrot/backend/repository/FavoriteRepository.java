package com.carrot.backend.repository;

import com.carrot.backend.domain.Favorite;
import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
}
