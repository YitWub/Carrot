# [B-M2-01] 기술 구현 계획 (Tech Spec)

`M2_01_ProductUpload.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다.

## 1. Database Layer (도메인)

- **`Product.java` (수정)**
  - 기존 단일 `imageUrl` 필드 삭제.
  - `String status = "SALE";` 필드 추가.
  - `@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)` 설정으로 `ProductImage` 리스트 추가.

- **`ProductImage.java` (신규)**
  - `id`, `product`(ManyToOne), `imageUrl`, `orderIndex` 필드를 가진 엔티티 생성.

- **`ProductImageRepository.java` (신규)**
  - `JpaRepository<ProductImage, Long>` 상속.

## 2. Business Logic Layer (Service)

- **`ProductService.java` (수정)**
  - 기존 `createProduct` 파라미터를 `List<MultipartFile> images`로 변경.
  - 이미지 개수 검증 로직 추가 (최대 10개).
  - for문으로 다중 이미지를 순회하며 UUID 파일명 생성 후 `uploads` 폴더에 저장.
  - 저장된 이미지들을 `ProductImage` 엔티티로 만들어 `Product`와 매핑 후 DB 저장.

## 3. Presentation Layer (Controller)

- **`ProductController.java` (수정)**
  - `@RequestMapping("/api/v1/products")`로 V2 승격.
  - `@PostMapping` 시 `List<MultipartFile> images`를 받도록 파라미터 튜닝.
  - 응답 포맷을 단순 Product 리턴에서 `ProductCreateResponse` DTO로 감싸서 반환하도록 설계.
