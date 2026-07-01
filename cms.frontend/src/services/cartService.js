// Quản lý giỏ hàng trực tiếp qua LocalStorage khớp với Entity Product của bạn
const CART_KEY = "local_cart_items";

// 1. Lấy toàn bộ danh sách item trong giỏ
const getCartByUser = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

// 2. Thêm sản phẩm vào giỏ hàng
const addProductToCart = (product, quantity = 1) => {
    let cart = getCartByUser();

    // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa (Dựa theo thực thể Product.Id)
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Lưu cấu trúc gọn nhẹ chứa thông tin Product chính xác theo DB
        cart.push({
            cartItemId: product.id, // Dùng tạm Product.Id làm khóa định danh row
            quantity: quantity,
            product: {
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                categoryProduct: product.categoryProduct
            }
        });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
};

// 3. Cập nhật số lượng sản phẩm
const updateProductQuantityInCart = (productId, quantity) => {
    let cart = getCartByUser();
    const item = cart.find(item => item.product.id === productId);
    if (item) {
        item.quantity = quantity;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
};

// 4. Xóa sản phẩm khỏi giỏ
const deleteProductFromCart = (productId) => {
    let cart = getCartByUser();
    cart = cart.filter(item => item.product.id !== productId);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return cart;
};

// 5. Xóa sạch giỏ hàng (Sau khi đặt hàng thành công)
const clearCart = () => {
    localStorage.removeItem(CART_KEY);
};

const cartService = {
    getCartByUser,
    addProductToCart,
    updateProductQuantityInCart,
    deleteProductFromCart,
    clearCart
};

export default cartService;