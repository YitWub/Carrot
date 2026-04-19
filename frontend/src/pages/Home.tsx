import ProductItem from '../components/home/ProductItem'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

interface ProductData {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
}

export default function Home() {

    const [products, setProducts] = useState<ProductData[]>([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 도구 추가!

    useEffect(() => {
        fetch('http://localhost:8080/api/products')
            .then((response) => response.json())
            .then((data) => {
                console.log("백엔드에서 데이터가 왔어요!!", data);
                setProducts(data);
            })
            .catch((error) => console.error('헉, 에러났어요:', error));
    }, []);

    return (
        <div className="home-container">
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price} 
                    imageSrc={product.imageUrl ? `http://localhost:8080/uploads/${product.imageUrl}` : "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80"}
                    location="우리 동네"
                    timeAgo="방금 전"
                    likes={0}
                />
            ))}

            {/* 글쓰기 버튼 (플로팅 버튼) */}
            <button
                className="floating-button"
                onClick={() => navigate('/write')}
            >
                +
            </button>
        </div>
    )
}
