import React, { createContext, useContext, useState, useEffect } from "react";
import cartService from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const { user: currentUser } = useAuth();

  // 🧠 Khi user thay đổi → tự load giỏ hàng từ backend
  useEffect(() => {
    const fetchCart = async () => {
      if (currentUser && currentUser.userId) {
        try {
          const userCart = await cartService.getCartByUser(currentUser.userId);
          setCart(userCart?.cartItems || []);
          setCartId(userCart.cartId);
        } catch (error) {
          console.error("❌ Lỗi khi tải giỏ hàng:", error);
          setCart([]);
          setCartId(null);
        }
      } else {
        setCart([]);
        setCartId(null);
      }
    };
    fetchCart();
  }, [currentUser]);

  // 🛒 Thêm sản phẩm vào giỏ
  const addToCart = async (product) => {
    if (!currentUser || !currentUser.userId) {
      alert("⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      // 🔹 Lấy giỏ hàng hoặc tạo mới
      let userCart;
      try {
        userCart = await cartService.getCartByUser(currentUser.userId);
      } catch {
        userCart = await cartService.createCartForUser(currentUser.userId);
      }

      const id = userCart.cartId;
      if (!id) {
        alert("Không tìm thấy giỏ hàng để thêm sản phẩm.");
        return;
      }

      // 🔹 Thêm sản phẩm vào giỏ (đúng API backend)
      await cartService.addProductToCart(id, product.productId, 1);

      // 🔹 Cập nhật state frontend
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === product.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.productId
              ? { ...i, quantity: (i.quantity || 1) + 1 }
              : i
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      alert(`✅ Đã thêm "${product.productName}" vào giỏ hàng!`);
    } catch (error) {
      console.error("❌ Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  // ❌ Xoá sản phẩm khỏi giỏ
  const removeFromCart = async (productId) => {
    if (!currentUser?.userId || !cartId) return;

    try {
      await cartService.deleteProductFromCart(cartId, productId);
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      alert("🗑 Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  // 🔄 Cập nhật số lượng
  const updateQuantity = async (productId, qty) => {
    if (!currentUser?.userId || !cartId) return;
    try {
      await cartService.updateProductQuantityInCart(cartId, productId, qty);
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, quantity: qty } : i
        )
      );
    } catch (error) {
      console.error("❌ Lỗi cập nhật số lượng:", error);
      alert("Không thể cập nhật số lượng sản phẩm.");
    }
  };

  // 🧹 Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    if (!currentUser?.userId || !cartId) return;
    try {
      for (const item of cart) {
        await cartService.deleteProductFromCart(cartId, item.productId);
      }
      setCart([]);
      alert("🧹 Đã xóa toàn bộ giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi xóa toàn bộ giỏ hàng:", error);
      alert("Không thể xóa toàn bộ giỏ hàng.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartId,
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
