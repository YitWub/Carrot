import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ChatRoom {
    id: number;
    product: {
        title: string;
    };
    buyer: {
        nickname: string;
    };
}

export default function Chat() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const myUserId = localStorage.getItem("userId");
        if (!myUserId) {
            return;
        }

        fetch(`${import.meta.env.VITE_API_BASE_URL}/chat/my-rooms?userId=${myUserId}`)
            .then(res => res.json())
            .then(data => {
                setRooms(data);
            })
            .catch(err => console.error(err));
    }, []);

    const myUserId = localStorage.getItem("userId");
    if (!myUserId) {
        return <div style={{ padding: "20px" }}>로그인이 필요합니다.</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ paddingBottom: "10px", borderBottom: "1px solid #ddd" }}>채팅방 목록</h2>
            
            {rooms.length === 0 ? (
                <p>진행 중인 채팅이 없습니다.</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px" }}>
                    {rooms.map((room: ChatRoom) => (
                        <div 
                            key={room.id}
                            style={{ padding: "15px", border: "1px solid #eee", borderRadius: "10px", cursor: "pointer" }}
                            onClick={() => navigate(`/chat/${room.id}`)}
                        >
                            <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                                {room.product.title}
                            </div>
                            <div style={{ fontSize: "14px", color: "gray" }}>
                                대화 상대: {room.buyer.nickname}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}