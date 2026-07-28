# [B-M2-01] 상품 등록 API (다중 이미지 및 상태 추가)

## 1. 작업 개요
기존 장난감 수준이었던 단일 이미지 업로드 기능을 폐기하고, 당근마켓 실무 수준에 맞춰 최대 10장의 다중 이미지 업로드 및 '판매 상태'를 관리할 수 있는 V2 상품 등록 API를 구현한다.

## 2. 관련 엔티티 (DB 테이블)
- `PRODUCTS` (수정)
- `PRODUCT_IMAGES` (신규)

## 3. API 명세 (Endpoint)
- **Method:** `POST`
- **URL:** `/api/v1/products`
- **Headers:** `X-User-Id: {userId}`, `Content-Type: multipart/form-data`
- **Request Parameters:**
  - `title` (String): 상품 제목
  - `content` (String): 상품 내용
  - `price` (Integer): 가격 (0원 이상)
  - `images` (List<MultipartFile>): 다중 이미지 (최대 10개)
- **Response Body:** `201 Created`
  ```json
  {
    "productId": 1,
    "status": "SALE",
    "imageUrls": ["uuid-1.webp", "uuid-2.webp"]
  }
  ```

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] 기존 V1 엔드포인트(`/api/products`)를 V2(`/api/v1/products`)로 마이그레이션.
- [ ] `PRODUCTS` 테이블에 `status` (SALE, RESERVED, SOLD) 컬럼 추가 및 기본값 SALE 지정.
- [ ] 단일 `imageUrl` 컬럼을 삭제하고, 1:N 관계인 `PRODUCT_IMAGES` 테이블을 새로 만들어 이미지 여러 장을 저장 (`orderIndex` 포함).
- [ ] 최대 10장까지만 업로드 가능하도록 방어 로직 추가.
- [ ] (참고) 프론트엔드가 WebP로 이미 압축해서 보낼 예정이므로 서버는 단순 로컬 저장만 수행.

## 5. 예외 처리 (Exception Handling)
- [ ] 이미지가 10장을 초과할 경우 `400 Bad Request` 반환.
- [ ] 가격이 음수일 경우 `400 Bad Request` 반환.
- [ ] 탈퇴한 회원이 상품 등록 시도 시 `403 Forbidden` 반환.

## 6. 완료 조건 (DoD)
- [ ] Product 엔티티 수정 및 ProductImage 엔티티 신규 생성.
- [ ] 컨트롤러 및 서비스에서 다중 MultipartFile을 받아 로컬 스토리지에 저장하는 로직 구현.
- [ ] Postman으로 사진 3장 동시 업로드 테스트 통과.
