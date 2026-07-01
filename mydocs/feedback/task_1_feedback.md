# 피드백: 파이어베이스 로그인 CORS 및 도메인 에러

## 발생 일시
2026년 7월 1일 - 실서버 배포 직후 테스트 과정

## 문제 현상
1. 로그인 버튼 클릭 시 Firebase 팝업에서 `auth/unauthorized-domain` 에러 발생.
2. 위 문제를 해결하고 구글 로그인을 통과했으나, 백엔드로 사용자 정보를 넘기는 POST 요청에서 `403 Forbidden` (CORS 에러) 발생.

## 원인 분석
1. **도메인 미승인:** Firebase Console 설정 상, `localhost` 외의 도메인(예: `ywmarket.duckdns.org`)은 기본적으로 인증 요청이 차단됨.
2. **CORS 정책:** Spring Boot 백엔드의 `application.properties`에서 `cors.allowed-origins`에 실서버 도메인이 누락되어 있어 프론트엔드의 접근을 거부함.

## 해결 방법 및 배운 점
- **Firebase:** Authentication > Settings > Authorized domains에 실 도메인(`ywmarket.duckdns.org`)을 명시적으로 추가해야 함.
- **Spring Boot:** CORS 설정 시 로컬(`http://localhost:5999`)과 운영(`https://ywmarket.duckdns.org`) 도메인을 모두 콤마(,)로 구분하여 등록해두면 두 환경 모두에서 안전하게 API를 호출할 수 있음.

> 이 피드백을 통해 향후 다른 클라우드로 마이그레이션하거나 도메인이 변경될 경우, **CORS 및 Firebase Authorized Domain**을 1순위로 체크해야 함을 문서화함.
