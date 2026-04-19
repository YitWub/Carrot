import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./ChatDetail.css";

interface ChatMessage {
    id: number;
    message: string;
    sender: {
        id: number;
        nickname: string;
    };
}

export default function ChatDetail() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const myUserId = Number(localStorage.getItem("userId")); // 현재 접속중인 사용자 ID

    // 스크롤 제어 참조
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. 메시지 조회 (Polling)
    const fetchMessages = () => {
        fetch(`http://localhost:8080/api/chat/room/${roomId}`)
            .then(res => res.json())
            .then(data => {
                setMessages(data);
            })
            .catch(err => console.error("메시지 로딩 실패", err));
    };

    // 2. 초기 로드 및 Polling 설정
    useEffect(() => {
        fetchMessages(); 
        
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 2000);

        return () => clearInterval(intervalId);
    }, [roomId]);

    // 3. 메시지 전송
    const handleSend = () => {
        if (!inputText.trim()) return;

        fetch(`http://localhost:8080/api/chat/message?roomId=${roomId}&senderId=${myUserId}`, {
            method: "POST",
            body: inputText
        })
        .then(() => {
            setInputText("");
            fetchMessages(); 
        })
        .catch(err => alert("전송 실패"));
    };

    // 4. 새 메시지 수신 시 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg) => {
                    const isMine = msg.sender.id === myUserId;
                    return (
                        <div key={msg.id} className={`message-wrapper ${isMine ? 'mine' : 'other'}`}>
                            {!isMine && <div className="sender-name">{msg.sender.nickname}</div>}
                            <div className="message-bubble">
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* 입력창 영역 */}
            <div className="chat-input-area">
                <input 
                    type="text" 
                    className="chat-input"
                    placeholder="메시지를 입력하세요" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="chat-send-btn" onClick={handleSend}>전송</button>
            </div>
        </div>
    );
}
