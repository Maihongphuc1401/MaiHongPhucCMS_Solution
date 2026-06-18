import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";
import Select from "react-select";

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

  // 🧠 Xử lý thay đổi input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔒 Ẩn/hiện mật khẩu
  const togglePassword = () => setShowPassword(!showPassword);

  // 📩 Gửi dữ liệu đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Kiểm tra tất cả ô có được nhập không
    for (let key in form) {
      if (form[key].trim() === "") {
        alert("⚠️ Vui lòng nhập đầy đủ thông tin: " + key);
        return;
      }
    }

    // ✅ Kiểm tra mật khẩu xác nhận
    if (form.password !== form.confirmPassword) {
      alert("⚠️ Mật khẩu xác nhận không khớp!");
      return;
    }

    const userData = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobileNumber.trim(),
      password: form.password.trim(),
      address: {
        street: form.street.trim(),
        buildingName: form.buildingName.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country.trim(),
        pincode: form.pincode.trim(),
      },
    };

    console.log("📤 Gửi đến backend:", userData);

    try {
      const res = await authService.register(userData);
      console.log("✅ Phản hồi backend:", res);
      alert("🎉 Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      console.error("❌ Lỗi đăng ký:", err);
      alert("Đăng ký thất bại! " + (err.message || ""));
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h3 className="text-center mb-4 fw-bold text-success">
          ✨ Tạo tài khoản mới
        </h3>
        <form onSubmit={handleSubmit} autoComplete="on">
          {/* --- Thông tin cá nhân --- */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Họ</label>
              <input
                name="firstName"
                placeholder="Nhập họ"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Tên</label>
              <input
                name="lastName"
                placeholder="Nhập tên"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Số điện thoại</label>
            <input
              name="mobileNumber"
              placeholder="Nhập số điện thoại"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          {/* --- Mật khẩu --- */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Xác nhận mật khẩu</label>
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPassword"
                onChange={togglePassword}
              />
              <label htmlFor="showPassword" className="form-check-label small">
                Hiển thị mật khẩu
              </label>
            </div>
          </div>

          {/* --- Địa chỉ --- */}
          <h5 className="fw-bold text-primary mb-3">🏠 Địa chỉ</h5>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tên đường</label>
            <input
              name="street"
              placeholder="VD: 12 Nguyễn Trãi"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Tên tòa nhà / số nhà</label>
            <input
              name="buildingName"
              placeholder="VD: Block A1, Chung cư Hoàng Anh"
              className="form-control form-control-lg"
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Thành phố</label>
              <input
                name="city"
                placeholder="VD: TP. Hồ Chí Minh"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Tỉnh / Bang</label>
              <input
                name="state"
                placeholder="VD: Hồ Chí Minh"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Quốc gia</label>
              <input
                name="country"
                placeholder="VD: Việt Nam"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Mã bưu điện</label>
              <input
                name="pincode"
                placeholder="VD: 700000"
                className="form-control form-control-lg"
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg w-100 fw-semibold shadow-sm"
          >
            Đăng ký
          </button>

          <div className="text-center mt-3">
            <p className="text-muted small">
              Đã có tài khoản?{" "}
              <a
                href="/login"
                className="text-decoration-none text-success fw-semibold"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
