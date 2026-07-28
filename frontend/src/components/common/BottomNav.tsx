import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[80px] bg-white flex items-center justify-around border-t border-gray-100 z-50 pb-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-[6px] w-14 ${
            isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-black'
          }`
        }
      >
        <Home size={28} />
        <span className="text-[12px] leading-none">홈</span>
      </NavLink>
      
      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `flex flex-col items-center gap-[6px] w-14 ${
            isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-black'
          }`
        }
      >
        <MessageCircle size={28} />
        <span className="text-[12px] leading-none">채팅</span>
      </NavLink>

      <NavLink
        to="/mypage"
        className={({ isActive }) =>
          `flex flex-col items-center gap-[6px] w-14 ${
            isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-black'
          }`
        }
      >
        <User size={28} />
        <span className="text-[12px] leading-none">내 정보</span>
      </NavLink>
    </nav>
  );
};
