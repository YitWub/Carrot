# 🥕 용원 마켓 (Carrot Market Clone Project)

Vite(React) + Spring Boot(Java) 기반의 당근마켓 클론 코딩 프로젝트입니다. 
본 가이드는 학부생 및 공동 개발자를 위해 로컬 환경 구축 방법부터 오라클 클라우드 배포 가이드까지 설명합니다.

---

## 📋 프로젝트 방법론 (Methodology)

이 프로젝트는 **Hyper-Waterfall** 방법론을 채택하여 관리됩니다.
- 거시적인 작업 계획과 아키텍처는 체계적인 문서(워터폴)로 남깁니다.
- 실제 기능 구현과 테스트는 AI의 도움을 받아 아주 짧은 주기로 빠르게 실행(애자일)합니다.
- 모든 진행 내역은 커밋 메시지에만 의존하지 않고, `mydocs/` 폴더 내에 투명하게 기록됩니다.
  - `mydocs/orders/` : 할 일(Task) 목록
  - `mydocs/plans/` : 기획 및 구현 계획서
  - `mydocs/working/` : 작업 진행 상태 및 결과 보고서 (`task_N_final.md`)
  - `mydocs/feedback/` : 리뷰 및 버그 피드백

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 상세 역할 |
| --- | --- | --- |
| **Frontend** | React, TypeScript, Vite | 사용자 인터페이스, 라우팅 및 화면 구현 |
| **Backend** | Spring Boot, JPA | REST API 구현, 비즈니스 로직 처리 |
| **Database** | PostgreSQL | 사용자, 상품, 채팅 데이터의 영구 저장 및 관리 |
| **Auth** | Firebase Auth (Google) | 구글 계정 기반 사용자 로그인/회원가입 연동 |
| **Web Server** | Nginx | 운영 서버에서 프론트엔드 배포 및 API 리버스 프록시 역할 |
| **Hosting** | Oracle Cloud Free Tier | 24시간 중단 없는 클라우드 가상 서버 운영 |
| **DNS** | DuckDNS | 도메인을 운영 서버의 퍼블릭 IP에 동적 바인딩 |

---

## 💻 로컬 개발 환경 구축 (Local Development Setup)

### 1. 데이터베이스 설정 (PostgreSQL)
Mac 환경에서 Homebrew로 PostgreSQL을 시작하고 데이터베이스를 생성합니다.

```bash
# 1. PostgreSQL 서비스 시작
brew services start postgresql@18

# 2. carrot 데이터베이스 생성
createdb carrot

# (선택) psql로 직접 데이터베이스 진입해서 조회하기
psql postgres
# psql 진입 후: \c carrot (carrot 데이터베이스로 전환)
```

### 2. 백엔드 실행 (Spring Boot)
`backend/src/main/resources/application.yml`의 데이터베이스 계정명(`username`)이 본인의 Mac 계정명과 일치하는지 확인 후 실행합니다.

```bash
cd backend

# Gradle 빌드 및 컴파일 확인
./gradlew compileJava

# 백엔드 서버 로컬 실행 (포트: 9000)
./gradlew bootRun
```

### 3. 프론트엔드 실행 (React)
`frontend/.env` 파일에 백엔드 API 주소(`VITE_API_BASE_URL=http://localhost:9000/api`)가 잘 적혀있는지 확인 후 실행합니다.

```bash
cd frontend

# 의존성 패키지 설치
npm install

# 프론트엔드 서버 로컬 실행 (포트: 5999)
npm run dev
```

---

## 💾 데이터베이스 마이그레이션 (DB Migration)

로컬에서 가짜(Dummy) 데이터를 넣고 기능을 다 만든 뒤, 운영 서버로 이관하기 위해 DDL(테이블 구조)과 DML(테이블 데이터)을 SQL 파일로 백업합니다.

```bash
# 로컬 carrot DB의 스키마와 데이터를 sql 파일로 백업하기
pg_dump -U yongwon -d carrot -f carrot_backup.sql

# 💡 이 백업한 'carrot_backup.sql' 파일을 운영 서버로 전송하여 복구합니다!
```

---

## 🚀 운영 서버 배포 가이드 (Production Deployment)

### Step 1. Oracle Cloud Free Tier 인스턴스 생성
1. Oracle Cloud Infrastructure(OCI) 콘솔 로그인 후 **VM 인스턴스(Ubuntu 22.04 LTS)**를 생성합니다.
2. 할당받은 **공인 IP(Public IP)** 주소와 다운로드한 SSH 개인키(`.key`)를 확인합니다.

### Step 2. 포트 개방 및 방화벽 설정
1. OCI 가상 클라우드 네트워크(VCN)의 **보안 목록(Security List)**에서 수신 규칙(Ingress Rules)을 추가합니다.
   - `HTTP` 포트인 `80`번 포트 개방 (Nginx 접속용)
2. Ubuntu 서버 내부 방화벽(`iptables` / `ufw`) 설정에서도 80번 포트를 추가 개방합니다.

### Step 3. 운영 서버에 PostgreSQL 설치 및 데이터 복원
1. 운영 서버(Ubuntu)에 접속하여 PostgreSQL을 설치합니다.
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```
2. 운영 데이터베이스를 만들고, 로컬에서 추출한 `carrot_backup.sql`을 이용해 복원합니다.
   ```bash
   # sql 파일을 운영 서버로 복사해 온 뒤 실행
   psql -U postgres -d carrot -f carrot_backup.sql
   ```

### Step 4. Nginx 설정 및 프론트엔드/백엔드 가동
1. 프론트엔드 빌드:
   ```bash
   # 로컬에서 빌드 후 생성된 dist 폴더를 운영 서버의 /var/www/html 경로로 복사
   npm run build
   ```
2. 백엔드 빌드 및 실행:
   ```bash
   # 스프링 부트를 빌드하여 생긴 .jar 파일을 운영 서버에서 백그라운드로 실행
   nohup java -jar backend-0.0.1-SNAPSHOT.jar &
   ```
3. Nginx 설정 (`/etc/nginx/sites-available/default` 수정):
   ```nginx
   server {
       listen 80;
       server_name yongwon.duckdns.org; # 본인의 DuckDNS 도메인 주소

       # 1. 프론트엔드 서빙
       location / {
           root /var/www/html;
           index index.html index.htm;
           try_files $uri $uri/ /index.html; # React SPA 라우팅 지원
       }

       # 2. 백엔드 API 요청 리버스 프록시
       location /api/ {
           proxy_pass http://localhost:9000; # 실행 중인 스프링 부트 서버 포트
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
4. Nginx 서비스 재시작:
   ```bash
   sudo systemctl restart nginx
   ```

### Step 5. DuckDNS 도메인 연동
1. [DuckDNS 공식 홈페이지](https://www.duckdns.org/)에 접속합니다.
2. 원하는 서브도메인(예: `yongwon`)을 추가하고, Oracle Cloud 가상 서버의 **공인 IP**를 지정합니다.
3. 이제 웹 브라우저에서 `http://yongwon.duckdns.org`로 접속하면 사용자가 귀하의 사이트에 정상 접속할 수 있습니다!

### Step 6. Firebase Google 로그인 승인 도메인 설정
Firebase Authentication의 구글 로그인은 사전에 등록된 승인 도메인에서만 정상 동작합니다.
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속하여 사용 중인 프로젝트를 선택합니다.
2. **Build(빌드)** ➡️ **Authentication** ➡️ **Settings(설정)** 탭으로 이동합니다.
3. 왼쪽 메뉴에서 **Authorized domains(승인된 도메인)**를 클릭합니다.
4. **[Add domain]** 버튼을 클릭하여 새로 만든 DuckDNS 도메인(예: `yongwon.duckdns.org`)과 서버 공인 IP(예: `168.107.38.158`)를 각각 등록합니다.
