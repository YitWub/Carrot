# [B-M3-02] 1:1 실시간 채팅방 생성 및 메시지 전송 API

## 1. 작업 개요
구매자가 상품 상세 페이지에서 '채팅하기'를 눌렀을 때 1:1 채팅방을 생성(또는 기존 방 조회)하고, 메시지를 주고받을 수 있는 API를 V2 스펙(DTO, 권한 헤더 적용)으로 고도화한다.

## 2. 관련 엔티티
- `CHAT_ROOMS`, `CHAT_MESSAGES`, `PRODUCTS`, `USERS`

## 3. API 명세 (Endpoint)

### 3.1. 채팅방 생성 (또는 조회)
- **Method:** `POST`
- **URL:** `/api/v1/chat/rooms`
- **Headers:** `X-User-Id: {buyerId}`
- **Request Body:** `{"productId": 1}`
- **Response:** `200 OK` (기존 방) or `201 Created` (새 방)
  ```json
  {
    "roomId": 1,
    "productId": 1,
    "buyerId": 5,
    "sellerId": 2
  }
  ```

### 3.2. 메시지 전송
- **Method:** `POST`
- **URL:** `/api/v1/chat/rooms/{roomId}/messages`
- **Headers:** `X-User-Id: {senderId}`
- **Request Body:** `{"text": "안녕하세요! 네고 되나요?"}`
- **Response:** `200 OK`
  ```json
  {
    "messageId": 10,
    "senderId": 5,
    "text": "안녕하세요! 네고 되나요?",
    "createdAt": "2026-07-17T15:00:00"
  }
  ```

### 3.3. 채팅방 메시지 내역 조회
- **Method:** `GET`
- **URL:** `/api/v1/chat/rooms/{roomId}/messages`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `200 OK` (List of Message DTOs)

### 3.4. 내 채팅방 목록 조회
- **Method:** `GET`
- **URL:** `/api/v1/chat/my-rooms`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `200 OK` (List of ChatRoomListResponse DTOs)

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] 기존 V1 구조의 엔티티 반환 코드를 모두 폐기하고 DTO로 변환한다.
- [ ] 권한 검증: 내가 속하지 않은 채팅방의 메시지를 조회하거나 전송할 수 없도록 차단한다.
- [ ] 구매자가 자기 자신의 상품에 채팅을 걸 수 없도록 방어한다.

## 5. 완료 조건 (DoD)
- [ ] ChatRoomResponse, ChatMessageResponse 등 관련 DTO 구현.
- [ ] ChatService에 권한 검증 로직 추가 및 Controller V2 포팅.
- [ ] (참고) 현재는 REST API 기반이며, 추후 실시간성이 강력하게 필요할 시 STOMP/WebSocket으로 확장 가능하도록 구조를 분리해 둔다.
