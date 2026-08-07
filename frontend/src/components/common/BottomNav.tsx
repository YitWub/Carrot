import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageCircle, User } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';

export const BottomNav: React.FC = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isLoggedIn || !user?.userId) {
      setUnreadCount(0);
      return;
    }

    const fetchUnreadCount = () => {
      apiClient.get('/api/v1/chat/unread-count', {
        headers: { 'X-User-Id': user.userId }
      })
      .then(res => setUnreadCount(res.data.count))
      .catch(err => console.error("Failed to fetch unread count", err));
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 3000);
    return () => clearInterval(intervalId);
  }, [isLoggedIn, user?.userId]);

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
        <div className="relative">
          <MessageCircle size={28} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
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
