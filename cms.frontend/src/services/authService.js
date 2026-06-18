import httpAxios from "./httpAxios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "/api/auth";

// 🟢 Đăng ký
const register = async (userData) => {
  try {
    const res = await httpAxios.post(`${BASE_URL}/register`, userData);
    return res.data;
  } catch (err) {
    console.error("❌ Chi tiết lỗi từ backend:", err.response?.data);
    throw new Error(err.response?.data?.message || "Đăng ký thất bại!");
  }
};

// 🟢 Đăng nhập
const login = async (credentials) => {
  try {
    const res = await httpAxios.post(`${BASE_URL}/login`, credentials);
    const token = res.data["jwt-token"];
    const userId = res.data.userId; // ✅ Backend trả về userId
    const email = res.data.email;
    const role = res.data.role;

    let decoded = {};
    try {
      decoded = jwtDecode(token);
      console.log("📜 Token decoded:", decoded);
    } catch (e) {
      console.warn("⚠️ Token không decode được:", e.message);
    }

    // ✅ Lưu user vào localStorage
    const user = { userId, email, role, token, decoded };
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("jwt-token", token);

    return user;
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    throw new Error(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
  }
};

// 🟢 Đăng xuất
const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("jwt-token");
};

// 🟢 Lấy thông tin user hiện tại
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export default { register, login, logout, getCurrentUser };
