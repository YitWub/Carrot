# Carrot V2 시스템 아키텍처 (System Architecture)

당근마켓 V2 기획과 화면 명세를 바탕으로, 전체 시스템을 구성하는 기술 스택과 서버 구조를 정의합니다.

## 1. 프론트엔드 (Frontend)
- **Framework:** React + TypeScript (또는 JavaScript)
- **State Management:** Zustand (전역 상태 관리: 현재 로그인한 유저 정보, 알림 상태 유지 등)
- **Routing:** React Router v6 (SPA 화면 전환)
- **Styling:** CSS Modules 또는 TailwindCSS
- **Storage:** 브라우저 LocalStorage (최근 본 글 저장 용도)

## 2. 백엔드 (Backend)
- **Framework:** Spring Boot (Java)
- **Database (RDBMS):** PostgreSQL 또는 MySQL (관계형 데이터베이스)
- **ORM:** Spring Data JPA (Hibernate)
- **API Spec:** RESTful API

## 3. 공통 인프라 (Infrastructure)
- **Auth (인증):** Firebase Authentication (구글 소셜 로그인, JWT 토큰 발급 및 검증)
- **Image Storage:** 초기에는 서버의 로컬 파일 스토리지에 저장하며, 추후 AWS S3 또는 Oracle Cloud Object Storage로 마이그레이션.
- **Server:** Oracle Cloud VM (Nginx 리버스 프록시 적용)
