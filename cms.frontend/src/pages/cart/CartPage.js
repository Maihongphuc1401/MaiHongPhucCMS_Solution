import React, { useState, useEffect } from "react";
import cartService from "../../services/cartService";
import { useAuth } from "../../contexts/AuthContext";
import httpAxios from "../../services/httpAxios";
import { Link, useNavigate } from "react-router-dom";

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='10' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";

const buildImageUrl = (raw) => {
    if (!raw || raw.includes("via.placeholder.com")) {
        return FALLBACK_IMAGE;
    }
    const isAbsolute = raw.startsWith("http://") || raw.startsWith("https://");
    if (isAbsolute) return raw;
    return `${httpAxios.defaults.baseURL}/public/products/image/${raw}`;
};

const CartPageUser = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // --- State quản lý thông tin nhận hàng trực tiếp tại giỏ hàng ---
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Load giỏ hàng từ localStorage và tự động điền thông tin User (nếu có)
    const loadLocalCart = () => {
        if (!user?.userId) {
            setError("⚠️ Vui lòng đăng nhập để xem giỏ hàng!");
            setLoading(false);
            return;
        }
        const items = cartService.getCartByUser();
        setCartItems(items);

        // Đổ dữ liệu sẵn có từ tài khoản đăng nhập vào ô nhập liệu
        setFullName(user.fullName || "");
        setPhone(user.phone || "");
        setAddress(user.address || "");

        setLoading(false);
    };

    useEffect(() => {
        loadLocalCart();
    }, [user]);

    // Checkbox chọn từng mặt hàng
    const toggleSelectItem = (cartItemId) => {
        setSelectedItems((prev) =>
            prev.includes(cartItemId)
                ? prev.filter((id) => id !== cartItemId)
                : [...prev, cartItemId]
        );
    };

    // Checkbox chọn tất cả
    const toggleSelectAll = () => {
        if (selectedItems.length === cartItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(cartItems.map(item => item.cartItemId));
        }
    };

    // Tăng / Giảm số lượng trực tiếp trên LocalStorage
    const handleUpdateQuantity = (productId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) {
            handleDeleteProduct(productId);
            return;
        }
        const updatedCart = cartService.updateProductQuantityInCart(productId, newQty);
        setCartItems(updatedCart);
    };

    // Xóa sản phẩm ra khỏi giỏ
    const handleDeleteProduct = (productId) => {
        if (window.confirm("🗑 Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            const updatedCart = cartService.deleteProductFromCart(productId);
            setCartItems(updatedCart);
            setSelectedItems((prev) => prev.filter((id) => id !== productId));
        }
    };

    // Tính tổng tiền dựa trên thuộc tính .price của các item được chọn
    const totalSelectedPrice = selectedItems.reduce((sum, id) => {
        const item = cartItems.find((p) => p.cartItemId === id);
        if (!item) return sum;
        return sum + (item.product.price || 0) * (item.quantity || 1);
    }, 0);

    // 🔥 XỬ LÝ CHUYỂN TRANG CHECKOUT: KIỂM TRA THÔNG TIN GIAO HÀNG TRƯỚC
    const handleGoToCheckout = () => {
        if (selectedItems.length === 0) {
            alert("⚠️ Vui lòng tích chọn ít nhất 1 sản phẩm để thực hiện thanh toán!");
            return;
        }

        // --- Kiểm tra nghiêm ngặt thông tin khách hàng nhập ---
        if (!fullName.trim()) {
            alert("⚠️ Vui lòng nhập Họ tên người nhận hàng trước khi thanh toán!");
            return;
        }
        if (!phone.trim()) {
            alert("⚠️ Vui lòng nhập Số điện thoại nhận hàng!");
            return;
        }
        const phoneRegex = /^(0[35789])[0-9]{8}$/;
        if (!phoneRegex.test(phone.trim())) {
            alert("⚠️ Số điện thoại không hợp lệ (Phải bắt đầu từ 0, có 10 chữ số)!");
            return;
        }
        if (!address.trim()) {
            alert("⚠️ Vui lòng cung cấp Địa chỉ nhận hàng!");
            return;
        }

        // Lọc ra các item đang nằm trong mảng được tích chọn checkbox
        const selectedProducts = cartItems.filter((i) =>
            selectedItems.includes(i.cartItemId)
        );

        // Lưu thông tin sản phẩm đã chọn vào localStorage
        localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));

        // Đồng thời đóng gói luôn thông tin giao hàng vừa điền vào localStorage để trang Checkout nhận lại
        const shippingInfo = {
            fullName: fullName.trim(),
            phone: phone.trim(),
            address: address.trim()
        };
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

        // Điều hướng an toàn sang trang checkout
        navigate("/checkout");
    };

    if (loading) return <div className="container text-center mt-5">⏳ Đang tải giỏ hàng...</div>;

    if (error) return (
        <div className="container text-center mt-5 text-danger">
            {error} <br />
            <Link to="/login" className="btn btn-primary mt-3">Đăng nhập ngay</Link>
        </div>
    );

    if (cartItems.length === 0) return (
        <div className="container text-center py-5">
            <h3>🛒 Giỏ hàng của bạn đang trống!</h3>
            <Link to="/" className="btn btn-primary mt-3">Tiếp tục mua sắm</Link>
        </div>
    );

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: "#16a34a", fontWeight: 800 }}>🛍 Giỏ hàng của bạn</h2>
                <Link to="/" className="btn btn-outline-primary">Tiếp tục mua sắm</Link>
            </div>

            <div className="row g-4">
                {/* CỘT TRÁI: DANH SÁCH BẢNG SẢN PHẨM */}
                <div className="col-xl-8">
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", overflow: "hidden" }}>
                        <table className="table align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center" width="50">
                                        <input
                                            type="checkbox"
                                            checked={cartItems.length > 0 && selectedItems.length === cartItems.length}
                                            onChange={toggleSelectAll}
                                        />
                                    </th>
                                    <th>Hình ảnh</th>
                                    <th>Sản phẩm</th>
                                    <th>Đơn giá</th>
                                    <th className="text-center" width="120">Số lượng</th>
                                    <th>Thành tiền</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => {
                                    const product = item.product;
                                    const total = (product.price || 0) * item.quantity;

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
                                                    src={buildImageUrl(product.imageUrl)}
                                                    alt={product.name}
                                                    width="55" height="55"
                                                    style={{ borderRadius: 8, objectFit: "cover", border: "1px solid #eee" }}
                                                />
                                            </td>
                                            <td>
                                                <strong className="d-block text-truncate" style={{ maxWidth: "180px" }}>{product.name}</strong>
                                                <small className="text-muted d-block text-truncate" style={{ maxWidth: "180px" }}>
                                                    {product.description || "Không có mô tả"}
                                                </small>
                                            </td>
                                            <td className="fw-semibold text-dark">{product.price?.toLocaleString()}₫</td>
                                            <td className="text-center">
                                                <div className="input-group input-group-sm justify-content-center">
                                                    <button className="btn btn-outline-secondary" onClick={() => handleUpdateQuantity(product.id, item.quantity, -1)}>-</button>
                                                    <span className="input-group-text bg-white px-2 fw-medium">{item.quantity}</span>
                                                    <button className="btn btn-outline-secondary" onClick={() => handleUpdateQuantity(product.id, item.quantity, 1)}>+</button>
                                                </div>
                                            </td>
                                            <td className="text-danger fw-bold">{total.toLocaleString()}₫</td>
                                            <td>
                                                <button className="btn btn-sm btn-link link-danger text-decoration-none" onClick={() => handleDeleteProduct(product.id)}>
                                                    🗑 Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CỘT PHẢI: FORM NHẬP THÔNG TIN GIAO HÀNG BẮT BUỘC & TỔNG TIỀN */}
                <div className="col-xl-4">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "12px", backgroundColor: "#f8fafc" }}>
                        <h4 className="fw-bold mb-3 text-secondary border-bottom pb-2">📋 Thông tin nhận đơn</h4>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Tên người nhận <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${!fullName ? "is-invalid" : "is-valid"}`}
                                placeholder="Nhập tên người nhận..."
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Số điện thoại <span className="text-danger">*</span></label>
                            <input
                                type="tel"
                                className={`form-control form-control-sm ${!phone ? "is-invalid" : "is-valid"}`}
                                placeholder="Ví dụ: 0924198545..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label small fw-bold text-dark">Địa chỉ nhận hàng <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${!address ? "is-invalid" : "is-valid"}`}
                                placeholder="Số nhà, tên đường, khu vực..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="fw-bold text-muted">Tổng thanh toán:</span>
                            <span className="text-danger fw-bold fs-4">{totalSelectedPrice.toLocaleString()}₫</span>
                        </div>

                        <button onClick={handleGoToCheckout} className="btn btn-success w-100 fw-bold py-2 btn-lg">
                            Tiến hành thanh toán 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPageUser;