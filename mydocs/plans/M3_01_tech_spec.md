# [B-M3-01] 기술 구현 계획 (Tech Spec)

`M3_01_Favorite.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다.

## 1. Database Layer (도메인)

- **`Favorite.java` (신규)**
  - 필드: `id`, `user` (ManyToOne), `product` (ManyToOne), `createdAt`.
  - 유니크 제약조건: 한 유저가 같은 상품을 여러 번 찜할 수 없도록 `User`와 `Product` 조합에 복합 유니크 키 적용.

- **`Product.java` (수정)**
  - `private int favoriteCount = 0;` 필드 추가.
  - `increaseFavoriteCount()`, `decreaseFavoriteCount()` 헬퍼 메서드 추가.

- **`FavoriteRepository.java` (신규)**
  - `Optional<Favorite> findByUserAndProduct(User user, Product product);`
  - `boolean existsByUserAndProduct(User user, Product product);`

## 2. Data Transfer Layer (DTO)

- **`FavoriteResponse.java` (신규)**
  - 필드: `productId`, `isFavorited`(Boolean), `totalFavorites`(Integer).

## 3. Business Logic Layer (Service)

- **`FavoriteService.java` (신규)**
  - `toggleFavorite(Long productId, Long userId)`
    - 상품과 유저 조회 (없으면 예외).
    - 본인 상품인지 검사 (본인 상품이면 예외).
    - `FavoriteRepository.findByUserAndProduct`로 기존 찜 내역 조회.
    - 내역이 **있으면**: 찜 취소 (`repository.delete`, `product.decreaseFavoriteCount()`, `isFavorited=false`).
    - 내역이 **없으면**: 찜 추가 (`repository.save`, `product.increaseFavoriteCount()`, `isFavorited=true`).
    - `FavoriteResponse` DTO 반환.

## 4. Presentation Layer (Controller)

- **`FavoriteController.java` (신규)**
  - `@PostMapping("/api/v1/products/{productId}/favorites")`
  - (RESTful 원칙상 POST/DELETE를 나누는 것도 좋지만, 프론트엔드 연동의 편의성을 위해 단일 POST Toggle 엔드포인트로 구현하거나 POST/DELETE로 명확히 나눕니다. 여기서는 PRD 명세대로 명확히 나누겠습니다.)
  - `@PostMapping`: 찜 추가 (이미 있으면 예외 또는 무시)
  - `@DeleteMapping`: 찜 취소 (없으면 예외 또는 무시)
  - -> **정정:** 편의성과 실무 트렌드(토글)를 반영해, 두 엔드포인트에서 동일하게 Service의 `toggleFavorite`(또는 각각 `add`, `remove`)를 호출하도록 설계합니다.
