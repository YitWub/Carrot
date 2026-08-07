import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { apiClient, UPLOADS_URL } from '../api/client';
import { formatPrice } from '../utils/format';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_IMAGE_SVG, FallbackImage } from '../components/FallbackImage';

interface Product {
  productId: number;
  title: string;
  location?: string;
  price: number;
  status: string;
  thumbnailUrl: string | null;
  sellerNickname: string;
  createdAt: string;
}

export const MyProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/v1/users/me/products');
      setProducts(res.data.content || []);
    } catch (error) {
      console.error('Failed to fetch my products', error);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FA] relative overflow-hidden">
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden shadow-sm">
        {/* 상단 헤더 */}
        <header className="flex items-center px-[17px] h-[57px] bg-white border-b border-gray-100 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ChevronLeft size={28} className="text-black" />
          </button>
          <h1 className="text-[18px] font-bold text-black ml-2">내가 쓴 글</h1>
        </header>

        {/* 상품 리스트 영역 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">불러오는 중...</div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">등록한 상품이 없습니다.</div>
          ) : (
            <div className="flex flex-col">
              {products.map((product) => (
                <div 
                  key={product.productId} 
                  className="flex items-start h-[144px] px-[12px] pt-[16px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  {/* 썸네일 */}
                  <div className="w-[112px] h-[112px] bg-[#d9d9d9] rounded-[10px] overflow-hidden shrink-0 flex flex-col items-center justify-center relative">
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
                      <FallbackImage size={40} />
                    )}
                    {/* 상태 뱃지 오버레이 */}
                    {product.status !== 'SALE' && (
                      <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
                        <span className="text-white text-xs font-bold px-2 py-1 bg-black/60 rounded">
                          {product.status === 'RESERVED' ? '예약중' : '거래완료'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="ml-[26px] h-[112px] flex flex-col justify-start pt-[5px] flex-1 overflow-hidden">
                    <h2 className="text-[16px] text-black font-light leading-none truncate">
                        {product.status === 'RESERVED' && <span className="text-white bg-green-500 rounded px-1.5 py-0.5 text-xs mr-1 align-middle">예약중</span>}
                        {product.status === 'SOLD' && <span className="text-white bg-gray-500 rounded px-1.5 py-0.5 text-xs mr-1 align-middle">거래완료</span>}
                        {product.title}
                    </h2>
                    
                    <div className="flex items-center text-[12px] text-gray-400 font-light mt-[10px]">
                      <span>{product.location || '비산동'}</span>
                      <span className="mx-1">·</span>
                      <span>{timeAgo(product.createdAt)}</span>
                    </div>
                    
                    <div className="text-[16px] font-bold text-black mt-[7px]">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
