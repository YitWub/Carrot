import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// 당근마켓 백엔드 API 주소 (실제 배포 서버)
const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청을 보내기 직전에 가로채서(Interceptor) X-User-Id 헤더를 자동 주입
apiClient.interceptors.request.use(
  (config) => {
    // Zustand 스토어에서 유저 정보를 꺼내옴
    const user = useAuthStore.getState().user;
    if (user && user.userId) {
      config.headers['X-User-Id'] = user.userId.toString();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
