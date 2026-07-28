import React, { useEffect, useState } from 'react';
import { MapPin, Search, Bell, Plus, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Product {
  productId: number;
  title: string;
  price: number;
  status: string;
  thumbnailUrl: string | null;
  sellerNickname: string;
  createdAt: string;
}

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/v1/products');
      setProducts(res.data.content);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  // 11분 전 같은 시간 포맷팅 함수
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
      <div className="flex-1 flex flex-col bg-white relative overflow-hidden rounded-t-[30px] shadow-sm">
        {/* 상단 헤더 */}
        <header className="flex items-center justify-between px-[17px] h-[48px] bg-white shrink-0">
          <div className="flex items-center gap-1 cursor-pointer">
            <MapPin size={24} className="text-black" />
            <h1 className="text-xl font-bold text-black ml-1">비산동</h1>
          </div>
          <div className="flex items-center gap-3">
            <Search size={24} className="text-black cursor-pointer" />
            <Bell size={24} className="text-black cursor-pointer" />
          </div>
        </header>

        {/* 상품 리스트 영역 */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full text-gray-500">불러오는 중...</div>
          ) : products.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">등록된 상품이 없습니다.</div>
          ) : (
            <div className="flex flex-col">
              {products.map((product) => (
                <div 
                  key={product.productId} 
                  className="flex items-start h-[144px] px-[12px] pt-[16px] border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/product/${product.productId}`)}
                >
                  {/* 썸네일 */}
                  <div className="w-[112px] h-[112px] bg-[#d9d9d9] rounded-[10px] overflow-hidden shrink-0 flex flex-col items-center justify-center">
                    {product.thumbnailUrl ? (
                      <img 
                        src={`http://localhost:8080/uploads/${product.thumbnailUrl}`} 
                        alt={product.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-black text-sm font-bold">prd_image</span>';
                          }
                        }}
                      />
                    ) : (
                      <span className="text-black text-[16px] font-bold">prd_image</span>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="ml-[26px] h-[112px] flex flex-col justify-start pt-[5px] flex-1 overflow-hidden">
                    <h2 className="text-[16px] text-black font-light leading-none truncate">{product.title}</h2>
                    
                    <div className="flex items-center text-[12px] text-gray-400 font-light mt-[10px]">
                      <span>비산동</span>
                      <span className="mx-1">·</span>
                      <span>{timeAgo(product.createdAt)}</span>
                    </div>
                    
                    <div className="text-[16px] font-bold text-black mt-[7px]">
                      {product.price.toLocaleString()}만원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 글쓰기 플로팅 버튼 (FAB) */}
        <button 
          className="absolute right-[20px] bottom-[24px] w-[80px] h-[80px] bg-orange-500 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-colors z-[60]"
          onClick={() => navigate('/write')}
        >
          <Plus size={40} className="text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
