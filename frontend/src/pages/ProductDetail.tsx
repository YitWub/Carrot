import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, MoreVertical, Home } from 'lucide-react';
import { apiClient } from '../api/client';

interface Product {
    productId: number;
    title: string;
    content: string;
    price: number;
    status: string;
    thumbnailUrl: string | null;
    sellerNickname: string;
    createdAt: string;
}

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        apiClient.get(`/api/v1/products/${id}`)
            .then(res => {
                setProduct(res.data);
            })
            .catch(err => console.error("데이터 가져오기 실패:", err));
    }, [id]);

    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins}분 전`;
        if (diffHours < 24) return `${diffHours}시간 전`;
        return `${diffDays}일 전`;
    };

    if (!product) return <div className="flex justify-center items-center h-full text-gray-500 bg-white">상품 정보를 불러오는 중입니다...</div>;

    return (
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full">
            {/* 상단 오버레이 헤더 */}
            <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-between px-2 z-10 bg-gradient-to-b from-black/40 to-transparent">
                <button onClick={() => navigate(-1)} className="p-2 text-white">
                    <ChevronLeft size={28} />
                </button>
                <div className="flex items-center gap-1">
                    <button onClick={() => navigate('/')} className="p-2 text-white">
                        <Home size={24} />
                    </button>
                    <button className="p-2 text-white">
                        <MoreVertical size={24} />
                    </button>
                </div>
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="flex-1 overflow-y-auto pb-[90px]">
                {/* 상품 이미지 */}
                <div className="w-full h-[368px] bg-[#CDCDCD]">
                    {product.thumbnailUrl ? (
                        <img 
                            src={`http://localhost:8080/uploads/${product.thumbnailUrl}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">이미지 없음</div>
                    )}
                </div>

                {/* 프로필 영역 */}
                <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            {/* 임시 프로필 이미지 */}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-black">{product.sellerNickname || '당근이 (임시)'}</span>
                            <span className="text-[13px] text-[#B9B9B9]">비산동</span>
                        </div>
                    </div>
                    {/* 매너온도 (임시) */}
                    <div className="flex flex-col items-end">
                        <span className="text-[15px] font-bold text-[#FF9D00]">36.5°C</span>
                        <span className="text-[12px] text-[#B9B9B9] underline">매너온도</span>
                    </div>
                </div>

                {/* 상품 내용 영역 */}
                <div className="px-4 py-6">
                    <h1 className="text-[20px] font-bold text-black leading-snug">{product.title}</h1>
                    <div className="text-[13px] text-[#B9B9B9] mt-2 mb-4">
                        디지털기기 · {timeAgo(product.createdAt)}
                    </div>
                    <div className="text-[18px] text-black font-bold mb-4">
                        {product.price.toLocaleString()}원
                    </div>
                    <p className="text-[15px] text-black leading-relaxed whitespace-pre-wrap">
                        {product.content}
                    </p>
                    <div className="text-[13px] text-[#B9B9B9] mt-6">
                        관심 0 · 조회 0
                    </div>
                </div>
            </div>

            {/* 하단 고정 바 */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 px-5 flex items-center z-20 pb-2">
                <button className="p-2 mr-3 border-r border-gray-200 pr-4">
                    <Heart size={28} color="#5D5D5D" strokeWidth={1.5} />
                </button>
                <button 
                    className="flex-1 h-[46px] bg-[#FF9D00] text-white font-bold text-[15px] rounded-[15px]"
                    onClick={() => {
                        const myUserId = localStorage.getItem("userId");
                        if (!myUserId) {
                            alert("로그인이 필요합니다!");
                            return;
                        }
                        // 채팅방 생성/조회 API 호출
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/chat/room?productId=${product.productId}&buyerId=${myUserId}`, {
                            method: "POST"
                        })
                        .then(res => {
                            if (!res.ok) throw new Error("Failed to create room");
                            return res.json();
                        })
                        .then(room => {
                            navigate(`/chat/${room.id}`);
                        })
                        .catch(() => alert("채팅 기능을 연동중입니다."));
                    }}
                >
                    채팅하기
                </button>
            </div>
        </div>
    );
}