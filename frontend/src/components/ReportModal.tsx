import React, { useState } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: number;
    type: 'PRODUCT' | 'USER' | 'CHAT';
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetId, type }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useAuthStore(state => state.user);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert('신고 내용을 입력해주세요.');
            return;
        }

        try {
            setIsSubmitting(true);
            await apiClient.post('/api/v1/reports', {
                targetId,
                type,
                content
            }, {
                headers: { 'X-User-Id': user?.userId }
            });
            alert('신고가 접수되었습니다.');
            onClose();
            setContent('');
        } catch (error) {
            console.error('신고 실패:', error);
            alert('신고 접수에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl flex flex-col" onClick={e => e.stopPropagation()}>
                <h3 className="text-[18px] font-bold text-black mb-2">신고하기</h3>
                <p className="text-[13px] text-gray-500 mb-4">
                    신고 내용은 관리자 메일(yong-1@naver.com)로 즉시 전송됩니다. 허위 신고 시 이용이 제한될 수 있습니다.
                </p>
                <textarea
                    className="w-full h-32 border border-gray-300 rounded-xl p-3 mb-4 resize-none text-[14px] focus:outline-none focus:border-[#FF7E36] focus:ring-1 focus:ring-[#FF7E36]"
                    placeholder="신고 사유를 상세히 적어주세요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="flex gap-2 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200"
                        disabled={isSubmitting}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-3 bg-[#FF7E36] rounded-xl font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '접수 중...' : '신고하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};
