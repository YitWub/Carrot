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
        <div style={{ padding: "20px" }}>
            <h2>나의 당근</h2>

            {!user ? (
                <div>
                    <p>당근마켓에 오신 것을 환영합니다!</p>
                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#4285F4",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            fontSize: "16px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            style={{ width: "24px", height: "24px", backgroundColor: "white", padding: "2px", borderRadius: "2px" }}
                        />
                        Google 계정으로 계속하기
                    </button>
                </div>
            ) : (
                <div>
                    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "10px", marginBottom: "20px" }}>
                        <div style={{ fontSize: "24px", fontWeight: "bold" }}>🥕 {user.nickname}님</div>
                        <div style={{ color: "gray" }}>당근마켓과 함께한 지 N일째</div>
                    </div>
                    <button onClick={handleLogout} style={{ padding: "10px 20px" }}>로그아웃</button>
                </div>
            )}
        </div>
    );
}
