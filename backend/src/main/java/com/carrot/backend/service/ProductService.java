package com.carrot.backend.service;

import com.carrot.backend.domain.Product;
import com.carrot.backend.domain.User;
import com.carrot.backend.dto.ProductRequest;
import com.carrot.backend.repository.ProductRepository;
import com.carrot.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service // "나는 비즈니스 로직을 처리하는 셰프(Service)야!" 라는 포스트잇
public class ProductService {

    // 셰프는 창고 관리자(Repository)가 필요하므로 연결해 줍니다.
    private final ProductRepository productRepository;
    private final UserRepository userRepository; // 사용자 창고 추가

    public ProductService(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // 창고 관리자에게 "모든 상품을 다 꺼내와!" 라고 지시하는 함수
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 프론트엔드에서 넘어온 정보(DTO)로 새 상품을 만들어서 창고에 보관!
    public Product createProduct(String title, String content, Integer price, Long sellerId, MultipartFile image) {
        User realUser = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Product newProduct = new Product();
        newProduct.setTitle(title);
        newProduct.setContent(content);
        newProduct.setPrice(price);
        newProduct.setSeller(realUser); 

        // 이미지 처리 로직
        if (image != null && !image.isEmpty()) {
            try {
                String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                String uploadDir = Paths.get("uploads").toFile().getAbsolutePath();
                File targetFile = new File(uploadDir, filename);
                image.transferTo(targetFile);
                newProduct.setImageUrl(filename);
            } catch (IOException e) {
                throw new RuntimeException("이미지 저장 실패", e);
            }
        }

        return productRepository.save(newProduct);
    }

    // 특정 ID의 상품 딱 하나만 창고 관리자(Repository)에게 찾아달라고 지시하는 함수
    public Product getProduct(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
    }
}