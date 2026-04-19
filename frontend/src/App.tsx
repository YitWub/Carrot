import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import './App.css'
import ProductDetail from './pages/ProductDetail'
import ChatDetail from './pages/ChatDetail' // 👈 요기 추가!
import Home from './pages/Home'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Write from './pages/Write' // 새로 만든 글쓰기 페이지 옷장(컴포넌트) 가져오기!

function App() {
  return (
    <Layout>
      {/* 
        여기가 마법의 스위치 구역(Routes)입니다!
        인터넷 주소(path)에 따라서 알맞은 부품(element)을 툭 얹어줍니다.
      */}
      <Routes>
        {/* 주소가 맨 처음 기본 주소(/)일 때는 <Home>을 돌려줘라 */}
        <Route path="/" element={<Home />} />

        {/* 주소가 /chat 일 때는 <Chat>을 돌려줘라 */}
        <Route path="/chat" element={<Chat />} />

        {/* 주소가 /profile 일 때는 <Profile>을 돌려줘라 */}
        <Route path="/profile" element={<Profile />} />

        {/* 주소가 /write 일 때는 <Write>를 돌려줘라 */}
        <Route path="/write" element={<Write />} />

        {/* 주소가 /products/숫자 일 때는 <ProductDetail>을 돌려줘라 */}
        {/* 콜론(:)은 이 자리에 어떠한 숫자나 문자가 들어와도 그 값 자체를 변수(id)로 쓰겠다는 의미입니다! */}
        <Route path="/products/:id" element={<ProductDetail />} /> {/*뭐임 이건*/}
        
        {/* 주소가 /chat/방번호 일 때 들어가는 진짜 채팅창 */}
        <Route path="/chat/:roomId" element={<ChatDetail />} />

      </Routes>
    </Layout>
  )
}

export default App
