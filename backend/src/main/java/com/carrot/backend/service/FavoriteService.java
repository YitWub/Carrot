package com.carrot.backend.service;

import com.carrot.backend.domain.Favorite;
import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.User;
import com.carrot.backend.dto.FavoriteResponse;
import com.carrot.backend.repository.FavoriteRepository;
import com.carrot.backend.repository.ProductRepository;
import com.carrot.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public FavoriteResponse addFavorite(Long productId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        if (product.getSeller().getId().equals(userId)) {
            throw new IllegalArgumentException("자신의 상품은 찜할 수 없습니다.");
        }

        if (favoriteRepository.existsByUserAndProduct(user, product)) {
            // 이미 찜한 상태면 무시하고 현재 상태 반환
            return new FavoriteResponse(productId, true, product.getFavoriteCount());
        }

        Favorite favorite = new Favorite(user, product);
        favoriteRepository.save(favorite);
        
        product.increaseFavoriteCount();
        // productRepository.save(product) is not strictly needed due to JPA dirty checking
        
        return new FavoriteResponse(productId, true, product.getFavoriteCount());
    }

    @Transactional
    public FavoriteResponse removeFavorite(Long productId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        Optional<Favorite> favoriteOpt = favoriteRepository.findByUserAndProduct(user, product);
        if (favoriteOpt.isPresent()) {
            favoriteRepository.delete(favoriteOpt.get());
            product.decreaseFavoriteCount();
        }

        return new FavoriteResponse(productId, false, product.getFavoriteCount());
    }
}
