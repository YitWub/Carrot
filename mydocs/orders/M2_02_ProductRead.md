# [B-M2-02] 상품 리스트 및 상세 조회 API

## 1. 작업 개요
홈 화면(상품 리스트)과 상품 상세 화면에서 필요한 데이터를 최적화하여 내려주는 조회 API를 구현한다. 무거운 DB 엔티티를 직접 반환하던 기존 V1 방식을 폐기하고, 프론트엔드가 정확히 필요로 하는 데이터만 DTO로 매핑하여 반환한다.

## 2. 관련 엔티티
- `PRODUCTS`, `PRODUCT_IMAGES`, `USERS`

## 3. API 명세 (Endpoint)

### 3.1. 상품 리스트 조회 (홈 화면)
- **Method:** `GET`
- **URL:** `/api/v1/products?page=0&size=10`
- **Response Body:** `200 OK`
  ```json
  {
    "content": [
      {
        "productId": 1,
        "title": "맥북 팝니다",
        "price": 1000000,
        "status": "SALE",
        "thumbnailUrl": "uuid-1.webp",
        "sellerNickname": "당근유저_a1b2",
        "createdAt": "2026-07-16T12:00:00"
      }
    ],
    "totalPages": 5,
    "totalElements": 48
  }
  ```

### 3.2. 상품 상세 조회
- **Method:** `GET`
- **URL:** `/api/v1/products/{productId}`
- **Response Body:** `200 OK`
  ```json
  {
    "productId": 1,
    "title": "맥북 팝니다",
    "content": "상태 아주 좋습니다. 네고 불가.",
    "price": 1000000,
    "status": "SALE",
    "sellerId": 5,
    "sellerNickname": "당근유저_a1b2",
    "sellerProfileImageUrl": "https://...",
    "sellerMannerTemp": 36.5,
    "imageUrls": ["uuid-1.webp", "uuid-2.webp"],
    "createdAt": "2026-07-16T12:00:00"
  }
  ```

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] **리스트 조회:** `Pageable`을 적용하여 무한 스크롤이 가능하도록 페이징 처리한다. 썸네일은 `PRODUCT_IMAGES` 중 첫 번째 사진(`orderIndex=0`)을 반환한다.
- [ ] **상세 조회:** 상품 정보와 판매자 정보, 그리고 다중 이미지 배열을 한 번에 묶어서 반환한다. (Fetch Join을 고려하여 N+1 문제 방어)
- [ ] DB 엔티티(`Product`)를 절대 컨트롤러 밖으로 그대로 노출하지 않고, 반드시 DTO로 변환하여 반환한다.

## 5. 예외 처리
- [ ] 존재하지 않는 `productId` 조회 시 `404 Not Found` 반환.

## 6. 완료 조건 (DoD)
- [ ] ProductListResponse, ProductDetailResponse DTO 생성.
- [ ] ProductController & ProductService 조회 로직 DTO 변환 및 페이징 적용.
- [ ] Postman으로 리스트 조회 및 상세 조회 테스트 통과.
