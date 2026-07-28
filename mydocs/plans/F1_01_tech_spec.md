# [F-M1-01] 기술 구현 계획 (Tech Spec)

`F1_01_Login.md` 작업 지시서를 바탕으로 한 프론트엔드 상세 구현 계획입니다.

## 1. 패키지 설치
```bash
npm install zustand axios
```

## 2. API 설정 (Axios Instance)
- **`src/api/client.ts` (신규)**
  - baseURL을 `http://ywmarket.duckdns.org:8080` (또는 환경변수)로 설정.
  - Zustand에서 꺼낸 인증 정보를 인터셉터(Interceptor)로 매 요청마다 `X-User-Id` 헤더에 자동 주입하도록 설계. (현재는 `X-User-Id`를 사용 중이지만, 로그인 응답에서 받은 `userId`를 저장해서 활용)

## 3. 전역 상태 관리 (Zustand)
- **`src/store/useAuthStore.ts` (신규)**
  ```typescript
  interface User {
    userId: number;
    nickname: string;
    mannerTemp: number;
    isNewUser: boolean;
  }
  interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
  }
  ```
  - `persist` 미들웨어를 사용하여 로컬 스토리지에 자동 저장(새로고침 방어).

## 4. UI 컴포넌트 개발
- **`src/pages/LoginPage.tsx` (수정/신규)**
  - 이미 존재하는 `App.tsx`나 Router 설정과 연결.
  - 구글 로그인 버튼 UI: `<button className="carrot-btn">구글로 시작하기</button>`
  - `signInWithPopup(auth, provider)` 호출 ➡️ Firebase Token 획득 ➡️ `axios.post('/api/v1/auth/login')` 호출 ➡️ Zustand 스토어 업데이트 ➡️ 메인 페이지로 리다이렉트(`/`).
