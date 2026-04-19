import './ProductItem.css';
import { useNavigate } from 'react-router-dom';

// ProductItem이 밖에서 어떤 속성들을 전달받을수 있는지
interface ProductItemProps {
    id: number;
    imageSrc: string; // 상품 사진 주소
    title: string; // 상품 제목
    location: string; // 동네 이름
    timeAgo: string; // 끌올 시간 - 10분전
    price: number; // 가격
    likes: number // 좋아요 수
}

export default function ProductItem({ id, imageSrc, title, location, timeAgo, price, likes }: ProductItemProps) {
    const navigate = useNavigate(); //페이지 이동...??

    return (
        <div className="product-item" onClick={() => navigate(`/products/${id}`)}>
            {/* 1. 상품 이미지 영역*/}
            <div className="product-image">
                { /* 현업기준 실제 사진 없으면 보통 회색 빈칸*/}
                <img src={imageSrc} alt={title} />
            </div>

            {/* 2. 상품 텍스트 정보 영역 */}
            <div className="product-info">
                <h3 className="product-title">{title}</h3>

                {/* 동네 이름과 시간을 묶어주는 가장 흐린 글씨 */}
                <div className="product-meta">
                    <span>{location}</span> . <span>{timeAgo}</span>
                </div>

                {/* 가격은 가장 두껍게 */}
                <div className="product-price">{price.toLocaleString()}원</div>
            </div>

            {/* 3. 오른쪽 끝에 붙을 하트 개수 영역*/}
            <div className="product-like">
                {/* 조건부 렌더링: 하트가 1개 이상일 때만 하트 아이콘과 숫자 보여줌 */}
                {likes > 0 && (
                    <span className="likes-count">
                        ❤️{likes}
                    </span>
                )}
            </div>
        </div>
    );
}

