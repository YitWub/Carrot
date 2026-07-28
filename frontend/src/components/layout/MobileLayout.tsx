import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from '../common/BottomNav';

export const MobileLayout: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col relative pb-[80px] overflow-hidden bg-white">
      {/* 라우트에 맞는 페이지 화면이 그려지는 곳 */}
      <Outlet />
      
      {/* 항상 고정되는 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
};
