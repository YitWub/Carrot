# Carrot V2 데이터베이스 관계도 (ERD)

기획된 핵심 기능(회원, 상품, 채팅, 찜)을 구현하기 위한 6개의 핵심 테이블 구조입니다.

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "registers"
    USERS ||--o{ FAVORITES : "likes"
    PRODUCTS ||--o{ PRODUCT_IMAGES : "contains"
    PRODUCTS ||--o{ FAVORITES : "liked_by"
    PRODUCTS ||--o{ CHAT_ROOMS : "trades_in"
    USERS ||--o{ CHAT_ROOMS : "participates_as_buyer"
    USERS ||--o{ CHAT_ROOMS : "participates_as_seller"
    CHAT_ROOMS ||--o{ CHAT_MESSAGES : "has"

    USERS {
        Long id PK
        String firebase_uid "구글 고유 ID"
        String nickname "닉네임"
        String profile_image_url "프로필 사진"
        Float manner_temp "매너온도 (기본 36.5)"
        Boolean is_deleted "탈퇴 여부 (Soft Delete)"
        DateTime created_at
    }

    PRODUCTS {
        Long id PK
        Long seller_id FK "판매자 (USERS.id)"
        String title "제목"
        String content "내용"
        Integer price "가격"
        String status "상태 (SALE, RESERVED, SOLD)"
        DateTime created_at
    }

    PRODUCT_IMAGES {
        Long id PK
        Long product_id FK "상품 (PRODUCTS.id)"
        String image_url "이미지 경로"
        Integer order_index "이미지 순서 (1~10)"
    }

    FAVORITES {
        Long id PK
        Long user_id FK "찜한 유저 (USERS.id)"
        Long product_id FK "찜한 상품 (PRODUCTS.id)"
        DateTime created_at
    }

    CHAT_ROOMS {
        Long id PK
        Long product_id FK "거래 상품 (PRODUCTS.id)"
        Long buyer_id FK "구매자 (USERS.id)"
        Long seller_id FK "판매자 (USERS.id)"
        DateTime created_at
    }

    CHAT_MESSAGES {
        Long id PK
        Long room_id FK "채팅방 (CHAT_ROOMS.id)"
        Long sender_id FK "보낸 사람 (USERS.id)"
        String message "메시지 내용"
        Boolean is_read "읽음 여부 (피그마 반영)"
        DateTime created_at
    }
```

## 핵심 설계 로직
1. **소프트 딜리트:** `USERS.is_deleted` 플래그를 사용하여 회원 탈퇴 시 데이터를 보존하면서 접근만 차단.
2. **채팅 읽음 처리:** `CHAT_MESSAGES.is_read`를 통해 상대방 접속 시 일괄 업데이트.
3. **다중 이미지:** `PRODUCTS` 테이블과 분리하여 `PRODUCT_IMAGES` 테이블에서 1:N 관계로 최대 10장 관리.
