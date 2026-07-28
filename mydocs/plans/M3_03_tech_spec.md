# [B-M3-03] 기술 구현 계획 (Tech Spec)

`M3_03_ChatRead.md` 작업 지시서를 바탕으로 한 백엔드 상세 구현 계획입니다. (사용자 직접 구현용)

## 1. Database Layer (도메인 & 레포지토리)

- **`ChatMessage.java` (수정)**
  - `private boolean isRead = false;` 필드 추가.
  - Getter/Setter 추가.

- **`ChatMessageRepository.java` (수정)**
  - 벌크 업데이트 쿼리를 작성하여 여러 메시지를 한 번에 읽음 처리.
  - `@Modifying`, `@Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.chatRoom = :room AND m.sender != :user AND m.isRead = false")`
  - 메서드명: `markMessagesAsRead(@Param("room") ChatRoom room, @Param("user") User currentUser)`

## 2. Data Transfer Layer (DTO)
- **`ChatMessageResponse.java` (수정)**
  - `Boolean isRead` 필드 추가.

## 3. Business Logic Layer (Service)
- **`ChatService.java` (수정)**
  - `markAsRead(Long roomId, Long userId)`
    - 방 권한 체크(`validateRoomParticipant`).
    - `chatMessageRepository.markMessagesAsRead(room, user)` 호출.
  - `getMessages(Long roomId, Long userId)`
    - 메시지를 불러올 때 `markAsRead`를 자동으로 호출하여 "조회하면 무조건 읽음 처리" 되도록 개선. (단방향 호출)
    - Response DTO에 `isRead` 값을 함께 매핑하여 반환.

## 4. Presentation Layer (Controller)
- **`ChatController.java` (수정)**
  - `@PatchMapping("/rooms/{roomId}/read")` 추가. (명시적 읽음 처리용)
