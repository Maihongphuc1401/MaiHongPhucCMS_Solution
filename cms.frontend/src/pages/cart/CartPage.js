import React, { useState, useEffect } from "react";
import cartService from "../../services/cartService";
import { useAuth } from "../../contexts/AuthContext";
import httpAxios from "../../services/httpAxios";
import { Link, useNavigate } from "react-router-dom";

// 🧠 Helper xử lý URL ảnh
const buildImageUrl = (raw) => {
  if (!raw) return "";
  const isAbsolute = raw.startsWith("http://") || raw.startsWith("https://");
  if (isAbsolute) return raw;
  const parts = raw.split("/");
  const filename = raw.includes("/") ? parts[parts.length - 1] : raw;
  return `${httpAxios.defaults.baseURL}/public/products/image/${filename}`;
};

const CartPageUser = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!user?.userId) {
          setError("⚠️ Vui lòng đăng nhập để xem giỏ hàng!");
          setLoading(false);
          return;
        }
        const data = await cartService.getCartByUser(user.userId);
        setCart(data);
      } catch (err) {
        console.error("❌ Lỗi khi tải giỏ hàng:", err);
        setError("Không thể tải giỏ hàng của bạn.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const cartItems = cart?.cartItems || [];

  // ✅ Chọn / bỏ chọn sản phẩm
  const toggleSelectItem = (cartItemId) => {
    setSelectedItems((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  // ✅ Tổng tiền
  const totalSelectedPrice = selectedItems.reduce((sum, id) => {
    const item = cartItems.find((p) => p.cartItemId === id);
    if (!item) return sum;
    const price = item.product.specialPrice || item.product.productPrice || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  // ✅ Thanh toán
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("⚠️ Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!");
      return;
    }
    const selectedProducts = cartItems.filter((i) =>
      selectedItems.includes(i.cartItemId)
    );
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    navigate("/checkout");
  };

  // ================= UI ===================
  if (loading)
    return <div className="container text-center mt-5">⏳ Đang tải giỏ hàng...</div>;

  if (error)
    return (
      <div className="container text-center mt-5 text-danger">
        {error}
        <br />
        <Link to="/login" className="btn btn-primary mt-3">
          Đăng nhập ngay
        </Link>
      </div>
    );

  if (!cart || cartItems.length === 0)
    return (
      <div className="container text-center py-5">
        <h3>🛒 Giỏ hàng của bạn đang trống!</h3>
        <Link to="/" className="btn btn-primary mt-3">
          Tiếp tục mua sắm
        </Link>
      </div>
    );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#16a34a", fontWeight: 800 }}>🛍 Giỏ hàng của bạn</h2>
        <Link to="/" className="btn btn-outline-primary">
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* Bảng sản phẩm */}
      <div
        style={{
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th></th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Giá gốc</th>
              <th>Giảm (%)</th>
              <th>Giá sau giảm</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Danh mục</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => {
              const product = item.product;
              const imgUrl = buildImageUrl(product.image);
              const price = product.specialPrice || product.productPrice || 0;
              const total = price * (item.quantity || 1);

              return (
                <tr key={item.cartItemId}>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.cartItemId)}
                      onChange={() => toggleSelectItem(item.cartItemId)}
                    />
                  </td>
                  <td>
                    <img
                      src={imgUrl}
                      alt={product.productName}
                      width="70"
                      height="70"
                      style={{
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #ddd",
                      }}
                    />
                  </td>
                  <td>
                    <strong>{product.productName}</strong>
                  </td>
                  <td style={{ maxWidth: 250 }}>{product.description || "—"}</td>
                  <td>{product.productPrice?.toLocaleString()}₫</td>
                  <td>{product.discount || 0}%</td>
                  <td className="text-success fw-bold">
                    {product.specialPrice?.toLocaleString()}₫
                  </td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-danger fw-bold">{total.toLocaleString()}₫</td>
                  <td>
                    {product.category?.categoryName ? (
                      <span
                        style={{
                          background: "#e3f2fd",
                          color: "#1565c0",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        {product.category.categoryName}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Tổng cộng & Thanh toán */}
      <div
        className="mt-4 d-flex justify-content-between align-items-center"
        style={{ borderTop: "2px solid #eee", paddingTop: 16 }}
      >
        <h5>
          Tổng cộng:{" "}
          <span className="text-danger fw-bold">
            {totalSelectedPrice.toLocaleString()}₫
          </span>
        </h5>
        <button className="btn btn-success px-4" onClick={handleCheckout}>
          Thanh toán ngay 💳
        </button>
      </div>
    </div>
  );
};

export default CartPageUser;
