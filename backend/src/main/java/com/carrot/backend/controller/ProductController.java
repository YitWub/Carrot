package com.carrot.backend.controller;

import com.carrot.backend.dto.ProductCreateResponse;
import com.carrot.backend.dto.ProductDetailResponse;
import com.carrot.backend.dto.ProductListResponse;
import com.carrot.backend.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductListResponse>> showProductList(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(productService.getAllProducts(pageable, userId, keyword));
    }

    @PostMapping
    public ResponseEntity<?> uploadProduct(
            @RequestHeader("X-User-Id") Long sellerId,
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam Integer price,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) List<MultipartFile> images) {
        try {
            ProductCreateResponse response = productService.createProduct(title, content, price, sellerId, images, location);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProduct(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            return ResponseEntity.ok(productService.getProductDetail(id, userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateProductStatus(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody java.util.Map<String, String> body) {
        try {
            productService.updateProductStatus(id, userId, body.get("status"));
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProduct(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody com.carrot.backend.dto.ProductUpdateRequest request) {
        try {
            productService.updateProduct(id, userId, request);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        productService.deleteProduct(id, userId);
        return ResponseEntity.noContent().build();
    }
}
