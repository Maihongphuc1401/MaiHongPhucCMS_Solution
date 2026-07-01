import httpAxios from "./httpAxios";

// ❌ Đổi từ "/api/auth" sang "/api/CustomerApi" cho đúng Controller mới
const BASE_URL = "/api/CustomerApi";

// 🟢 Đăng ký khách hàng
const register = async (userData) => {
    try {
        const res = await httpAxios.post(`${BASE_URL}/register`, userData);
        return res.data;
    } catch (err) {
        console.error("❌ Chi tiết lỗi đăng ký từ backend:", err.response?.data);

        // Đọc thông báo lỗi cụ thể từ ModelState hoặc lỗi chuỗi text trả về
        let errorMsg = "Đăng ký thất bại!";
        if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
        } else if (err.response?.data?.errors) {
            // Trường hợp ASP.NET trả về lỗi Validation (ModelState)
            errorMsg = Object.values(err.response.data.errors).flat().join(" | ");
        }

        throw new Error(errorMsg);
    }
};

// 🟢 Đăng nhập khách hàng
const login = async (credentials) => {
    try {
        // credentials chứa dữ liệu { email, password } gửi từ Login.js
        const res = await httpAxios.post(`${BASE_URL}/login`, credentials);

        // Vì hiện tại API trả về object: { message, user: { id, fullName, email } }
        const backendUser = res.data.user;

        // Chuẩn hóa cấu trúc object để lưu vào localStorage khớp với các component khác đang dùng
        const user = {
            userId: backendUser.id,
            email: backendUser.email,
            fullName: backendUser.fullName,
            role: "Customer", // Gán cứng role nếu dự án phân biệt quyền ở Client
            token: null // Hiện tại API chưa sinh JWT, để tạm null để không lỗi logic code khác
        };

        // ✅ Lưu thông tin user vào localStorage để duy trì trạng thái đăng nhập
        localStorage.setItem("user", JSON.stringify(user));

        return user;
    } catch (err) {
        console.error("❌ Lỗi đăng nhập:", err.response?.data);
        throw new Error(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu!");
    }
};

// 🟢 Đăng xuất khách hàng
const logout = () => {
    // Xóa toàn bộ dữ liệu phiên làm việc của khách hàng ra khỏi trình duyệt
    localStorage.removeItem("user");
    localStorage.removeItem("jwt-token");

    // Điều hướng hoặc tải lại trang nếu cần (thường xử lý ở Component/Context, nhưng clear ở đây là cốt lõi)
    console.log("🔒 Đã xóa phiên đăng nhập của khách hàng.");
};

// 🟢 Lấy thông tin khách hàng hiện tại đang đăng nhập
const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error("⚠️ Không thể đọc thông tin user từ localStorage:", e);
        return null;
    }
};

export default { register, login, logout, getCurrentUser };