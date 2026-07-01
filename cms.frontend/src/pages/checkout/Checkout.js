import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import httpAxios from "../../services/httpAxios";

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='10' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";

const Checkout = () => {
    const authContext = useAuth();
    const cartContext = useCart();
    const navigate = useNavigate();
    const user = authContext?.user || null;

    // --- State quản lý thông tin giao hàng khách nhập ---
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");

    const [checkoutItems, setCheckoutItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Trạng thái chờ xử lý ban đầu

    // 🚀 1. SỬA LỖI: Load toàn bộ dữ liệu từ LocalStorage & hạ cờ isLoading
    useEffect(() => {
        // Lấy thông tin giao hàng đã điền từ trang Giỏ hàng
        const savedShipping = localStorage.getItem("shippingInfo");
        if (savedShipping) {
            const parsedShipping = JSON.parse(savedShipping);
            setFullName(parsedShipping.fullName || "");
            setPhone(parsedShipping.phone || "");
            setAddress(parsedShipping.address || "");
        }

        // Lấy danh sách sản phẩm được chọn từ trang Giỏ hàng
        const savedItems = localStorage.getItem("checkoutItems");
        if (savedItems) {
            setCheckoutItems(JSON.parse(savedItems));
        }

        // Tải xong dữ liệu, tắt màn hình Loading
        setIsLoading(false);
    }, []); 

    // 2. Tính tổng tiền an toàn
    const totalAmount = checkoutItems.reduce((sum, item) => {
        const price = Number(item?.product?.price) || 0;
        const qty = Number(item?.quantity) || 0;
        return sum + (price * qty);
    }, 0);

    // 3. Hàm xử lý ảnh an toàn chống ERR_CONNECTION_CLOSED
    const getProductImage = (imageUrl) => {
        if (!imageUrl || typeof imageUrl !== "string" || imageUrl.includes("placeholder")) {
            return FALLBACK_IMAGE;
        }
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }

        // 🚀 SỬA TẠI ĐÂY: Nếu chuỗi từ DB đã bắt đầu bằng dấu / hoặc chứa "uploads"
        if (imageUrl.startsWith("/") || imageUrl.includes("uploads")) {
            // Đảm bảo không bị trùng lặp dấu gạch chéo
            const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
            return `${httpAxios.defaults.baseURL || ""}${cleanPath}`;
        }

        return `${httpAxios.defaults.baseURL || ""}/public/products/image/${imageUrl}`;
    };

    // 4. Hàm xử lý khi bấm nút Xác nhận đặt hàng
    const handlePlaceOrder = async (e) => {
        e.preventDefault(); 

        try {
            // Kiểm tra bảo vệ logic bằng JavaScript trước khi gọi API
            if (!fullName.trim()) {
                alert("⚠️ Vui lòng nhập Tên người nhận hàng!");
                return;
            }
            if (!phone.trim()) {
                alert("⚠️ Vui lòng nhập Số điện thoại liên hệ!");
                return;
            }
            
            // 🚀 SỬA LỖI: Regex kiểm tra số điện thoại Việt Nam chuẩn (loại bỏ dấu | sai ngữ pháp trong ngoặc vuông)
            const phoneRegex = /^(0[35789])[0-9]{8}$/;
            if (!phoneRegex.test(phone.trim())) {
                alert("⚠️ Số điện thoại không đúng định dạng (Phải có 10 chữ số, bắt đầu bằng các đầu số 03, 05, 07, 08, 09)!");
                return;
            }
            if (!address.trim()) {
                alert("⚠️ Vui lòng cung cấp Địa chỉ nhận hàng chi tiết!");
                return;
            }
            if (checkoutItems.length === 0) {
                alert("⚠️ Đơn hàng rỗng, không thể tiến hành đặt!");
                return;
            }

            setIsSubmitting(true);

            // Gộp thông tin người nhận mới nhập + thông tin sản phẩm gửi lên backend
            // Gộp thông tin người nhận mới nhập + thông tin sản phẩm gửi lên backend
            const orderPayload = {
                // 🚀 Nếu không có user, để mặc định là 0 (hoặc ID khách vãng lai của bạn) thay vì null
                customerId: user?.userId ? parseInt(user.userId, 10) : 0,
                customerEmail: user?.email || "phucmai1401@gmail.com",
                shippingName: fullName.trim(),
                shippingPhone: phone.trim(),
                shippingAddress: address.trim(),
                notes: notes.trim(),
                orderDetails: checkoutItems.map((item) => ({
                    productId: parseInt(item?.product?.id, 10),
                    quantity: parseInt(item?.quantity, 10),
                    unitPrice: parseFloat(item?.product?.price || 0)
                }))
            };

            // Gọi API lưu xuống SQL Server thông qua C# Web API
            const res = await httpAxios.post("/api/OrderApi/create", orderPayload);

            alert(res.data?.message || "🎉 Chúc mừng! Đơn hàng của bạn đã được hệ thống ghi nhận thành công.");

            // Dọn dẹp LocalStorage sau khi mua hoàn tất
            if (cartContext && typeof cartContext.clearCart === "function") {
                cartContext.clearCart();
            } else {
                localStorage.removeItem("local_cart_items");
            }
            localStorage.removeItem("checkoutItems");
            localStorage.removeItem("shippingInfo"); // Dọn sạch thông tin ship sau khi hoàn tất

            // Chuyển hướng an toàn về trang chủ
            setTimeout(() => {
                navigate("/");
            }, 100);

        } catch (error) {
            setIsSubmitting(false);
            console.error("🔥 Lỗi tại hàm đặt hàng:", error);
            alert(`❌ Không thể đặt hàng. Chi tiết lỗi: ${error.response?.data?.message || error.message || "Lỗi kết nối server Backend"}`);
        }
    };

    if (isLoading) {
        return <div className="container py-5 text-center fw-bold text-muted">⏳ Hệ thống đang đối chiếu hóa đơn...</div>;
    }

    if (checkoutItems.length === 0) {
        return (
            <div className="container py-5 text-center">
                <div className="card p-5 shadow-sm border-0 mx-auto" style={{ maxWidth: "500px" }}>
                    <h3 className="text-muted mb-3">Chưa chọn sản phẩm nào để thanh toán</h3>
                    <Link to="/cart" className="btn btn-success px-4">Quay lại giỏ hàng</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h2 className="mb-5 fw-bold text-success text-center">💳 THÔNG TIN THANH TOÁN</h2>

            <form onSubmit={handlePlaceOrder} className="needs-validation" noValidate>
                <div className="row g-4">

                    {/* BÊN TRÁI: KHU VỰC THÔNG TIN GIAO HÀNG */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm p-4 border-0" style={{ borderRadius: "12px" }}>
                            <h4 className="fw-bold mb-4 text-primary border-bottom pb-2">📋 Thông tin nhận hàng</h4>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Tên người nhận hàng <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${!fullName ? "is-invalid" : "is-valid"}`}
                                    placeholder="Nhập đầy đủ họ và tên..."
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">Vui lòng điền họ tên người nhận hàng.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Số điện thoại <span className="text-danger">*</span></label>
                                <input
                                    type="tel"
                                    className={`form-control ${!phone ? "is-invalid" : "is-valid"}`}
                                    placeholder="Ví dụ: 0924198545..."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">Vui lòng cung cấp số điện thoại chính xác.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Địa chỉ giao hàng <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${!address ? "is-invalid" : "is-valid"}`}
                                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <div className="invalid-feedback">Vui lòng nhập địa chỉ cụ thể.</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Giao giờ hành chính, gọi trước khi giao, v.v..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* BÊN PHẢI: CHI TIẾT SẢN PHẨM & NÚT ĐẶT HÀNG */}
                    <div className="col-lg-6">
                        <div className="card shadow-sm p-4 border-0" style={{ borderRadius: "12px", background: "#f8fafc" }}>
                            <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">🛒 Tóm tắt đơn hàng</h4>

                            <div className="table-responsive mb-3" style={{ maxHeight: "280px" }}>
                                <table className="table align-middle table-borderless">
                                    <thead>
                                        <tr className="text-muted small uppercase">
                                            <th>Sản phẩm</th>
                                            <th className="text-center">Số lượng</th>
                                            <th className="text-end">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkoutItems.map((item, idx) => (
                                            <tr key={item.cartItemId || idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center gap-3">
                                                        <img
                                                            src={getProductImage(item?.product?.imageUrl)}
                                                            alt="product"
                                                            width="52" height="52"
                                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = FALLBACK_IMAGE;
                                                            }}
                                                        />
                                                        <div>
                                                            <span className="fw-bold text-dark d-block text-truncate" style={{ maxWidth: "160px" }}>
                                                                {item?.product?.name || "Sản phẩm"}
                                                            </span>
                                                            <small className="text-muted">
                                                                {Number(item?.product?.price || 0).toLocaleString()}₫
                                                            </small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center fw-medium">x{item?.quantity}</td>
                                                <td className="text-end fw-bold text-dark">
                                                    {(Number(item?.product?.price || 0) * Number(item?.quantity || 0)).toLocaleString()}₫
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="p-3 bg-white rounded-3 shadow-xs mt-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Tạm tính:</span>
                                    <span className="fw-semibold">{totalAmount.toLocaleString()}₫</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Phí vận chuyển:</span>
                                    <span className="text-success fw-medium">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold text-dark fs-5">Thành tiền:</span>
                                    <span className="text-danger fw-extrabold fs-3">{totalAmount.toLocaleString()}₫</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100 btn-lg fw-bold mt-4 py-3 shadow-sm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "⏳ ĐANG XỬ LÝ ĐƠN HÀNG..." : "🚀 HOÀN TẤT ĐẶT HÀNG"}
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default Checkout;