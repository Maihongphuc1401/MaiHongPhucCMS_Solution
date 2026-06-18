import httpAxios from "./httpAxios";

const BASE_URL = "/api/public/users";

// 🟢 Lấy user theo ID (trả về đầy đủ: addresses, cart, roles)
const getUserById = async (id) => {
  const res = await httpAxios.get(`${BASE_URL}/${id}`);
  return res.data;
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

export default {
  getUserById,
  updateUserProfile,
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
