# [B-M1-03] 기술 구현 계획 (Tech Spec)

`M1_03_SoftDelete.md` 작업 지시서를 바탕으로 백엔드 코드를 구현하기 위한 기술 계획입니다.

## 1. Business Logic Layer (Service)

- **`UserService.java` (수정)**
  - `deleteUser(Long userId)` 메서드 추가.
  - 기존에 만들어둔 `getUserById(userId)` 헬퍼 메서드를 호출하여 유저를 가져온 뒤(여기서 이미 탈퇴 여부 검증됨), `user.setIsDeleted(true)`를 호출하여 Soft Delete 처리.

## 2. Presentation Layer (Controller)

- **`UserController.java` (수정)**
  - `@DeleteMapping("/me")` 엔드포인트 추가.
  - `@RequestHeader("X-User-Id") Long userId`를 받아 `userService.deleteUser(userId)`를 호출하고, `ResponseEntity.noContent().build()` 반환.

*(기존 도메인과 예외 처리는 M1-01과 M1-02에서 모두 만들어두었으므로, 이번 작업은 매우 빠르고 간단합니다.)*
