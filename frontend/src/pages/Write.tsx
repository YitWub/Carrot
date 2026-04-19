import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Write.css';

export default function Write() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const myUserId = localStorage.getItem("userId");
        if (!myUserId) {
            alert("로그인이 필요합니다.");
            navigate('/profile');
            return;
        }

        // 이미지 파일 포함을 위해 FormData 사용
        const formData = new FormData();
        formData.append("title", title);
        formData.append("price", price);
        formData.append("content", content);
        formData.append("sellerId", myUserId);
        if (image) {
            formData.append("image", image);
        }

        fetch('http://localhost:8080/api/products', {
            method: 'POST',
            // headers의 Content-Type은 브라우저가 알아서 넣어주도록 생략해야 합니다!
            body: formData
        })
            .then((response) => response.json())
            .then((data) => {
                alert('글을 성공적으로 올렸어요!');
                navigate('/');
            })
            .catch((error) => alert('앗! 글 작성에 실패했어요.'));
    };

    return (
        <div className="write-container">
            <form className="write-form" onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                            }
                        }}
                        style={{ padding: "10px", width: "100%", backgroundColor: "white", borderRadius: "8px", border: "1px solid #ddd" }}
                    />
                </div>
                <input
                    type="text"
                    className="input-field"
                    placeholder="글 제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="number"
                    className="input-field"
                    placeholder="₩ 가격 (선택사항)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <textarea
                    className="textarea-field"
                    placeholder="게시글 내용을 작성해주세요. 가짜 약, 주류, 담배 등 판매 금지 물품은 게시가 제한될 수 있어요."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit" className="submit-button">작성 완료</button>
            </form>
        </div>
    );
}
