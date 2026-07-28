import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { MyPage } from './pages/MyPage';
import { MobileLayout } from './components/layout/MobileLayout';
import { useAuthStore } from './store/useAuthStore';

import { HomePage } from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import Write from './pages/Write';

// 임시 채팅 페이지
const ChatPage = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">채팅</h1>
    <p>채팅 리스트 구현 예정...</p>
  </div>
);

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <div className="mx-auto w-full max-w-[480px] h-screen bg-white shadow-2xl overflow-hidden relative flex flex-col">
      {/* 
        모바일 뷰를 시뮬레이션하기 위해
        최대 너비를 모바일 사이즈로 제한하고 중앙 정렬
      */}
      <Routes>
        {/* 로그인되지 않은 경우 볼 수 있는 화면 */}
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />} 
        />

        {/* 로그인된 사용자만 접근할 수 있는 라우트 그룹 */}
        <Route
          element={isLoggedIn ? <MobileLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Route>

        <Route path="/product/:id" element={isLoggedIn ? <ProductDetail /> : <Navigate to="/login" replace />} />
        <Route path="/write" element={isLoggedIn ? <Write /> : <Navigate to="/login" replace />} />

        {/* 알 수 없는 경로는 홈으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
