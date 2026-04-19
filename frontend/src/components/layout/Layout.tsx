import './Layout.css';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="layout">
      {/* 1. 상단 바 (Header) */}
      <header className="header">
        <h1>용원 마켓</h1>
      </header>

      {/* 2. 메인 콘텐츠: -> home chat profile 실제 스크롤 되는 부분 */}
      <main className="main-content">
        {children}
      </main>

      {/* 3. 하단 탭 바: 홈, 동네생활, 내 근처 등 고정 내비게이션 */}
      <nav className="bottom-nav">
        {/* 
          2. <button> 대신 <Link to="이동할 주소">를 씁니다.
             Tip: 지금 있는 주소(location.pathname)랑 똑같으면 글씨를 진하게('active') 만듭니다!
        */}
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          홈
        </Link>

        {/* 동네생활은 아직 안 만들었으니 임시로 홈으로 가게 둡니다 */}
        <Link to="/" className="nav-item">
          동네생활
        </Link>
        <Link to="/chat" className={`nav-item ${location.pathname === '/chat' ? 'active' : ''}`}>
          채팅
        </Link>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          나의 당근
        </Link>
      </nav>
    </div>
  ); // 아직 이해 못했으니 이부분 문법 더 찾아보기
}
