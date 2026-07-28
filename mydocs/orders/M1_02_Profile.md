# [M1-02] 프로필 수정 및 조회 API

## 1. 작업 개요
마이페이지(나의 당근)에서 유저가 자신의 프로필 정보(닉네임, 매너온도 등)를 조회하고, 닉네임과 프로필 사진을 수정할 수 있는 기능을 구현한다.

## 2. 관련 엔티티 (DB 테이블)
- `USERS`

## 3. API 명세 (Endpoint)

### 3.1. 내 프로필 조회
- **Method:** `GET`
- **URL:** `/api/v1/users/me`
- **Headers:** `X-User-Id: {userId}` (인증 필터 도입 전까지 간이 인증용)
- **Response Body:**
  ```json
  {
    "userId": 1,
    "nickname": "당근유저_a1b2",
    "profileImageUrl": "https://...",
    "mannerTemp": 36.5,
    "createdAt": "2026-07-16T12:00:00"
  }
  ```

### 3.2. 내 프로필 수정
- **Method:** `PUT`
- **URL:** `/api/v1/users/me`
- **Headers:** `X-User-Id: {userId}`
- **Request Body:**
  ```json
  {
    "nickname": "새로운닉네임",
    "profileImageUrl": "https://new-image-url.com/image.png"
  }
  ```
- **Response Body:**
  ```json
  {
    "userId": 1,
    "nickname": "새로운닉네임",
    "profileImageUrl": "https://new-image-url.com/image.png",
    "mannerTemp": 36.5
  }
  ```

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] Header로 넘어온 `X-User-Id`를 통해 DB에서 유저를 조회한다.
- [ ] 조회 API 호출 시 탈퇴한 회원인 경우 접근을 차단한다.
- [ ] 수정 API 호출 시, 변경을 요청한 필드(닉네임, 사진)만 업데이트하고 DB에 저장한다.
- [ ] 닉네임은 최소 2자, 최대 10자로 제한한다.

## 5. 예외 처리 (Exception Handling)
- [ ] 유저를 찾을 수 없는 경우 `404 Not Found` 반환
- [ ] 탈퇴한 유저인 경우 `403 Forbidden` 반환
- [ ] 닉네임 길이 제한 위반 시 `400 Bad Request` 반환

## 6. 완료 조건 (DoD)
- [ ] Spring Boot 컨트롤러 및 서비스 로직 구현 완료
- [ ] `GET` 및 `PUT` 테스트 정상 동작 확인
