# [B-M3-02] 기술 구현 계획 (Tech Spec)

`M3_02_Chat.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다.

## 1. Data Transfer Layer (DTO)
- **`ChatRoomRequest.java`**: `productId`를 담는 요청 객체.
- **`ChatMessageRequest.java`**: `text`를 담는 요청 객체.
- **`ChatRoomResponse.java`**: `roomId`, `productId`, `buyerId`, `sellerId` 응답.
- **`ChatMessageResponse.java`**: `messageId`, `senderId`, `text`, `createdAt` 응답.
- **`ChatRoomListResponse.java`**: 내 채팅방 목록용. (상대방 닉네임, 상품 썸네일, 최근 메시지 등 포함)

## 2. Business Logic Layer (Service)
- **`ChatService.java`**
  - 공통 권한 검증: `validateRoomParticipant(ChatRoom room, Long userId)` (방에 속한 구매자나 판매자만 접근 가능)
  - `getOrCreateRoom(Long productId, Long buyerId)`: 자기 상품인지 체크, 방 생성 후 `ChatRoomResponse` 반환.
  - `sendMessage(Long roomId, Long senderId, String text)`: 방 참여자 확인 후 메시지 저장, `ChatMessageResponse` 반환.
  - `getMessages(Long roomId, Long userId)`: 방 참여자 확인 후 `List<ChatMessageResponse>` 반환.
  - `getMyRooms(Long userId)`: 내가 구매자거나 판매자인 방을 찾아 `ChatRoomListResponse`로 매핑하여 반환.

## 3. Presentation Layer (Controller)
- **`ChatController.java`**
  - 기존 `/api/chat`을 `/api/v1/chat`으로 변경.
  - 헤더 `X-User-Id`를 강제 수신.
  - 모든 반환값을 `ResponseEntity<DTO>` 형태로 감싸서 응답.

## 4. Exception Layer
- 방 참여자가 아닐 시 `UnauthorizedAccessException` 사용.
