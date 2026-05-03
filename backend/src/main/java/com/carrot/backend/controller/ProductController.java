package com.carrot.backend.controller;

import com.carrot.backend.domain.Product;
import com.carrot.backend.dto.ProductRequest;
import com.carrot.backend.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "${cors.allowed-origins}")
@RestController // "나는 프론트엔드랑 소통하는 API 안내데스크(웨이터)야!" 라는 포스트잇
@RequestMapping("/api/products") // 웹 주소가 "/api/products" 로 들어올 때 담당
public class ProductController {

    // 웨이터는 주문을 셰프(Service)에게 전달해야 하므로 연결
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // (프론트엔드) GET 방식으로 상품 목록 달라고 찌르면 실행되는 함수
    @GetMapping
    public List<Product> showProductList() {
        // 셰프에게 요리(상품 목록)를 부탁해서 프론트엔드(화면)로 서빙
        return productService.getAllProducts();
    }

    @PostMapping
    public Product uploadProduct(
            @org.springframework.web.bind.annotation.RequestParam String title,
            @org.springframework.web.bind.annotation.RequestParam String content,
            @org.springframework.web.bind.annotation.RequestParam Integer price,
            @org.springframework.web.bind.annotation.RequestParam Long sellerId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) org.springframework.web.multipart.MultipartFile image) {
        return productService.createProduct(title, content, price, sellerId, image);
    }

    // 주소창에 "/api/products/숫자" 로 들어오면 이 함수가 실행됩니다! (특정 상품 조회) ???
    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        // 주소에서 뽑아낸 번호(id)를 셰프에게 건네주며 찾아오라고 지시
        return productService.getProduct(id);
    }
}
