import httpAxios from "./httpAxios";

// 🌟 Thay đổi sang API điều hướng đến CustomerApi mới
const BASE_URL = "/api/CustomerApi";

// 🟢 Lấy user theo ID (Đã sửa lỗi khai báo trùng lặp và lồng hàm)
const getUserById = async (userId) => {
    try {
        const res = await httpAxios.get(`${BASE_URL}/${userId}`);
        return res.data;
    } catch (error) {
        console.error("❌ Lỗi khi lấy thông tin user:", error);
        throw error;
    }
};

// 🟢 Cập nhật thông tin user
const updateUserProfile = async (id, data) => {
    const res = await httpAxios.put(`${BASE_URL}/${id}`, data);
    return res.data;
};

// 🟢 Lấy danh sách địa chỉ theo userId
const getUserAddresses = async (userId) => {
    const res = await httpAxios.get(`${BASE_URL}/${userId}/addresses`);
    return res.data; // trả về mảng address
};

// 🟢 Thêm địa chỉ mới
const addAddress = async (userId, addressData) => {
    const res = await httpAxios.post(`${BASE_URL}/${userId}/addresses`, addressData);
    return res.data;
};

// 🟢 Cập nhật địa chỉ
const updateAddress = async (userId, addressId, addressData) => {
    const res = await httpAxios.put(`${BASE_URL}/${userId}/addresses/${addressId}`, addressData);
    return res.data;
};

// 🟢 Xóa địa chỉ
const deleteAddress = async (userId, addressId) => {
    await httpAxios.delete(`${BASE_URL}/${userId}/addresses/${addressId}`);
};

// 🌟 Đảm bảo khối export nằm ở cấp ngoài cùng của file, không lỗi cấu trúc
export default {
    getUserById,
    updateUserProfile,
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
};