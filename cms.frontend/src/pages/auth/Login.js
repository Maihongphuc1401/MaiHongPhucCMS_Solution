import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService"; // 💡 Gọi trực tiếp authService mới
import "./auth.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(""); // 💡 Quản lý lỗi đăng nhập sai tài khoản/mật khẩu
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // Reset lỗi cũ

        const credentials = {
            email: email.trim(),
            password: password.trim()
        };

        try {
            // Gọi xuống API login thông qua service
            await authService.login(credentials);

            alert("🎉 Đăng nhập thành công!");
            navigate("/");
            window.location.reload(); // Làm tươi lại trang để Navbar cập nhật trạng thái "Xin chào, ..."
        } catch (err) {
            console.error("❌ Lỗi đăng nhập:", err);
            // Hiển thị lỗi sai tài khoản mật khẩu từ Backend lên giao diện
            setErrorMsg(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại!");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div
                className="bg-white shadow-lg rounded-4 p-4 p-md-5"
                style={{ width: "100%", maxWidth: "420px" }}
            >
                <h3 className="text-center mb-4 fw-bold text-primary">🔐 Đăng nhập</h3>

                {/* 💡 Vùng hiển thị thông báo lỗi đăng nhập */}
                {errorMsg && (
                    <div className="alert alert-danger py-2 text-center small fw-semibold rounded-3 mb-3">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg"
                            placeholder="Nhập email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-100 fw-semibold shadow-sm">
                        Đăng nhập
                    </button>

                    <div className="text-center mt-3">
                        <a href="/register" className="text-decoration-none text-secondary small">
                            Chưa có tài khoản? Đăng ký ngay
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;