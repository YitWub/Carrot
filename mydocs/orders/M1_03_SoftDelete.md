# [B-M1-03] 회원 탈퇴 (Soft Delete) API

## 1. 작업 개요
마이페이지(나의 당근)에서 회원이 '회원 탈퇴' 버튼을 클릭했을 때, 실제 DB 레코드를 삭제(Hard Delete)하지 않고 `isDeleted` 플래그만 `true`로 변경하는 Soft Delete를 구현한다.

## 2. 관련 엔티티 (DB 테이블)
- `USERS`

## 3. API 명세 (Endpoint)

### 3.1. 회원 탈퇴
- **Method:** `DELETE`
- **URL:** `/api/v1/users/me`
- **Headers:** `X-User-Id: {userId}`
- **Response:**
  - 성공 시: `204 No Content` (반환 데이터 없음)

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] Header로 넘어온 `X-User-Id`를 통해 DB에서 유저를 조회한다.
- [ ] 이미 탈퇴한 회원이면 예외 처리한다.
- [ ] 유저의 `isDeleted` 필드를 `true`로 업데이트하고 저장한다.
- [ ] (참고) 향후 로그인 API(`AuthService`) 로직에 의해 탈퇴 회원은 로그인 시 403 에러가 발생해야 한다. (M1-01에서 이미 구현됨)

## 5. 예외 처리 (Exception Handling)
- [ ] 유저를 찾을 수 없는 경우 `404 Not Found` 반환
- [ ] 이미 탈퇴한 유저인 경우 `403 Forbidden` 반환

## 6. 완료 조건 (DoD)
- [ ] UserService에 deleteUser 로직 구현
- [ ] UserController에 DELETE 엔드포인트 구현
- [ ] 빌드 통과 및 성공/실패 엣지 케이스 로컬 검증
