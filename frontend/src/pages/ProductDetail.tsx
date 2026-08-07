import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Heart } from 'lucide-react';
import { FALLBACK_IMAGE_SVG, FallbackImage } from '../components/FallbackImage';
import { apiClient, UPLOADS_URL } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { formatPrice } from '../utils/format';
import { ReportModal } from '../components/ReportModal';

interface Product {
    productId: number;
    title: string;
    location?: string;
    content: string;
    price: number;
    status: string;
    sellerId: number | null;
    thumbnailUrl: string | null;
    sellerNickname: string;
    sellerProfileImageUrl: string | null;
    createdAt: string;
    favoriteCount: number;
    viewCount: number;
    isFavorite: boolean;
}

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const myUserId = user?.userId || 0;
    const [product, setProduct] = useState<Product | null>(null);
    const [isFav, setIsFav] = useState(false);
    const [favCount, setFavCount] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        const userId = myUserId;
        apiClient.get(`/api/v1/products/${id}`, {
            headers: userId ? { 'X-User-Id': userId } : {}
        })
            .then(res => {
                setProduct(res.data);
                setIsFav(res.data.isFavorite || false);
                setFavCount(res.data.favoriteCount || 0);
            })
            .catch(err => console.error("데이터 가져오기 실패:", err));
    }, [id]);

    const toggleFavorite = () => {
        if (!myUserId) {
            alert("로그인이 필요합니다!");
            navigate('/login');
            return;
        }

        // Optimistic Update
        const previousIsFav = isFav;
        const previousCount = favCount;

        const newIsFav = !isFav;
        setIsFav(newIsFav);
        setFavCount(newIsFav ? favCount + 1 : Math.max(0, favCount - 1));

        const method = newIsFav ? 'POST' : 'DELETE';
        apiClient.request({
            url: `/api/v1/products/${id}/favorites`,
            method: method,
            headers: { 'X-User-Id': myUserId }
        }).catch(err => {
            console.error("찜하기 상태 변경 실패:", err);
            // 롤백
            setIsFav(previousIsFav);
            setFavCount(previousCount);
        });
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!product) return;
        const newStatus = e.target.value;
        const previousStatus = product.status;

        // Optimistic update
        setProduct({ ...product, status: newStatus });

        try {
            await apiClient.patch(`/api/v1/products/${id}/status`, { status: newStatus }, {
                headers: { 'X-User-Id': myUserId }
            });
        } catch (err) {
            console.error("상태 변경 실패:", err);
            alert("상태 변경에 실패했습니다.");
            setProduct({ ...product, status: previousStatus });
        }
    };

    const handleDelete = async () => {
        if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
            try {
                await apiClient.delete(`/api/v1/products/${id}`, { headers: { 'X-User-Id': myUserId } });
                alert("삭제되었습니다.");
                navigate("/", { replace: true });
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    if (!product) return <div className="flex justify-center items-center h-full text-gray-500 bg-white">상품 정보를 불러오는 중입니다...</div>;

    if (product.status === "DELETED") {
        return (
            <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-[60px] flex items-center justify-between px-2 z-10 bg-white border-b border-gray-100">
                    <button onClick={() => navigate(-1)} className="p-2 text-black">
                        <ChevronLeft size={28} />
                    </button>
                    <div className="font-bold text-lg">삭제된 게시글</div>
                    <div className="w-10"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <div className="text-6xl mb-4">🗑️</div>
                    <p className="text-lg font-medium">삭제된 게시글입니다.</p>
                </div>
            </div>
        );
    }

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
                <div className="flex items-center gap-1 relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
                        <MoreVertical size={24} />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute top-12 right-2 bg-white rounded shadow-md border border-gray-200 py-1 w-28 text-sm z-50">
                            {myUserId === product.sellerId ? (
                                <>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { setIsMenuOpen(false); navigate(`/write?edit=${product.productId}`); }}>수정</button>
                                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={() => { setIsMenuOpen(false); handleDelete(); }}>삭제</button>
                                </>
                            ) : (
                                <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500" onClick={() => { setIsMenuOpen(false); setIsReportModalOpen(true); }}>신고</button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 스크롤 가능한 본문 영역 */}
            <div className="flex-1 overflow-y-auto pb-[90px]">
                {/* 상품 이미지 */}
                <div className="w-full h-[368px] bg-[#CDCDCD]">
                    {product.thumbnailUrl ? (
                        <img
                            src={`${UPLOADS_URL}/${product.thumbnailUrl}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                    parent.innerHTML = FALLBACK_IMAGE_SVG;
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <FallbackImage size={60} />
                        </div>
                    )}
                </div>

                {/* 프로필 영역 */}
                <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                            {product.sellerProfileImageUrl ? (
                                <img
                                    src={product.sellerProfileImageUrl.startsWith('http') ? product.sellerProfileImageUrl : `${UPLOADS_URL}/${product.sellerProfileImageUrl}`}
                                    alt="프로필"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-gray-400 text-xs">기본</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-black">{product.sellerNickname || '당근이 (임시)'}</span>
                            <span className="text-[13px] text-[#B9B9B9]">{product.location || '비산동'}</span>
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
                    <h1 className="text-[20px] font-bold text-black leading-snug">
                        {product.status === 'RESERVED' && <span className="text-white bg-green-500 rounded px-1.5 py-0.5 text-sm mr-2 align-middle">예약중</span>}
                        {product.status === 'SOLD' && <span className="text-white bg-gray-500 rounded px-1.5 py-0.5 text-sm mr-2 align-middle">거래완료</span>}
                        {product.title}
                    </h1>
                    <div className="text-[13px] text-[#B9B9B9] mt-2 mb-4">
                        디지털기기 · {timeAgo(product.createdAt)}
                    </div>
                    {myUserId === product.sellerId && (
                        <div className="mb-4">
                            <select
                                className="border border-gray-300 rounded-md py-1.5 px-3 text-sm font-medium bg-white focus:outline-none focus:border-[#FF9D00] focus:ring-1 focus:ring-[#FF9D00] transition-colors"
                                value={product.status}
                                onChange={handleStatusChange}
                            >
                                <option value="SALE">판매중</option>
                                <option value="RESERVED">예약중</option>
                                <option value="SOLD">거래완료</option>
                            </select>
                        </div>
                    )}
                    <div className="text-[18px] text-black font-bold mb-4">
                        {formatPrice(product.price)}
                    </div>
                    <p className="text-[15px] text-black leading-relaxed whitespace-pre-wrap">
                        {product.content}
                    </p>
                    <div className="text-[13px] text-[#B9B9B9] mt-6">
                        관심 {favCount} · 조회 {product.viewCount}
                    </div>
                </div>
            </div>

            {/* 하단 네비게이션 (가격 및 액션) */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-white border-t border-gray-100 flex items-center px-4 z-10">
                <button
                    onClick={toggleFavorite}
                    className="flex flex-col items-center justify-center p-2 mr-2"
                >
                    <Heart size={24} className={isFav ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
                <div className="w-[1px] h-[40px] bg-gray-200 mx-2"></div>
                <div className="flex flex-col flex-1 ml-2">
                    <span className="text-[16px] font-bold text-black">{formatPrice(product.price)}</span>
                </div>
                {myUserId === product.sellerId ? (
                    <button
                        className="flex-1 h-[46px] bg-[var(--carrot-primary)] text-white font-bold text-[15px] rounded-[15px]"
                        onClick={() => navigate(`/write?edit=${product.productId}`)}
                    >
                        수정하기
                    </button>
                ) : (
                    <button
                        className="flex-1 h-[46px] bg-[#FF9D00] text-white font-bold text-[15px] rounded-[15px]"
                        onClick={() => {
                            if (!myUserId) {
                                alert("로그인이 필요합니다!");
                                return;
                            }
                            // 채팅방 생성/조회 API 호출
                            apiClient.post(`/api/v1/chat/rooms`, { productId: product.productId })
                                .then(res => {
                                    navigate(`/chat/${res.data.roomId}`);
                                })
                                .catch(() => alert("채팅방 입장에 실패했습니다."));
                        }}
                    >
                        채팅하기
                    </button>
                )}
            </div>

            {/* 신고하기 모달 */}
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                targetId={product.productId}
                type="PRODUCT"
            />
        </div>
    );
}