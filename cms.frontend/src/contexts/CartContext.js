import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const { user: currentUser } = useAuth();

    // 🧠 1. Mỗi khi User thay đổi (Đăng nhập/Đăng xuất), tự động load giỏ hàng tương ứng từ LocalStorage
    useEffect(() => {
        if (currentUser && currentUser.userId) {
            const localCart = cartService.getCartByUser();
            setCart(localCart);
        } else {
            setCart([]); // Nếu đăng xuất thì làm trống giỏ hàng trên giao diện
        }
    }, [currentUser]);

    // 🛒 2. Thêm sản phẩm vào giỏ hàng cục bộ
    const addToCart = (product) => {
        if (!currentUser || !currentUser.userId) {
            alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            return;
        }

        try {
            // Gọi service để cập nhật LocalStorage (Truyền thẳng object product từ DB của bạn)
            const updatedCart = cartService.addProductToCart(product, 1);

            // Cập nhật State để giao diện React tự re-render ngay lập tức
            setCart(updatedCart);

            alert(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
        } catch (error) {
            console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
            alert("Không thể thêm sản phẩm vào giỏ hàng!");
        }
    };

    // ❌ 3. Xoá sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        if (!currentUser?.userId) return;

        try {
            const updatedCart = cartService.deleteProductFromCart(productId);
            setCart(updatedCart);
            alert("🗑 Đã xóa sản phẩm khỏi giỏ hàng!");
        } catch (error) {
            console.error("❌ Lỗi khi xóa sản phẩm:", error);
            alert("Không thể xóa sản phẩm khỏi giỏ hàng.");
        }
    };

    // 🔄 4. Cập nhật số lượng sản phẩm (Tăng / Giảm số lượng)
    const updateQuantity = (productId, qty) => {
        if (!currentUser?.userId) return;
        if (qty < 1) {
            removeFromCart(productId);
            return;
        }

        try {
            const updatedCart = cartService.updateProductQuantityInCart(productId, qty);
            setCart(updatedCart);
        } catch (error) {
            console.error("❌ Lỗi cập nhật số lượng:", error);
            alert("Không thể cập nhật số lượng sản phẩm.");
        }
    };

    // 🧹 5. Xóa sạch giỏ hàng (Gọi sau khi đã thanh toán thành công)
    const clearCart = () => {
        try {
            cartService.clearCart();
            setCart([]);
        } catch (error) {
            console.error("❌ Lỗi khi xóa toàn bộ giỏ hàng:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);