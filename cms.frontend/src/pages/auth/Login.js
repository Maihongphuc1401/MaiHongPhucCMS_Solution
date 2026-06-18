import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="bg-white shadow-lg rounded-4 p-4 p-md-5"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">🔐 Đăng nhập</h3>

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
