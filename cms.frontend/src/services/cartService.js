import httpAxios from "./httpAxios";

const BASE_URL = "/api/public";

// ✅ Lấy giỏ hàng theo userId (có chi tiết cartItems)
const getCartByUser = async (userId) => {
  try {
    const response = await httpAxios.get(`${BASE_URL}/users/${userId}/carts/detail`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
};

// ✅ Thêm sản phẩm vào giỏ hàng (đúng route backend của bạn)
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const response = await httpAxios.post(
      `${BASE_URL}/carts/add/product/${cartId}/product/${productId}/${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    throw error;
  }
};

// ✅ Cập nhật số lượng sản phẩm trong giỏ (admin route)
const updateProductQuantityInCart = async (cartId, productId, quantity) => {
  try {
    const response = await httpAxios.put(
      `/api/admin/carts/${cartId}/product/${productId}/${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật số lượng sản phẩm:", error);
    throw error;
  }
};

// ✅ Xoá sản phẩm khỏi giỏ
const deleteProductFromCart = async (cartId, productId) => {
  try {
    await httpAxios.delete(`/api/admin/carts/${cartId}/product/${productId}`);
    return true;
  } catch (error) {
    console.error("❌ Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
    throw error;
  }
};

// ✅ Tạo giỏ hàng cho user nếu chưa có
const createCartForUser = async (userId) => {
  try {
    const response = await httpAxios.post(`/api/users/${userId}/carts`);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi tạo giỏ hàng mới:", error);
    throw error;
  }
};

const cartService = {
  getCartByUser,
  addProductToCart,
  updateProductQuantityInCart,
  deleteProductFromCart,
  createCartForUser,
};

export default cartService;
