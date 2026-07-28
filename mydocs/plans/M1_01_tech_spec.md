# [M1-01] 기술 구현 계획 (Tech Spec)

`M1_01_Auth.md` 작업 지시서를 바탕으로, Spring Boot 백엔드 코드를 구현하기 위한 상세 기술 계획입니다.

## 1. Database Layer (도메인 및 데이터베이스 연동)

- **`User.java` (Domain Entity)**
  - ERD 명세에 따른 `User` 엔티티 생성.
  - `firebaseUid`, `nickname`, `profileImageUrl`, `mannerTemp`(기본값 36.5), `isDeleted`(기본값 false) 필드 구성.
  - JPA `@Entity`, `@Table(name = "users")` 어노테이션 적용.

- **`UserRepository.java` (Repository)**
  - `JpaRepository<User, Long>` 상속.
  - `Optional<User> findByFirebaseUid(String firebaseUid)` 쿼리 메서드 추가.

---

## 2. Data Transfer Layer (DTO)

- **`AuthLoginRequest.java` (DTO)**
  - 프론트엔드로부터 받을 JSON 데이터 바인딩 클래스.
  - 필드: `firebaseToken`, `email`, `displayName`, `photoUrl`

- **`AuthLoginResponse.java` (DTO)**
  - 프론트엔드로 응답할 JSON 데이터 클래스.
  - 필드: `userId`, `nickname`, `mannerTemp`, `isNewUser`

---

## 3. Business Logic Layer (비즈니스 로직)

- **`AuthService.java` (Service)**
  - **핵심 로직 1:** 전달받은 `firebaseToken`을 검증. (초기 단계에서는 단순 Mock 검증 또는 Firebase SDK 연동)
  - **핵심 로직 2:** `UserRepository`를 통해 유저 조회.
    - 유저가 없으면: 신규 회원가입 처리 (랜덤 닉네임 생성, DB 저장 후 `isNewUser = true` 반환).
    - 유저가 있으면: 기존 정보 반환. 단, `isDeleted == true`인 경우 커스텀 예외(`UserDeletedException`) 발생.

- **`UserDeletedException.java` (Exception)**
  - 탈퇴한 유저 접근 시 403 Forbidden 에러를 발생시킬 커스텀 예외 클래스.

---

## 4. Presentation Layer (API 엔드포인트)

- **`AuthController.java` (Controller)**
  - `@RestController` 및 `@RequestMapping("/api/v1/auth")` 적용.
  - `@PostMapping("/login")` 엔드포인트 구현.
  - `AuthLoginRequest`를 받아 `AuthService`에 넘기고, `AuthLoginResponse`를 프론트엔드에 반환.
