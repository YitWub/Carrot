import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/useAuthStore';
import { apiClient, UPLOADS_URL } from '../api/client';

interface ChatRoomListResponse {
    roomId: number;
    productId: number;
    productTitle: string;
    productThumbnailUrl: string | null;
    partnerId: number;
    partnerNickname: string;
    partnerProfileImageUrl: string | null;
    lastMessage: string;
    lastMessageTime: string | null;
    unreadCount: number;
}

export default function ChatPage() {
    const [rooms, setRooms] = useState<ChatRoomListResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);

    const fetchRooms = () => {
        apiClient.get('/api/v1/chat/my-rooms', {
            headers: { 'X-User-Id': user!.userId }
        })
            .then(res => {
                if (res.data && res.data.length > 0) {
                    setRooms(res.data);
                } else {
                    setRooms([]);
                }
            })
            .catch(err => {
                console.error("채팅방 목록 불러오기 실패:", err);
                // Do not clear rooms on error to avoid flickering if network drops briefly
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchRooms();
        const intervalId = setInterval(fetchRooms, 3000); // 3초마다 갱신 (실시간 반영)
        
        return () => clearInterval(intervalId);
    }, [navigate, user]);

    const timeAgo = (dateStr: string | null) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full pb-[60px]">
            {/* 상단 헤더 */}
            <header className="flex items-center justify-between px-5 h-[60px] bg-white shrink-0 mt-2">
                <h1 className="text-[22px] font-bold text-black">채팅</h1>
            </header>

            {/* 채팅방 목록 */}
            <div className="flex-1 overflow-y-auto mt-2">
                {loading ? (
                    <div className="flex justify-center items-center h-full text-gray-500">불러오는 중...</div>
                ) : rooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#B9B9B9]">
                        <p className="text-[16px]">진행 중인 채팅이 없습니다.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {rooms.map(room => (
                            <div 
                                key={room.roomId} 
                                className="flex items-center h-[90px] px-5 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => navigate(`/chat/${room.roomId}`)}
                            >
                                {/* 상대방 프로필 */}
                                <div className="w-[64px] h-[64px] bg-[#FFDAA3] rounded-full overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
                                    {room.partnerProfileImageUrl ? (
                                        <img src={`${UPLOADS_URL}/${room.partnerProfileImageUrl}`} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-black font-bold text-[14px]">profile</span>
                                    )}
                                </div>

                                {/* 중앙 텍스트 영역 */}
                                <div className="flex-1 flex flex-col ml-4 overflow-hidden justify-center h-full">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[17px] font-semibold text-[#2C2C2C] truncate">{room.partnerNickname}</span>
                                    </div>
                                    <div className={`text-[15px] truncate ${room.unreadCount > 0 ? 'text-[#2C2C2C] font-semibold' : 'text-[#C1C1C1] font-light'}`}>
                                        {room.lastMessage || 'last message'}
                                    </div>
                                </div>

                                {/* 우측 시간 및 배지 영역 */}
                                <div className="flex flex-col items-end justify-center h-full ml-3 shrink-0 gap-1.5">
                                    <span className="text-[12px] text-[#A3A3A3] font-light">{timeAgo(room.lastMessageTime)}</span>
                                    {room.unreadCount > 0 ? (
                                        <div className="bg-[#EF4444] text-white text-[11px] font-bold min-w-[20px] h-[20px] px-1.5 flex items-center justify-center rounded-full shadow-sm">
                                            {room.unreadCount > 999 ? '999+' : room.unreadCount}
                                        </div>
                                    ) : (
                                        <div className="h-[20px]"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
