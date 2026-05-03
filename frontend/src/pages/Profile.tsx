import { useState, useEffect } from "react";

interface User {
    id: number;
    email: string;
    nickname: string;
}

export default function Profile() {
    const [emailInput, setEmailInput] = useState("");
    const [user, setUser] = useState<User | null>(null);

    // 로컬 스토리지에서 사용자 정보 로드
    useEffect(() => {
        const savedUserId = localStorage.getItem("userId");
        const savedUserNickname = localStorage.getItem("userNickname");
        if (savedUserId && savedUserNickname) {
            setUser({ id: Number(savedUserId), email: "", nickname: savedUserNickname });
        }
    }, []);

    const handleLogin = () => {
        // 이메일 기반 로그인 요청
        fetch(`${import.meta.env.VITE_API_BASE_URL}/users/login?email=${emailInput}`)
            .then(res => {
                if (!res.ok) throw new Error("없는 이메일입니다.");
                return res.json();
            })
            .then(data => {
                alert(`환영합니다, ${data.nickname}님!`);
                setUser(data);
                // 로컬 스토리지에 사용자 정보 저장
                localStorage.setItem("userId", data.id);
                localStorage.setItem("userNickname", data.nickname);
            })
            .catch(error => alert(error.message));
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

            {/* 미로그인 상태 UI */}
            {!user ? (
                <div>
                    <p>로그인을 진행해 주세요.</p>
                    <input
                        type="text"
                        placeholder="이메일을 입력하세요 (ex: carrot1@test.com)"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        style={{ width: "80%", padding: "10px", marginBottom: "10px" }}
                    />
                    <br />
                    <button onClick={handleLogin} style={{ padding: "10px 20px" }}>로그인</button>
                    <p style={{ marginTop: "20px", fontSize: "14px", color: "gray" }}>
                        가짜 유저 목록: carrot1@test.com(당근이), carrot2@test.com(토끼)
                    </p>
                </div>
            ) : (
                /* 로그인 상태 UI */
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
