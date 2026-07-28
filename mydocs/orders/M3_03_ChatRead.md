# [B-M3-03] 채팅 읽음/안 읽음 표시 로직 처리

## 1. 작업 개요
상대방이 보낸 메시지를 확인하면 메시지에 표시된 읽지 않음(숫자 1 등) 상태가 사라지도록 '읽음 처리' API를 구현한다.

## 2. 관련 엔티티
- `CHAT_MESSAGES`

## 3. API 명세 (Endpoint)

### 3.1. 특정 채팅방 메시지 모두 읽음 처리
- **Method:** `PATCH`
- **URL:** `/api/v1/chat/rooms/{roomId}/read`
- **Headers:** `X-User-Id: {userId}`
- **Response:** `200 OK`

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] `ChatMessage` 엔티티에 `isRead` (boolean, 기본값 false) 필드를 추가한다.
- [ ] 내가 속한 채팅방에 들어가면, **상대방이 보낸 메시지** 중 `isRead`가 `false`인 것들을 모두 `true`로 바꾼다.
- [ ] (보안) 자신이 속하지 않은 채팅방에 대한 읽음 처리는 거부(`403 Forbidden`)해야 한다.

## 5. 완료 조건 (DoD)
- [ ] ChatMessage 엔티티 `isRead` 필드 추가.
- [ ] ChatMessageRepository 벌크 업데이트 쿼리(`markAsRead`) 작성.
- [ ] ChatService, ChatController 읽음 처리 로직 추가.
