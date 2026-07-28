# [M1-01] 구글 소셜 로그인 및 회원가입 API

## 1. 작업 개요
Firebase Auth를 통해 전달받은 구글 로그인 유저 정보를 우리 서비스 DB(`USERS` 테이블)에 등록하거나 조회한다. (최초 로그인 시 회원가입 처리)

## 2. 관련 엔티티 (DB 테이블)
- `USERS`

## 3. API 명세 (Endpoint)
- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "firebaseToken": "string",
    "email": "string",
    "displayName": "string",
    "photoUrl": "string"
  }
  ```
- **Response Body:**
  ```json
  {
    "userId": 1,
    "nickname": "string",
    "mannerTemp": 36.5,
    "isNewUser": true
  }
  ```

## 4. 기능 요구사항 및 비즈니스 로직
- [ ] 전달받은 `firebaseToken`이 유효한지 검증한다.
- [ ] 해당 유저가 DB에 없으면(최초 로그인) 랜덤 닉네임과 매너온도(36.5)를 부여하여 DB에 `INSERT` 한다.
- [ ] 탈퇴한 유저(`is_deleted = true`)가 재로그인 시도 시 접근을 막는다.

## 5. 예외 처리 (Exception Handling)
- [ ] 유효하지 않은 Firebase 토큰일 경우 `401 Unauthorized` 반환
- [ ] 필수 파라미터 누락 시 `400 Bad Request` 반환
- [ ] 이미 탈퇴 처리된 회원의 토큰일 경우 `403 Forbidden` 반환

## 6. 완료 조건 (DoD)
- [ ] Spring Boot 컨트롤러 및 서비스 로직 구현 완료
- [ ] Postman을 통한 테스트 케이스 정상 작동 확인
