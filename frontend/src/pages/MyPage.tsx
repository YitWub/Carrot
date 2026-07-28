import React, { useState } from 'react';
import { Settings, User as UserIcon, LogOut, Edit2, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export const MyPage: React.FC = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      try {
        await signOut(auth);
        logout();
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
        alert('로그아웃에 실패했습니다.');
      }
    }
  };

  const handleEditProfile = async () => {
    if (!newNickname.trim()) return alert('닉네임을 입력해주세요.');
    if (newNickname === user?.nickname) return setIsEditModalOpen(false);

    try {
      setIsSubmitting(true);
      const res = await apiClient.patch('/api/v1/users/me', { nickname: newNickname });
      updateUser({ nickname: res.data.nickname });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 매너온도 계산 로직
  const temp = user?.mannerTemp || 36.5;
  const tempPercent = Math.min((temp / 99) * 100, 100);
  let tempColor = '#0D9488'; // 청록색 (기본 ~ 36.4)
  if (temp >= 36.5 && temp < 40) tempColor = '#FF7E36'; // 당근색
  else if (temp >= 40 && temp < 50) tempColor = '#EA580C'; // 진한 주황
  else if (temp >= 50) tempColor = '#DC2626'; // 빨간색

  return (
    <div className="flex-1 flex flex-col bg-[#F5F5F5] overflow-y-auto relative">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 h-[57px] bg-rose-300 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-black ml-1">내 정보</h1>
        <button className="p-1 hover:bg-black/5 rounded-full transition-colors">
          <Settings size={24} className="text-black" />
        </button>
      </header>

      <div className="p-[9px] flex flex-col gap-4 mt-2">
        
        {/* 프로필 섹션 (Frame 15) */}
        <div className="bg-zinc-300 rounded-[10px] p-[17px] flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="프로필" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={24} className="text-gray-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black">{user?.nickname || '당근유저'}</span>
              <span className="text-xs text-gray-600 mt-0.5">{user?.isNewUser ? '신규 가입자 🎉' : '당근마켓과 함께한 이웃'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 bg-white h-8 rounded-[10px] flex items-center justify-center text-xs font-medium text-black hover:bg-gray-50 transition-colors"
            >
              프로필 수정
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 bg-white h-8 rounded-[10px] flex items-center justify-center text-xs font-medium text-black hover:bg-gray-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 매너온도 섹션 (Frame 16) */}
        <div className="bg-zinc-300 rounded-[10px] p-4 flex flex-col gap-3">
          <span className="text-sm font-medium text-black">매너온도</span>
          <span className="text-base font-bold text-amber-500">{temp.toFixed(1)}°C</span>
          <div className="h-1.5 bg-white rounded-[10px] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-stone-300"
              style={{ width: `${tempPercent}%` }}
            />
          </div>
        </div>

        {/* 찜 목록 섹션 (Frame 17) */}
        <div className="bg-zinc-300 rounded-[10px] p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-medium text-black">찜 목록</span>
            <ChevronRight size={24} className="text-white" />
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
          </div>
        </div>

        {/* 판매 내역 섹션 (Frame 18) */}
        <div className="bg-zinc-300 rounded-[10px] p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-medium text-black">판매 내역</span>
            <ChevronRight size={24} className="text-white" />
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
            <div className="w-24 h-24 bg-white rounded-[10px] shrink-0" />
          </div>
        </div>

      </div>

      {/* 닉네임 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">프로필 수정</h3>
            <input 
              type="text" 
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="새로운 닉네임을 입력하세요"
              className="w-full border border-gray-300 rounded-xl p-3 mb-6 focus:outline-none focus:border-[var(--carrot-primary)] focus:ring-1 focus:ring-[var(--carrot-primary)]"
              maxLength={15}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button 
                onClick={handleEditProfile}
                className="flex-1 py-3 bg-[var(--carrot-primary)] rounded-xl font-bold text-white hover:bg-[var(--carrot-hover)] disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
