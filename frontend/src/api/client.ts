import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

// 당근마켓 백엔드 API 주소 (실제 배포 서버와 로컬 개발 환경 분리)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
export const UPLOADS_URL = API_BASE_URL ? `${API_BASE_URL}/uploads` : '/uploads';

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

// 응답을 가로채서 에러 처리 (500 에러 및 네트워크 에러 전역 토스트 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Maintenance checking
    if (error.response && (error.response.status === 502 || error.response.status === 503)) {
      // 서버 점검(업데이트) 중
      import('../store/useMaintenanceStore').then((module) => {
        module.useMaintenanceStore.getState().setMaintenance(true);
      });
      return Promise.reject(error);
    }

    const showToast = useToastStore.getState().showToast;
    
    if (!error.response) {
      // 서버에 연결할 수 없거나 네트워크 단절 시
      showToast('서버와 연결할 수 없습니다. 네트워크를 확인해주세요.', 'error');
    } else if (error.response.status >= 500) {
      // 서버 내부 500 이상 에러 발생 시
      showToast('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
    
    return Promise.reject(error);
  }
);
