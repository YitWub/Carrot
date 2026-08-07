package com.carrot.backend.service;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.ProductImage;
import com.carrot.backend.domain.User;
import com.carrot.backend.dto.ProductCreateResponse;
import com.carrot.backend.dto.ProductDetailResponse;
import com.carrot.backend.dto.ProductListResponse;
import com.carrot.backend.repository.ProductRepository;
import com.carrot.backend.repository.ProductViewRepository;
import com.carrot.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final com.carrot.backend.repository.FavoriteRepository favoriteRepository;
    private final ProductViewRepository productViewRepository;

    public ProductService(ProductRepository productRepository, UserRepository userRepository,
            com.carrot.backend.repository.FavoriteRepository favoriteRepository,
            ProductViewRepository productViewRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.productViewRepository = productViewRepository;
    }

    @Transactional(readOnly = true)
    public Page<ProductListResponse> getAllProducts(Pageable pageable, Long userId, String keyword) {
        Page<Product> products;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (hasKeyword) {
            products = productRepository.findByTitleContainingIgnoreCaseAndStatusNotInOrderByCreatedAtDesc(keyword,
                    java.util.List.of("SOLD", "DELETED"), pageable);
        } else {
            products = productRepository.findAllByStatusNotInOrderByCreatedAtDesc(java.util.List.of("SOLD", "DELETED"), pageable);
        }

        return products.map(this::convertToProductListResponse);
    }

    @Transactional(readOnly = true)
    public Page<ProductListResponse> getMyProducts(Pageable pageable, Long userId) {
        Page<Product> products = productRepository.findBySeller_IdAndStatusNotInOrderByCreatedAtDesc(userId, java.util.List.of("DELETED"), pageable);
        return products.map(this::convertToProductListResponse);
    }

    private ProductListResponse convertToProductListResponse(Product product) {
        String thumbnailUrl = null;
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            thumbnailUrl = product.getImages().get(0).getImageUrl();
        }

        return new ProductListResponse(
                product.getId(),
                product.getTitle(),
                product.getPrice(),
                product.getStatus(),
                thumbnailUrl,
                product.getLocation(),
                product.getSeller() != null ? product.getSeller().getNickname() : "알 수 없음",
                product.getCreatedAt());
    }

    @Transactional
    public ProductDetailResponse getProductDetail(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        List<String> imageUrls = product.getImages().stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());

        User seller = product.getSeller();

        boolean isFavorite = false;
        if (userId != null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                isFavorite = favoriteRepository.existsByUserAndProduct(user, product);

                // 조회수 중복 체크 및 증가 로직
                if (!productViewRepository.existsByUserAndProduct(user, product)) {
                    com.carrot.backend.domain.ProductView view = new com.carrot.backend.domain.ProductView(user,
                            product);
                    productViewRepository.save(view);
                    product.increaseViewCount();
                }
            }
        }

        return new ProductDetailResponse(
                product.getId(),
                product.getTitle(),
                product.getContent(),
                product.getPrice(),
                product.getStatus(),
                product.getLocation(),
                seller != null ? seller.getId() : null,
                seller != null ? seller.getNickname() : "알 수 없음",
                seller != null ? seller.getProfileImageUrl() : null,
                seller != null ? seller.getMannerTemp() : 36.5,
                imageUrls,
                product.getCreatedAt(),
                product.getFavoriteCount(),
                product.getViewCount(),
                isFavorite);
    }

    @Transactional
    public ProductCreateResponse createProduct(String title, String content, Integer price, Long sellerId,
            List<MultipartFile> images, String location) {
        User realUser = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        if (realUser.getIsDeleted()) {
            throw new RuntimeException("탈퇴한 회원은 상품을 등록할 수 없습니다.");
        }

        if (price != null && price < 0) {
            throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        }

        if (images != null && images.size() > 10) {
            throw new IllegalArgumentException("이미지는 최대 10장까지만 업로드할 수 있습니다.");
        }

        Product newProduct = new Product();
        newProduct.setTitle(title);
        newProduct.setContent(content);
        newProduct.setPrice(price);
        newProduct.setSeller(realUser);
        newProduct.setStatus("SALE");
        newProduct.setLocation(location != null ? location : "비산동");

        Product savedProduct = productRepository.save(newProduct);
        List<String> savedImageUrls = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            String uploadDir = Paths.get("uploads").toFile().getAbsolutePath();
            File dir = new File(uploadDir);
            if (!dir.exists())
                dir.mkdirs();

            for (int i = 0; i < images.size(); i++) {
                MultipartFile image = images.get(i);
                if (image.isEmpty())
                    continue;

                try {
                    String filename = UUID.randomUUID().toString() + ".webp";
                    File targetFile = new File(uploadDir, filename);
                    image.transferTo(targetFile);

                    ProductImage productImage = new ProductImage(savedProduct, filename, i);
                    savedProduct.addImage(productImage);
                    savedImageUrls.add(filename);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 저장 실패", e);
                }
            }
        }

        return new ProductCreateResponse(savedProduct.getId(), savedProduct.getStatus(), savedImageUrls);
    }

    private void validateSeller(Product product, Long userId) {
        if (!product.getSeller().getId().equals(userId)) {
            throw new com.carrot.backend.exception.UnauthorizedAccessException("해당 상품을 수정/삭제할 권한이 없습니다.");
        }
    }

    @Transactional
    public void updateProductStatus(Long productId, Long userId, String status) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        validateSeller(product, userId);

        if (!status.equals("SALE") && !status.equals("RESERVED") && !status.equals("SOLD")) {
            throw new IllegalArgumentException("올바르지 않은 상태값입니다.");
        }

        product.setStatus(status);
    }

    @Transactional
    public void updateProduct(Long productId, Long userId, com.carrot.backend.dto.ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        validateSeller(product, userId);

        if (request.price() != null && request.price() < 0) {
            throw new IllegalArgumentException("가격은 0원 이상이어야 합니다.");
        }

        if (request.title() != null)
            product.setTitle(request.title());
        if (request.content() != null)
            product.setContent(request.content());
        if (request.price() != null)
            product.setPrice(request.price());
        if (request.location() != null)
            product.setLocation(request.location());
    }

    @Transactional
    public void deleteProduct(Long productId, Long userId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        validateSeller(product, userId);

        product.setStatus("DELETED");
    }
}