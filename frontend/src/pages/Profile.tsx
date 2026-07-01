import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

interface User {
    id: number;
    email: string;
    nickname: string;
}

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUserId = localStorage.getItem("userId");
        const savedUserNickname = localStorage.getItem("userNickname");
        if (savedUserId && savedUserNickname) {
            setUser({ id: Number(savedUserId), email: "", nickname: savedUserNickname });
        }
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userEmail = result.user.email;
            const userNickname = result.user.displayName;

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: userEmail, nickname: userNickname }),
            });

            if (!response.ok) {
                throw new Error("Server communication failed");
            }

            const data = await response.json();
            alert(`환영합니다, ${data.nickname}님!`);
            setUser(data);
            localStorage.setItem("userId", data.id);
            localStorage.setItem("userNickname", data.nickname);

        } catch (error: any) {
            console.error(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("userNickname");
        setUser(null);
        alert("로그아웃 되었습니다.");
    };

    return (
        <div style={{ padding: "30px 20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <h2 style={{ margin: 0 }}>나의 당근</h2>

            {!user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <p style={{ margin: 0, fontSize: "16px", color: "#333" }}>당근마켓에 오신 것을 환영합니다!</p>
                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#ff7e36",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            width: "fit-content",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}>
                        <div style={{ 
                            backgroundColor: "white", 
                            borderRadius: "50%", 
                            width: "28px", 
                            height: "28px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center" 
                        }}>
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                style={{ width: "18px", height: "18px" }}
                            />
                        </div>
                        Google 계정으로 계속하기
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}>🥕 {user.nickname}님</div>
                        <div style={{ color: "gray", fontSize: "14px" }}>당근마켓과 함께한 지 N일째</div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        style={{ 
                            padding: "10px 20px",
                            backgroundColor: "#f1f1f1",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "fit-content"
                        }}>
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
}
