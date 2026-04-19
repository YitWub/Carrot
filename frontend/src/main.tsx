import { StrictMode } from 'react' // 이게 최신 Vite 스타일이란가 뭔가
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 길잡이만 추가!
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
