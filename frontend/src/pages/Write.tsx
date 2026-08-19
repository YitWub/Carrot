import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Camera, X } from 'lucide-react';
import { apiClient, UPLOADS_URL } from '../api/client';
import { useAuthStore } from '../store/useAuthStore';

export default function Write() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('비산동');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const myUserId = user?.userId;

    useEffect(() => {
        if (editId && myUserId) {
            apiClient.get(`/api/v1/products/${editId}`, {
                headers: { 'X-User-Id': myUserId }
            }).then(res => {
                const data = res.data;
                if (data.sellerId !== myUserId) {
                    alert('수정 권한이 없습니다.');
                    navigate(-1);
                    return;
                }
                setTitle(data.title);
                setPrice(data.price.toString());
                setLocation(data.location || '비산동');
                setContent(data.content);
                if (data.imageUrls && data.imageUrls.length > 0) {
                    setPreviewUrls(data.imageUrls.map((url: string) => `${UPLOADS_URL}/${url}`));
                }
            }).catch(err => {
                console.error(err);
                alert('상품 정보를 불러오지 못했습니다.');
                navigate(-1);
            });
        }
    }, [editId, myUserId, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileArray = Array.from(e.target.files);
            // 최대 10장으로 제한
            const newImages = [...images, ...fileArray].slice(0, 10);
            setImages(newImages);

            // 미리보기 URL 생성
            const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
            // 기존 URL과 합치기 (수정 모드에서는 새 이미지를 지원하지 않으므로 덮어쓰기)
            if (editId) {
                alert('현재 수정 시 기존 이미지를 유지하거나 새 이미지로 완전히 교체할 수 있습니다. 이미지는 저장 시 새 파일만 등록됩니다. (본문/제목/가격 우선 수정)');
                setPreviewUrls(newPreviewUrls);
            } else {
                setPreviewUrls(newPreviewUrls);
            }
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviewUrls = [...previewUrls];
        if (newPreviewUrls[index].startsWith('blob:')) {
            URL.revokeObjectURL(newPreviewUrls[index]);
        }
        newPreviewUrls.splice(index, 1);
        setPreviewUrls(newPreviewUrls);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!myUserId) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        if (price && Number(price) < 0) {
            alert("가격은 0원 이상이어야 합니다.");
            return;
        }

        if (editId) {
            try {
                await apiClient.put(`/api/v1/products/${editId}`, {
                    title,
                    price: price ? Number(price) : 0,
                    location,
                    content
                }, {
                    headers: { 'X-User-Id': myUserId }
                });
                alert('글이 성공적으로 수정되었어요!');
                navigate(`/product/${editId}`);
            } catch (error) {
                console.error(error);
                alert('수정에 실패했습니다.');
            }
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price || "0");
        formData.append("location", location);
        formData.append("content", content);
        formData.append("sellerId", myUserId.toString());
        
        images.forEach(image => {
            formData.append("images", image); // 백엔드 다중 이미지 키에 맞춤
        });

        try {
            await apiClient.post('/api/v1/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            alert('글을 성공적으로 올렸어요!');
            navigate('/');
        } catch (error: any) {
            console.error(error);
            const serverMessage = typeof error?.response?.data === 'string' ? error.response.data : null;
            alert(serverMessage || '앗! 글 작성에 실패했어요.');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white relative overflow-hidden h-full w-full max-w-[480px]">
            {/* 상단 헤더 */}
            <header className="flex items-center px-2 h-[60px] bg-white shrink-0">
                <button onClick={() => navigate(-1)} className="p-2 text-black">
                    <ChevronLeft size={28} />
                </button>
                <div className="flex-1 text-center font-bold text-[16px] text-[#B9B9B9] opacity-50 absolute right-4">
                    productUpload
                </div>
            </header>

            {/* 스크롤 본문 */}
            <div className="flex-1 overflow-y-auto">
                <form id="write-form" onSubmit={handleSubmit} className="flex flex-col pb-[100px]">
                    {/* 사진 업로드 (가로 스크롤) */}
                    <div className="flex px-4 pt-2 pb-6 overflow-x-auto gap-3 items-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <label className="w-[60px] h-[60px] bg-[#EEEEEE] rounded-[5px] flex flex-col items-center justify-center cursor-pointer shrink-0">
                            <Camera size={24} className="text-black mb-1" />
                            <input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>

                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative w-[60px] h-[60px] rounded-[5px] overflow-hidden shrink-0 border border-gray-200">
                                <img src={url} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                <button 
                                    type="button" 
                                    className="absolute top-1 right-1 w-[18px] h-[18px] bg-black/50 rounded-full flex items-center justify-center"
                                    onClick={() => removeImage(index)}
                                >
                                    <X size={12} className="text-white" />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-bold text-center py-[2px]">
                                        대표 사진
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="px-4 flex flex-col gap-6">
                        {/* 제목 */}
                        <div>
                            <label className="text-[13px] font-bold text-black mb-2 block">제목</label>
                            <input
                                type="text"
                                className="w-full h-[41px] bg-[#ECECEC] rounded-[5px] px-3 text-[14px] focus:outline-none placeholder-black/60 text-black"
                                placeholder="제목을 입력해주세요"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        {/* 본문 */}
                        <div>
                            <label className="text-[13px] font-bold text-black mb-2 block">본문</label>
                            <textarea
                                className="w-full h-[134px] bg-[#ECECEC] rounded-[5px] px-3 py-3 text-[14px] resize-none focus:outline-none placeholder-black/60 text-black"
                                placeholder="게시글 내용을 작성해 주세요"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        {/* 가격 */}
                        <div>
                            <label className="text-[13px] font-bold text-black mb-2 block">가격</label>
                            <input
                                type="number"
                                className="w-full h-[43px] bg-[#ECECEC] rounded-[5px] px-3 text-[14px] focus:outline-none placeholder-black/60 text-black"
                                placeholder="₩ 가격을 입력해 주세요"
                                value={price}
                                min="0"
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        {/* 위치(지역) */}
                        <div>
                            <label className="text-[13px] font-bold text-black mb-2 block">거래 희망 장소 (지역)</label>
                            <select
                                className="w-full h-[43px] bg-[#ECECEC] rounded-[5px] px-3 text-[14px] focus:outline-none text-black appearance-none"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            >
                                <option value="비산동">비산동</option>
                                <option value="관양동">관양동</option>
                                <option value="평촌동">평촌동</option>
                                <option value="호계동">호계동</option>
                                <option value="범계동">범계동</option>
                                <option value="안양동">안양동</option>
                                <option value="석수동">석수동</option>
                                <option value="박달동">박달동</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>

            {/* 하단 작성 버튼 */}
            <div className="absolute bottom-[24px] left-3 right-3 z-20">
                <button 
                    type="submit" 
                    form="write-form"
                    className="w-full h-[46px] bg-[#FF9D00] text-white font-bold rounded-[15px] text-[15px] shadow-sm active:bg-orange-500 transition-colors"
                >
                    작성 완료
                </button>
            </div>
        </div>
    );
}
