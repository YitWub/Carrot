import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      {/* 1. 상단 바 (Header) */}
      <header className="header">
        <h1>용원 마켓</h1>
      </header>

      {/* 2. 메인 콘텐츠: 실제 스크롤 되는 부분 */}
      <main className="main-content">
        {children}
      </main>

      {/* 3. 하단 탭 바: 홈, 동네생활, 내 근처 등 고정 내비게이션 */}
      <nav className="bottom-nav">
        <button className="nav-item active">홈</button>
        <button className="nav-item">동네생활</button>
        <button className="nav-item">채팅</button>
        <button className="nav-item">나의 당근</button>
      </nav>
    </div>
  );
}
