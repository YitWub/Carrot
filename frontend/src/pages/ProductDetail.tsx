import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

// 불러올 데이터?
interface Product {
    id: number;
    title: string;
    content: string;
    price: number;
    imageUrl?: string;
}

export default function ProductDetail() {

    const { id } = useParams(); //이게 좋대

    // 상품정보 저장
    const [product, setProduct] = useState<Product | null>(null);
    useEffect(() => {
        // 서버에게 "이 아이디(id)의 상품 하나만 갖다줘!" 라고 요청
        fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
            })
            .catch(err => console.error("데이터 가져오기 실패:", err));
    }, [id]);
    // 아직 데이터를 가져오기 전이라면 로딩 텍스트
    if (!product) return <div style={{ padding: '20px' }}>상품 정보를 불러오는 중입니다...</div>;
    return (
        <div className="detail-container">
            <img 
                src={product.imageUrl ? `${import.meta.env.VITE_UPLOADS_BASE_URL}/${product.imageUrl}` : "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80"} 
                alt="상품 이미지" 
                className="detail-image" 
            />

            <div className="detail-content">
                {/* 1. 판매자 정보 느낌 내기 */}
                <div className="detail-seller">
                    <div className="seller-profile"></div>
                    <div className="seller-info">
                        <div className="seller-name">당근이 (임시)</div>
                        <div className="seller-location">우리 동네</div>
                    </div>
                </div>
                {/* 2. 실제 상품 정보 보여주기 */}
                <h1 className="detail-title">{product.title}</h1>
                <div className="detail-info">방금 전</div>
                <div className="detail-price">{product.price.toLocaleString()}원</div>
                <div className="detail-description">{product.content}</div>
                
                {/* 채팅하기 버튼 */}
                <button 
                    onClick={() => {
                        const myUserId = localStorage.getItem("userId");
                        if (!myUserId) {
                            alert("로그인이 필요합니다!");
                            return;
                        }
                        // 채팅방 생성/조회 API 호출
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/room?productId=${product.id}&buyerId=${myUserId}`, {
                            method: "POST"
                        })
                        .then(res => res.json())
                        .then(room => {
                            // 채팅방으로 라우팅
                            window.location.href = `/chat/${room.id}`; 
                        })
                        .catch(err => alert("채팅방을 열 수 없어요."));
                    }}
                    style={{
                        width: '100%', padding: '15px', backgroundColor: 'var(--color-primary)', 
                        color: 'white', border: 'none', borderRadius: '8px', 
                        fontWeight: 'bold', fontSize: '16px', marginTop: '20px', cursor: 'pointer'
                    }}
                >
                    채팅하기
                </button>
            </div>
        </div>
    );
}