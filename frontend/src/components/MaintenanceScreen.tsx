import React, { useEffect } from 'react';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { apiClient } from '../api/client';

const MaintenanceScreen: React.FC = () => {
  const setMaintenance = useMaintenanceStore((state) => state.setMaintenance);

  useEffect(() => {
    // 5초마다 백엔드가 켜졌는지 확인
    const interval = setInterval(async () => {
      try {
        // 아무 API나 호출해서 200 OK가 떨어지는지 확인 (가벼운 상품 목록 조회)
        const response = await apiClient.get('/api/v1/products?size=1');
        if (response.status === 200) {
          // 서버 복구 완료!
          setMaintenance(false);
        }
      } catch (error) {
        // 여전히 502 등 에러라면 계속 대기
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [setMaintenance]);

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      {/* 로딩 애니메이션 */}
      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-8"></div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">서버 업데이트 중입니다</h2>
      <p className="text-gray-500 text-center leading-relaxed">
        더 나은 서비스를 위해 서버를 업데이트하고 있습니다.<br />
        약 1~2분 정도 소요되며, 완료되면 자동으로 화면이 넘어갑니다.
      </p>
    </div>
  );
};

export default MaintenanceScreen;
