import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";

const Register = () => {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState(""); // 💡 Quản lý lỗi hiển thị lên UI
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(""); // Clear lỗi cũ trước khi gửi request mới

        // 1. Kiểm tra rỗng tất cả các ô input
        for (let key in form) {
            if (form[key].trim() === "") {
                setErrorMsg("⚠️ Vui lòng nhập đầy đủ tất cả thông tin!");
                return;
            }
        }

        // 2. Kiểm tra độ dài mật khẩu
        if (form.password.length < 6) {
            setErrorMsg("⚠️ Mật khẩu phải có tối thiểu 6 ký tự!");
            return;
        }

        // 3. Kiểm tra khớp mật khẩu gõ lại
        if (form.password !== form.confirmPassword) {
            setErrorMsg("⚠️ Mật khẩu xác nhận không khớp!");
            return;
        }

        // 4. Tạo Object gửi đi đúng định dạng của Entity Customer
        const customerPayload = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            password: form.password.trim(),
        };

        try {
            await authService.register(customerPayload);
            alert("🎉 Đăng ký tài khoản thành công!");
            navigate("/login");
        } catch (err) {
            console.error("❌ Lỗi hệ thống:", err);
            // 💡 Lấy thông điệp lỗi chi tiết (như trùng Email) từ authService trả về
            setErrorMsg(err.message || "Đăng ký thất bại, vui lòng kiểm tra lại dữ liệu!");
        }
    };

    return (
        <div className="auth-wrapper py-5 bg-light d-flex justify-content-center align-items-center min-vh-100">
            <div className="auth-card bg-white shadow-lg rounded-4 p-4 p-md-5" style={{ width: "100%", maxWidth: "460px" }}>
                <h3 className="text-center mb-4 fw-bold text-success">✨ Tạo tài khoản mới</h3>

                {/* 💡 Vùng hiển thị thông báo lỗi động */}
                {errorMsg && (
                    <div className="alert alert-danger py-2 text-center small fw-semibold rounded-3 mb-3">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Họ và Tên</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Nhập đầy đủ họ và tên..."
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input
                            name="phone"
                            type="text"
                            placeholder="Nhập số điện thoại (10-11 số)..."
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="VD: nguyenvan@gmail.com"
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Địa chỉ nhận hàng</label>
                        <input
                            name="address"
                            type="text"
                            placeholder="Số nhà, tên đường, quận, thành phố..."
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Tối thiểu 6 ký tự"
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                        <input
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu..."
                            className="form-control form-control-lg"
                            onChange={handleChange}
                            required
                        />
                        <div className="form-check mt-2">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="showPasswordCheck"
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="showPasswordCheck" className="form-check-label small text-secondary">
                                Hiển thị mật khẩu
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success btn-lg w-100 fw-semibold shadow-sm">
                        Đăng ký ngay
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small mb-0">
                            Đã có tài khoản?{" "}
                            <a href="/login" className="text-decoration-none text-success fw-semibold">
                                Đăng nhập tại đây
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;