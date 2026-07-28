# [B-M2-03] 기술 구현 계획 (Tech Spec)

`M2_03_ProductUpdate.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다.

## 1. Data Transfer Layer (DTO)

- **`ProductUpdateRequest.java` (신규)**
  - 상품 수정을 위한 DTO. 필드: `title`, `content`, `price`.

## 2. Business Logic Layer (Service)

- **`ProductService.java` (수정)**
  - 공통 헬퍼 메서드: `validateSeller(Product product, Long userId)` 
    - 상품의 작성자와 요청자가 일치하는지 확인. 다르면 `403 Forbidden` 커스텀 예외 발생.
  - `updateProductStatus(Long productId, Long userId, String status)`
    - 상태값이 `SALE`, `RESERVED`, `SOLD` 중 하나인지 검증.
    - 권한 검사 후 상태 변경. (JPA 더티체킹)
  - `updateProduct(Long productId, Long userId, ProductUpdateRequest request)`
    - 권한 검사 후 제목, 내용, 가격 변경. (가격 음수 검증 포함)
  - `deleteProduct(Long productId, Long userId)`
    - 권한 검사 후 `productRepository.delete(product)` 실행. (CascadeType.ALL 덕분에 이미지 연관 레코드도 삭제됨)

## 3. Presentation Layer (Controller)

- **`ProductController.java` (수정)**
  - `@PatchMapping("/{id}/status")` 엔드포인트: 상태 변경
  - `@PutMapping("/{id}")` 엔드포인트: 상품 수정
  - `@DeleteMapping("/{id}")` 엔드포인트: 상품 삭제

## 4. Exception (예외 클래스)
- **`UnauthorizedAccessException.java` (신규)**
  - 403 Forbidden 상태를 반환할 커스텀 에러. (본인 상품이 아닐 때)
