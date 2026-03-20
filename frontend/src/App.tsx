import Layout from './components/layout/Layout'
import ProductItem from './components/home/ProductItem' // 우리가 방금 만든 부품 불러오기!
import './App.css'

// 나중에 백엔드(서버)에서 이런 형태(리스트)로 데이터를 받아오게 될 겁니다!
const DUMMY_PRODUCTS = [
  {
    id: 1,
    imageSrc: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&q=80', // 맥북 사진
    title: '맥북 프로 16인치 M1 Max 팝니다',
    location: '강남구 역삼동',
    timeAgo: '10분 전',
    price: 1850000,
    likes: 12
  },
  {
    id: 2,
    imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', // 애플워치 사진
    title: '애플워치 울트라 미개봉',
    location: '서초구 반포동',
    timeAgo: '1시간 전',
    price: 950000,
    likes: 5
  },
  {
    id: 3,
    imageSrc: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80', // 헤드폰 사진
    title: '에어팟 맥스 스페이스그레이 (급처)',
    location: '송파구 잠실동',
    timeAgo: '2일 전',
    price: 450000,
    likes: 0 // 하트가 0개면 우측 하단에 아예 안 그려짐!
  }
];

function App() {
  return (
    <Layout>
      {/* 
        JavaScript 기초 문법 (map): 
        장바구니(배열) 안의 물건을 하나씩 꺼내서 똑같은 모양의 틀(ProductItem)로 찍어내는 마법의 반복문입니다.
      */}
      <div>
        {DUMMY_PRODUCTS.map((product) => (
          <ProductItem
            key={product.id} // 리액트 반복문에서는 고유한 이름표(key)를 꼭 달아줘야 함!
            imageSrc={product.imageSrc}
            title={product.title}
            location={product.location}
            timeAgo={product.timeAgo}
            price={product.price}
            likes={product.likes}
          />
        ))}
      </div>
    </Layout>
  )
}

export default App
