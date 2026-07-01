import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import userService from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Khi load app -> đọc từ localStorage
    // 🧠 Khi load app -> đọc từ localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);

            // ✅ Nếu có userId -> load lại hồ sơ mới nhất từ CustomerApi
            if (parsed.userId) {
                userService
                    .getUserById(parsed.userId)
                    .then((freshUser) => {
                        // Gộp dữ liệu tương thích hoàn toàn với DB Customer của bạn
                        const updatedUser = {
                            userId: parsed.userId,
                            email: freshUser.email || parsed.email,
                            fullName: freshUser.fullName || parsed.fullName, // 🌟 Thay cho firstName / lastName
                            phone: freshUser.phone,                         // 🌟 Thay cho mobileNumber
                            address: freshUser.address,                     // 🌟 Thêm thuộc tính địa chỉ từ DB
                            role: parsed.role || "Customer",
                            token: parsed.token,
                            // Nếu API không dùng JWT Token thì loại bỏ phần decode để tránh crash ứng dụng
                            decoded: parsed.token ? (parsed.decoded || jwtDecode(parsed.token)) : null,
                        };

                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                    })
                    .catch((err) =>
                        console.error("⚠️ Lỗi khi load lại hồ sơ khách hàng:", err.message)
                    );
            }

            console.log("🔐 User từ localStorage:", parsed);
        }

        setLoading(false);
    }, []);

  // 🟢 Đăng nhập
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });

      // Giải mã token
      const decoded = jwtDecode(res.token);

      const minimalUser = {
        userId: res.userId,
        email: res.email,
        role: res.role,
        token: res.token,
        decoded,
      };

      setUser(minimalUser);
      localStorage.setItem("user", JSON.stringify(minimalUser));

      alert("🎉 Đăng nhập thành công!");
    } catch (err) {
      alert(err.message || "❌ Lỗi đăng nhập");
    }
  };

  // 🟢 Đăng ký
  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      const decoded = jwtDecode(newUser.token);

      const minimalUser = {
        userId: newUser.userId,
        email: newUser.email,
        role: newUser.role,
        token: newUser.token,
        decoded,
      };

      setUser(minimalUser);
      localStorage.setItem("user", JSON.stringify(minimalUser));

      alert("✅ Đăng ký thành công!");
    } catch (err) {
      alert(err.message || "❌ Lỗi đăng ký");
    }
  };

  // 🟢 Đăng xuất
  const logout = () => {
    authService.logout();
    localStorage.removeItem("user");
    setUser(null);
    alert("👋 Đăng xuất thành công!");
  };

  if (loading) return <div className="text-center mt-5">⏳ Đang tải...</div>;

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
