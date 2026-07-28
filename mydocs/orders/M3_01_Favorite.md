# [B-M3-01] 찜하기 및 찜 취소 API

## 1. 작업 개요
사용자가 마음에 드는 상품에 하트(찜)를 누르고, 다시 눌러서 취소할 수 있는 기능을 구현한다. 해당 상품이 얼마나 인기가 있는지 알 수 있도록 상품 테이블의 찜 횟수를 함께 관리한다.

## 2. 관련 엔티티 (DB 테이블)
- `FAVORITES` (신규 매핑 테이블)
- `PRODUCTS` (찜 횟수 관리용 컬럼 추가)
- `USERS`

## 3. API 명세 (Endpoint)

### 3.1. 찜하기 (하트 켜기)
- **Method:** `POST`
- **URL:** `/api/v1/products/{productId}/favorites`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `200 OK`
  ```json
  {
    "productId": 1,
    "isFavorited": true,
    "totalFavorites": 15
  }
  ```

### 3.2. 찜 취소 (하트 끄기)
- **Method:** `DELETE`
- **URL:** `/api/v1/products/{productId}/favorites`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `200 OK`
  ```json
  {
    "productId": 1,
    "isFavorited": false,
    "totalFavorites": 14
  }
  ```

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] `FAVORITES` 테이블을 신규 생성하여 유저(User)와 상품(Product)을 N:M으로 연결한다.
- [ ] 찜하기 시, 이미 찜한 상태인지 중복 검사를 수행한다.
- [ ] 찜하기/취소 시, `Product` 테이블의 `favoriteCount`를 1 증가시키거나 1 감소시켜 빠른 조회를 지원한다.
- [ ] 자신의 상품에는 찜할 수 없도록 막는다. (옵션: 당근마켓은 자기 상품 찜이 안됨)

## 5. 완료 조건 (DoD)
- [ ] Favorite 엔티티 및 Repository 구현.
- [ ] Product 엔티티에 favoriteCount 컬럼 추가.
- [ ] FavoriteService, FavoriteController에 Toggle 로직 구현 및 테스트.
