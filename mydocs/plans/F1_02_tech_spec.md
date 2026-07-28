# [F-M1-02] 기술 구현 계획 (Tech Spec)

`F1_02_MyPage.md` 작업 지시서를 바탕으로 한 기술 명세입니다.

## 1. 컴포넌트 구조
- `src/components/layout/MobileLayout.tsx` (신규): 상/하단 고정 바를 가진 모바일 뷰어용 공통 레이아웃 래퍼.
- `src/components/common/BottomNav.tsx` (신규): 하단 탭바 (Home, MessageCircle, User 탭).
- `src/components/profile/MannerTempBar.tsx` (신규): 매너온도 시각화 게이지 컴포넌트.
- `src/pages/MyPage.tsx` (신규): 내 정보 메인 뷰.

## 2. 라우팅 (App.tsx 수정)
```tsx
<Route element={<MobileLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/chat" element={<ChatListPage />} />
  <Route path="/mypage" element={<MyPage />} />
</Route>
```

## 3. 상태 및 API 통신 (닉네임 수정)
- `apiClient.patch('/api/v1/users/me', { nickname: newNickname })`
- 응답받은 유저 객체를 Zustand `login(updatedUser)` 또는 `updateUser(newData)` 함수로 스토어 업데이트.

## 4. 로그아웃 로직
- Firebase Auth 로그아웃: `signOut(auth)`.
- Zustand 초기화: `logout()`.
- 페이지 리다이렉트: `navigate('/login')`.
