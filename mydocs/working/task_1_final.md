# Task 1: 오라클 클라우드 배포 및 파이어베이스 인증 연동

## 1. 개요
- **목표:** 로컬 환경에서 개발된 Spring Boot + React 앱을 오라클 클라우드 VM 서버에 배포하고, Firebase 구글 로그인이 실 서비스 도메인에서 정상 작동하도록 구성한다.
- **관련 커밋:** `3c0b44c`, `e11fe62`

## 2. 작업 내용
1. **서버 인프라 구축 및 설정**
   - 오라클 클라우드 우분투 VM 환경 구성.
   - DuckDNS를 이용해 도메인(`ywmarket.duckdns.org`) 할당 및 Nginx 리버스 프록시 구성.
   - Certbot을 활용한 Let's Encrypt SSL/TLS 인증서 적용(HTTPS).

2. **프론트엔드 및 백엔드 배포**
   - 백엔드(Spring Boot): `.jar` 파일 빌드 후 SCP로 업로드, 백그라운드(`nohup`) 실행.
   - 프론트엔드(React/Vite): `npm run build` 후 정적 파일(dist)을 Nginx 웹 루트(`/var/www/html/`)에 배포.

3. **파이어베이스(Firebase) 구글 로그인 연동 버그 수정**
   - **문제:** 배포된 도메인에서 구글 로그인 시 `auth/unauthorized-domain` 에러 발생.
   - **해결:** Firebase Console의 Authentication 설정에서 승인된 도메인(Authorized domains) 목록에 `ywmarket.duckdns.org` 추가.
   
4. **CORS (Cross-Origin Resource Sharing) 문제 해결**
   - **문제:** 로그인 후 백엔드의 `/api/users/auth`로 사용자 정보를 POST할 때 403 Forbidden 에러 발생.
   - **해결:** 백엔드의 `application.properties`의 `cors.allowed-origins` 항목에 `https://ywmarket.duckdns.org`를 명시적으로 추가하여 요청 허용.

## 3. 최종 검증
- [x] HTTPS 접속 확인
- [x] 상품 목록 및 데이터베이스 정상 호출 확인
- [x] 구글 로그인 정상 연동 및 유저 데이터 DB 적재 확인
