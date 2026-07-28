# [B-M2-03] 상품 상태 변경 및 수정/삭제 API

## 1. 작업 개요
판매자가 자신이 등록한 상품의 상태(판매중, 예약중, 판매완료)를 변경하거나, 상품의 내용(제목, 가격, 설명)을 수정하고, 더 이상 팔지 않을 상품을 삭제하는 기능을 구현한다.

## 2. 관련 엔티티
- `PRODUCTS`
- `PRODUCT_IMAGES` (상품 삭제 시 연쇄 삭제 대상)

## 3. API 명세 (Endpoint)

### 3.1. 상품 상태 변경
- **Method:** `PATCH`
- **URL:** `/api/v1/products/{productId}/status`
- **Headers:** `X-User-Id: {userId}`
- **Request Parameters (or Body):** `status` (String: "SALE", "RESERVED", "SOLD")
- **Response:** `200 OK` (수정된 상태 반환)

### 3.2. 상품 수정
- **Method:** `PUT`
- **URL:** `/api/v1/products/{productId}`
- **Headers:** `X-User-Id: {userId}`
- **Request Body:**
  ```json
  {
    "title": "수정된 제목",
    "content": "수정된 내용입니다.",
    "price": 900000
  }
  ```
- **Response:** `200 OK`

### 3.3. 상품 삭제
- **Method:** `DELETE`
- **URL:** `/api/v1/products/{productId}`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `204 No Content`

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] **권한 검증:** 요청 헤더의 `X-User-Id`가 해당 상품의 `sellerId`와 일치하는지 반드시 검증한다. (남의 상품을 수정/삭제할 수 없도록 방어)
- [ ] **상태 변경:** 유효한 상태값("SALE", "RESERVED", "SOLD")만 허용한다.
- [ ] **삭제 로직:** 상품을 삭제하면, DB에 묶여있는 `PRODUCT_IMAGES` 데이터도 함께 삭제되도록 JPA Cascade 연관관계를 활용한다. (이미 설정 완료됨)

## 5. 예외 처리
- [ ] 상품을 찾을 수 없는 경우 `404 Not Found`
- [ ] 권한이 없는 사용자(판매자가 아님)일 경우 `403 Forbidden`
- [ ] 잘못된 상태값 입력 시 `400 Bad Request`

## 6. 완료 조건 (DoD)
- [ ] ProductUpdateRequest DTO 생성.
- [ ] ProductService에 updateStatus, updateProduct, deleteProduct 로직 구현.
- [ ] ProductController에 PATCH, PUT, DELETE 엔드포인트 구현.
