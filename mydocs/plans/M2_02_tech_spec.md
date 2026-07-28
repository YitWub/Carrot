# [B-M2-02] 기술 구현 계획 (Tech Spec)

`M2_02_ProductRead.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다.

## 1. Data Transfer Layer (DTO)

- **`ProductListResponse.java` (신규)**
  - 홈 화면에 보여줄 썸네일 데이터용 `record`.
  - 필드: `productId`, `title`, `price`, `status`, `thumbnailUrl`, `sellerNickname`, `createdAt`.

- **`ProductDetailResponse.java` (신규)**
  - 상품 상세 화면에 보여줄 전체 데이터용 `record`.
  - 필드: `productId`, `title`, `content`, `price`, `status`, `sellerId`, `sellerNickname`, `sellerProfileImageUrl`, `sellerMannerTemp`, `imageUrls`(List), `createdAt`.

## 2. Database Layer (Repository)

- **`ProductRepository.java` (수정)**
  - `findAllByOrderByCreatedAtDesc(Pageable pageable)` 등 페이징 및 최신순 정렬 쿼리 메서드 추가.

## 3. Business Logic Layer (Service)

- **`ProductService.java` (수정)**
  - `getAllProducts(Pageable pageable)`: Product 엔티티를 조회한 후, `ProductListResponse` DTO로 변환. 이미지 리스트 중 첫 번째 항목을 `thumbnailUrl`로 추출.
  - `getProductDetail(Long id)`: 특정 Product 조회 후 `ProductDetailResponse` DTO로 변환하여 판매자 정보 및 모든 이미지 URL 리스트 포함.
  - (기존 엔티티 반환 메서드는 삭제하거나 수정)

## 4. Presentation Layer (Controller)

- **`ProductController.java` (수정)**
  - `@GetMapping` 엔드포인트에서 `Pageable` 객체를 주입받아 페이징 지원.
  - 리스트 조회 시 `ResponseEntity<Page<ProductListResponse>>` 반환.
  - 상세 조회 시 `ResponseEntity<ProductDetailResponse>` 반환.
