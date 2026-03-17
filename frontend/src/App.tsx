import Layout from './components/layout/Layout'
import './App.css'

function App() {
  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h2>중고 거래가 가장 쉬운 마켓</h2>
        <p style={{ color: 'var(--color-primary)', marginTop: '10px' }}>
          당근마켓 클론을 시작합니다!
        </p>
      </div>
    </Layout>
  )
}

export default App