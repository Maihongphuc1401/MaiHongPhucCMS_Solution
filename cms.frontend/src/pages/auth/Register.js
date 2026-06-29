import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";

const Register = () => {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
        street: "",
        buildingName: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const togglePassword = () => setShowPassword(!showPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra rỗng
        for (let key in form) {
            if (form[key].trim() === "") {
                alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
                return;
            }
        }

        // 2. Kiểm tra khớp mật khẩu
        if (form.password !== form.confirmPassword) {
            alert("⚠️ Mật khẩu xác nhận không khớp!");
            return;
        }

        // 3. Chuẩn hóa & Gộp chuỗi để khớp HOÀN TOÀN với Entity Customer trong ASP.NET Core
        const customerDto = {
            fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
            email: form.email.trim(),
            phone: form.mobileNumber.trim(),
            password: form.password.trim(),
            address: `${form.buildingName.trim()}, ${form.street.trim()}, ${form.city.trim()}, ${form.state.trim()}, ${form.country.trim()} (Mã vùng: ${form.pincode.trim()})`
        };

        console.log("📤 Gửi Dto sang ASP.NET:", customerDto);

        try {
            await authService.register(customerDto);
            alert("🎉 Đăng ký tài khoản khách hàng thành công!");
            navigate("/login");
        } catch (err) {
            console.error("❌ Lỗi đăng ký:", err);
            alert("Đăng ký thất bại! " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="auth-wrapper py-5 bg-light d-flex justify-content-center align-items-center">
            <div className="auth-card bg-white shadow-lg rounded-4 p-4 p-md-5" style={{ width: "100%", maxWidth: "600px" }}>
                <h3 className="text-center mb-4 fw-bold text-success">✨ Tạo tài khoản mới</h3>
                <form onSubmit={handleSubmit}>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Họ</label>
                            <input name="firstName" placeholder="Nhập họ" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Tên</label>
                            <input name="lastName" placeholder="Nhập tên" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số điện thoại</label>
                        <input name="mobileNumber" placeholder="Nhập số điện thoại" className="form-control form-control-lg" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input name="email" type="email" placeholder="Nhập email của bạn" className="form-control form-control-lg" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input name="password" type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" className="form-control form-control-lg" onChange={handleChange} required />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
                        <input name="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Nhập lại mật khẩu" className="form-control form-control-lg" onChange={handleChange} required />
                        <div className="form-check mt-2">
                            <input type="checkbox" className="form-check-input" id="showPassword" onChange={togglePassword} />
                            <label htmlFor="showPassword" className="form-check-label small">Hiển thị mật khẩu</label>
                        </div>
                    </div>

                    <h5 className="fw-bold text-primary mb-3">🏠 Địa chỉ giao hàng</h5>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Số nhà / Tên tòa nhà</label>
                        <input name="buildingName" placeholder="VD: Số 45, Chung cư EcoHome" className="form-control form-control-lg" onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên đường</label>
                        <input name="street" placeholder="VD: Đường Nguyễn Trãi" className="form-control form-control-lg" onChange={handleChange} required />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Thành phố / Huyện</label>
                            <input name="city" placeholder="VD: Quận 1" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Tỉnh / Thành trực thuộc</label>
                            <input name="state" placeholder="VD: TP. Hồ Chí Minh" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-semibold">Quốc gia</label>
                            <input name="country" placeholder="VD: Việt Nam" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-4">
                            <label className="form-label fw-semibold">Mã bưu điện (Zip/Pincode)</label>
                            <input name="pincode" placeholder="VD: 700000" className="form-control form-control-lg" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success btn-lg w-100 fw-semibold shadow-sm">Đăng ký</button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">Đã có tài khoản? <a href="/login" className="text-decoration-none text-success fw-semibold">Đăng nhập ngay</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;