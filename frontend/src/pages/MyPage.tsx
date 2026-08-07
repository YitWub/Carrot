import React, { useState, useRef } from 'react';
import { Settings, ChevronRight, User as UserIcon, Camera } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { apiClient, UPLOADS_URL } from '../api/client';
import { FALLBACK_IMAGE_SVG, FallbackImage } from '../components/FallbackImage';

export const MyPage: React.FC = () => {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.nickname || '');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    fetchUserProfile();
    fetchFavorites();
    fetchMyProducts();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await apiClient.get('/api/v1/users/me');
      updateUser({ 
        nickname: res.data.nickname, 
        profileImageUrl: res.data.profileImageUrl,
        mannerTemp: res.data.mannerTemp
      });
    } catch (error) {
      console.error('Failed to fetch user profile', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await apiClient.get('/api/v1/users/me/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await apiClient.get('/api/v1/users/me/products');
      setMyProducts(res.data.content || []);
    } catch (error) {
      console.error('Failed to fetch my products', error);
    }
  };

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

  const handleDeleteAccount = async () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        await apiClient.delete('/api/v1/users/me');
        await signOut(auth);
        logout();
        navigate('/login');
      } catch (error) {
        console.error('Delete account error:', error);
        alert('회원탈퇴에 실패했습니다.');
      }
    }
  };

  const openEditModal = () => {
    setNewNickname(user?.nickname || '');
    setProfileImage(null);
    setPreviewImage(null);
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // 용량 및 확장자 검사
      if (file.size > 5 * 1024 * 1024) {
        alert('프로필 이미지는 5MB 이하만 가능합니다.');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('jpg, png, webp 확장자만 업로드 가능합니다.');
        return;
      }

      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = async () => {
    const nicknameTrimmed = newNickname.trim();
    if (!nicknameTrimmed) return alert('닉네임을 입력해주세요.');
    if (!/^[a-zA-Z0-9가-힣]{2,10}$/.test(nicknameTrimmed)) {
      return alert('닉네임은 2~10자의 영문, 숫자, 한글만 가능합니다.');
    }
    if (nicknameTrimmed === user?.nickname && !profileImage) {
      return setIsEditModalOpen(false);
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('nickname', nicknameTrimmed);
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const res = await apiClient.put('/api/v1/users/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      updateUser({ 
        nickname: res.data.nickname, 
        profileImageUrl: res.data.profileImageUrl 
      });
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert('프로필 수정에 실패했습니다. (특수문자 금지, 2~10자 제한 확인)');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 프로필 이미지 표시 헬퍼
  const getDisplayImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${UPLOADS_URL}/${url}`;
  };

  // 매너온도 계산 로직
  const temp = user?.mannerTemp || 36.5;
  const tempPercent = Math.min((temp / 99) * 100, 100);

  return (
    <div className="flex-1 flex flex-col bg-[#EFEFEF] overflow-y-auto relative">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 h-[57px] bg-[#EFEFEF] sticky top-0 z-10">
        <h1 className="text-xl font-bold text-black ml-1">내 정보</h1>
        <button className="p-1 hover:bg-black/5 rounded-full transition-colors" onClick={() => setIsSettingsModalOpen(true)}>
          <Settings size={24} className="text-black" />
        </button>
      </header>

      <div className="p-[9px] flex flex-col gap-4 mt-2">
        
        {/* 프로필 섹션 (Frame 15) */}
        <div className="bg-white rounded-[10px] p-[17px] flex flex-col gap-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#EAEAEA] rounded-full flex items-center justify-center overflow-hidden shrink-0">
              {user?.profileImageUrl ? (
                <img src={getDisplayImageUrl(user.profileImageUrl)!} alt="프로필" className="w-full h-full object-cover" />
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
              onClick={openEditModal}
              className="flex-1 bg-[#EAEAEA] h-8 rounded-[10px] flex items-center justify-center text-xs font-medium text-black hover:bg-gray-200 transition-colors"
            >
              프로필 수정
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 bg-[#EAEAEA] h-8 rounded-[10px] flex items-center justify-center text-xs font-medium text-black hover:bg-gray-200 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>

        {/* 매너온도 섹션 (Frame 16) */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col gap-3 shadow-sm">
          <span className="text-sm font-medium text-black">매너온도</span>
          <span className="text-base font-bold text-[#FF9500]">{temp.toFixed(1)}°C</span>
          <div className="h-1.5 bg-[#EBEBEB] rounded-[10px] overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF9500] to-[#CECECE]"
              style={{ width: `${tempPercent}%` }}
            />
          </div>
        </div>

        {/* 찜 목록 섹션 (Frame 17) */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm" onClick={() => navigate('/my/favorites')}>
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-medium text-black">찜 목록</span>
            <ChevronRight size={24} className="text-gray-300" />
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {favorites.length === 0 ? (
              <span className="text-gray-400 text-sm py-2">찜한 상품이 없습니다.</span>
            ) : (
              favorites.map((fav, i) => {
                if (i > 2) return null; // 최대 3개만 표시
                return (
                  <div key={fav.id || i} className="w-24 h-24 bg-[#EAEAEA] rounded-[10px] shrink-0 overflow-hidden flex items-center justify-center">
                    {fav.thumbnailUrl ? (
                      <img src={`${UPLOADS_URL}/${fav.thumbnailUrl}`} alt={fav.title} className="w-full h-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.innerHTML = FALLBACK_IMAGE_SVG;
                        }
                      }} />
                    ) : (
                      <FallbackImage size={40} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 내가 쓴 글 섹션 (Frame 18) */}
        <div className="bg-white rounded-[10px] p-4 flex flex-col gap-3 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm" onClick={() => navigate('/my/products')}>
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-medium text-black">내가 쓴 글</span>
            <ChevronRight size={24} className="text-gray-300" />
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
            {myProducts.length === 0 ? (
              <span className="text-gray-400 text-sm py-2">등록한 상품이 없습니다.</span>
            ) : (
              myProducts.map((p: any) => (
                <div 
                  key={p.productId} 
                  className="w-24 h-24 bg-[#EAEAEA] rounded-[10px] shrink-0 overflow-hidden flex items-center justify-center cursor-pointer relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${p.productId}`);
                  }}
                >
                  {p.thumbnailUrl ? (
                    <img src={`${UPLOADS_URL}/${p.thumbnailUrl}`} alt={p.title} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        parent.innerHTML = FALLBACK_IMAGE_SVG;
                      }
                    }} />
                  ) : (
                    <FallbackImage size={40} />
                  )}
                  {/* 상태 뱃지 오버레이 */}
                  {p.status !== 'SALE' && (
                    <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-black/60 rounded">
                        {p.status === 'RESERVED' ? '예약중' : '거래완료'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 프로필 수정 모달 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center">
            <h3 className="text-lg font-bold mb-6 w-full text-left">프로필 수정</h3>
            
            {/* 프로필 이미지 선택 */}
            <div className="relative mb-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 bg-[#EAEAEA] rounded-full overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img src={previewImage} alt="미리보기" className="w-full h-full object-cover" />
                ) : user?.profileImageUrl ? (
                  <img src={getDisplayImageUrl(user.profileImageUrl)!} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={40} className="text-gray-400" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
                <Camera size={16} className="text-gray-600" />
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/png, image/jpeg, image/webp" 
              onChange={handleImageChange}
            />

            <input 
              type="text" 
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="새로운 닉네임을 입력하세요"
              className="w-full border border-gray-300 rounded-xl p-3 mb-6 focus:outline-none focus:border-[var(--carrot-primary)] focus:ring-1 focus:ring-[var(--carrot-primary)]"
              maxLength={10}
            />
            <div className="flex gap-2 w-full">
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
      {/* 설정 모달 */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsSettingsModalOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-6 w-full text-left">설정</h3>
            
            <div className="flex flex-col w-full gap-4">
              <div className="w-full py-4 text-left border-b border-gray-100 text-[15px] font-medium text-black px-2 flex flex-col gap-1">
                <span>고객센터</span>
                <span className="text-gray-400 text-sm font-normal">yong-1@naver.com</span>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="w-full py-4 text-left text-[15px] font-bold text-red-500 hover:bg-red-50 rounded-b-xl px-2 mt-2"
              >
                회원 탈퇴
              </button>
            </div>
            
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full mt-6 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

