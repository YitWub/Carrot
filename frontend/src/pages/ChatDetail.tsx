import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from '../store/useAuthStore';
import { ChevronLeft, MoreVertical, Send } from "lucide-react";
import { apiClient, UPLOADS_URL } from "../api/client";
import { formatPrice } from "../utils/format";

interface ChatRoomDetailResponse {
    roomId: number;
    productId: number;
    productTitle: string;
    productPrice: number;
    productThumbnailUrl: string | null;
    partnerId: number;
    partnerNickname: string;
    partnerProfileImageUrl: string | null;
    partnerMannerTemp: number;
    isProductSold: boolean;
    isSeller: boolean;
    hasReviewed: boolean;
}

interface ChatMessage {
    messageId: number;
    text: string;
    senderId: number;
    isRead: boolean;
    createdAt: string;
}

import { ReportModal } from "../components/ReportModal";

export default function ChatDetail() {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [roomDetail, setRoomDetail] = useState<ChatRoomDetailResponse | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const user = useAuthStore(state => state.user);
    const myUserId = user?.userId || 0;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchRoomDetail = () => {
        if (!roomId) return;
        apiClient.get(`/api/v1/chat/rooms/${roomId}`, {
            headers: { 'X-User-Id': myUserId }
        })
            .then(res => setRoomDetail(res.data))
            .catch(err => console.error("방 정보 로딩 실패", err));
    };

    // 방 상세 정보 로드
    useEffect(() => {
        fetchRoomDetail();
    }, [roomId, myUserId]);

    useEffect(() => {
        if (!roomId) return;
            
        // 채팅방 진입 시 읽음 처리
        apiClient.patch(`/api/v1/chat/rooms/${roomId}/read`, null, {
            headers: { 'X-User-Id': myUserId }
        }).catch(err => console.error("읽음 처리 실패", err));
    }, [roomId, myUserId]);

    // 메시지 폴링
    const fetchMessages = () => {
        if (!roomId) return;

        apiClient.get(`/api/v1/chat/rooms/${roomId}/messages`, {
            headers: { 'X-User-Id': myUserId }
        })
            .then(res => {
                setMessages(res.data);
            })
            .catch(err => console.error("메시지 로딩 실패", err));
    };

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 2000);
        return () => clearInterval(intervalId);
    }, [roomId, myUserId]);

    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].messageId : null;
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [lastMessageId]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        apiClient.post(`/api/v1/chat/rooms/${roomId}/messages`, { text: inputText }, {
            headers: { 'X-User-Id': myUserId }
        })
            .then(() => {
                setInputText("");
                fetchMessages();
            })
            .catch(() => alert("전송 실패"));
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        let hours = date.getHours();
        const ampm = hours >= 12 ? '오후' : '오전';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${ampm} ${hours}:${minutes}`;
    };

    const handleCompleteTransaction = () => {
        if (!window.confirm("거래를 완료하시겠습니까? (완료 후에는 취소할 수 없습니다)")) return;
        
        apiClient.post(`/api/v1/chat/rooms/${roomId}/complete`, null, {
            headers: { 'X-User-Id': myUserId }
        }).then(() => {
            alert("거래가 완료되었습니다! 이제 서로 후기를 남길 수 있습니다.");
            fetchRoomDetail();
        }).catch(err => {
            console.error(err);
            alert("거래 완료 처리에 실패했습니다.");
        });
    };

    const handleReview = (score: number) => {
        if (!roomDetail || !roomId) return;
        if (!window.confirm("이대로 후기를 남기시겠습니까? (수정 불가)")) return;

        apiClient.post(`/api/v1/reviews`, {
            revieweeId: roomDetail.partnerId,
            productId: roomDetail.productId,
            score: score
        }, {
            headers: { 'X-User-Id': myUserId }
        }).then(() => {
            alert("후기가 등록되었습니다!");
            fetchRoomDetail();
        }).catch(err => {
            console.error(err);
            alert("후기 등록에 실패했습니다.");
        });
    };

    return (
        <div className="flex flex-col h-full bg-[#F5F5F5] relative">
            {/* Sticky Header */}
            <header className="flex items-center justify-between px-2 h-[60px] bg-white border-b border-gray-100 shrink-0 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="p-2 text-black">
                    <ChevronLeft size={28} strokeWidth={1.5} />
                </button>
                <div className="flex items-center flex-1 justify-center gap-2">
                    <span className="text-[18px] font-bold text-black">{roomDetail?.partnerNickname || "상대방"}</span>
                    <div className="bg-[#F1F1F1] px-2 py-0.5 rounded-full flex items-center justify-center">
                        <span className="text-[12px] font-bold text-[#FF7E36]">{roomDetail?.partnerMannerTemp || 36.5}°C</span>
                    </div>
                </div>
                <div className="relative">
                    <button className="p-2 text-black" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <MoreVertical size={24} strokeWidth={1.5} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute top-10 right-0 bg-white rounded shadow-md border border-gray-200 py-1 w-28 text-sm z-50">
                            <button 
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" 
                                onClick={() => { setIsMenuOpen(false); setIsReportModalOpen(true); }}
                            >
                                신고
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Product Info */}
            <div 
                className="flex items-center h-[70px] bg-white px-4 shrink-0 shadow-sm z-[5] cursor-pointer hover:bg-gray-50"
                onClick={() => {
                    if (roomDetail && roomDetail.productId !== undefined) {
                        navigate(`/product/${roomDetail.productId}`);
                    }
                }}
            >
                <div className="w-[45px] h-[45px] bg-gray-200 rounded-[5px] overflow-hidden shrink-0 flex items-center justify-center">
                    {roomDetail?.productThumbnailUrl ? (
                        <img src={`${UPLOADS_URL}/${roomDetail.productThumbnailUrl}`} className="w-full h-full object-cover" alt="product" />
                    ) : (
                        <span className="text-gray-400 text-[10px]">사진</span>
                    )}
                </div>
                <div className="flex flex-col ml-3 justify-center flex-1">
                    <span className="text-[14px] text-[#2C2C2C] font-bold truncate">{roomDetail?.productTitle || "상품명"}</span>
                    <span className="text-[15px] font-bold text-black mt-0.5">
                        {formatPrice(roomDetail?.productPrice)}
                    </span>
                </div>
                {roomDetail?.isSeller && !roomDetail?.isProductSold && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteTransaction();
                        }}
                        className="px-3 py-1.5 bg-[#FF7E36] text-white text-[12px] font-bold rounded-[5px] shrink-0 active:bg-orange-600 transition-colors"
                    >
                        거래완료
                    </button>
                )}
                {roomDetail?.isProductSold && (
                    <div className="px-3 py-1 bg-gray-100 text-gray-500 text-[12px] font-bold rounded-[5px] shrink-0">
                        거래완료
                    </div>
                )}
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4">
                
                {/* 후기(투표) UI 배너 */}
                {roomDetail?.isProductSold && !roomDetail?.hasReviewed && (
                    <div className="bg-white rounded-[10px] p-4 shadow-sm border border-[#FF7E36]/20 flex flex-col items-center mb-2">
                        <span className="text-[14px] font-bold text-black mb-3">따뜻한 거래 되셨나요? 후기를 남겨주세요!</span>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button onClick={() => handleReview(0.5)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-100">
                                <span className="text-[20px] mb-1">😆</span>
                                <span className="text-[11px] text-gray-600">최고예요</span>
                            </button>
                            <button onClick={() => handleReview(0.2)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-100">
                                <span className="text-[20px] mb-1">🙂</span>
                                <span className="text-[11px] text-gray-600">좋아요</span>
                            </button>
                            <button onClick={() => handleReview(0.0)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-100">
                                <span className="text-[20px] mb-1">😐</span>
                                <span className="text-[11px] text-gray-600">보통이에요</span>
                            </button>
                            <button onClick={() => handleReview(-0.5)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-100">
                                <span className="text-[20px] mb-1">🙁</span>
                                <span className="text-[11px] text-gray-600">별로예요</span>
                            </button>
                            <button onClick={() => handleReview(-1.0)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 border border-gray-100">
                                <span className="text-[20px] mb-1">😡</span>
                                <span className="text-[11px] text-gray-600">최악이에요</span>
                            </button>
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => {
                    const isMine = msg.senderId === myUserId;
                    const showProfile = !isMine && (index === 0 || messages[index - 1].senderId !== msg.senderId);
                    
                    return (
                        <div key={msg.messageId} className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                            {/* 상대방 프로필 */}
                            {!isMine && (
                                <div className="w-[40px] h-[40px] shrink-0">
                                    {showProfile ? (
                                        <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                            {roomDetail?.partnerProfileImageUrl ? (
                                                <img src={`${UPLOADS_URL}/${roomDetail.partnerProfileImageUrl}`} className="w-full h-full object-cover" alt="profile"/>
                                            ) : (
                                                <span className="text-gray-500 text-[10px]">프사</span>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full"></div> // 공간만 차지
                                    )}
                                </div>
                            )}

                            {/* 내 메시지일 경우 왼쪽에 시간과 읽음 표시 */}
                            {isMine && (
                                <div className="flex flex-col items-end justify-end pb-1 gap-0.5">
                                    {!msg.isRead && <span className="text-[11px] text-[#FF7E36] font-bold">1</span>}
                                    <span className="text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
                                </div>
                            )}

                            {/* 메시지 버블 */}
                            <div className={`max-w-[70%] px-4 py-2.5 rounded-[20px] text-[15px] leading-relaxed shadow-sm
                                ${isMine ? 'bg-[#FF7E36] text-white rounded-tr-[5px]' : 'bg-white text-black border border-gray-100 rounded-tl-[5px]'}`}
                            >
                                {msg.text}
                            </div>

                            {/* 상대방 메시지일 경우 오른쪽에 시간 표시 */}
                            {!isMine && (
                                <div className="flex flex-col items-start justify-end pb-1">
                                    <span className="text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="h-[70px] bg-white border-t border-gray-100 px-4 flex items-center shrink-0">
                <div className="flex-1 h-[45px] bg-[#F5F5F5] rounded-full flex items-center px-4 pr-1">
                    <input
                        type="text"
                        className="flex-1 bg-transparent outline-none text-[15px] text-black placeholder-gray-400"
                        placeholder="메시지 보내기"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="w-[35px] h-[35px] rounded-full bg-[#FF7E36] flex items-center justify-center disabled:opacity-50 transition-opacity shrink-0"
                    >
                        <Send size={18} className="text-white" strokeWidth={2} />
                    </button>
                </div>
            </div>

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetId={Number(roomId)}
                type="CHAT"
            />
        </div>
    );
}
