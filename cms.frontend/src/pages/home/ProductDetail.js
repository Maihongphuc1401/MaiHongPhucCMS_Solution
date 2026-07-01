import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import cartService from "../../services/cartService";
import { useAuth } from "../../contexts/AuthContext";
import "./ProductDetail.css";
import { FaShoppingCart } from "react-icons/fa";

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='8' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";

const ProductDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await productService.getProductById(id);
                setProduct(res);

                const imageSrc = res.imageUrl
                    ? `http://localhost:5114${res.imageUrl}`
                    : FALLBACK_IMAGE;

                setMainImage(imageSrc);

                const allProducts = await productService.getAllProducts();
                const sameCategory = allProducts.filter(
                    (p) => p.categoryName === res.categoryName && p.id !== res.id
                );

                setRelatedProducts(sameCategory);
            } catch (err) {
                console.error("Lỗi tải sản phẩm:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        try {
            if (!user?.userId) {
                alert("Vui lòng đăng nhập!");
                return;
            }

            let cart;
            try {
                cart = await cartService.getCartByUser(user.userId);
            } catch {
                cart = await cartService.createCartForUser(user.userId);
            }

            const cartId = cart.cartId || cart.id;
            if (!cartId) {
                alert("Không tìm thấy giỏ hàng");
                return;
            }

            await cartService.addProductToCart(cartId, product.id, 1);
            alert(`Đã thêm "${product.name}" vào giỏ hàng`);
        } catch (err) {
            console.error(err);
            alert("Không thể thêm vào giỏ hàng");
        }
    };

    if (loading) return <p className="loading-text">Đang tải...</p>;
    if (!product) return <p className="error-text">Không tìm thấy sản phẩm</p>;

    return (
        <div className="container py-5">
            <div className="product-detail">
                <div className="product-image-section">
                    <div className="main-image-box">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="main-product-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGE;
                            }}
                        />
                    </div>
                </div>

                <div className="product-info-section">
                    <h2 className="product-title">{product.name}</h2>
                    <p className="category-text">{product.categoryName}</p>
                    <div className="price-wrapper">
                        <span className="new-price">{product.price?.toLocaleString()}₫</span>
                    </div>
                    <p className="product-desc">{product.description}</p>
                    <p className="stock-text">Tồn kho: {product.stockQuantity}</p>

                    <button className="add-to-cart-btn" onClick={handleAddToCart}>
                        <FaShoppingCart /> Thêm vào giỏ
                    </button>
                </div>
            </div>

            {relatedProducts.length > 0 && (
                <div className="related-section mt-5">
                    <h4 className="related-title">Sản phẩm cùng danh mục</h4>
                    <div className="related-row">
                        {relatedProducts.map((p) => {
                            const relImg = p.imageUrl ? `http://localhost:5114${p.imageUrl}` : FALLBACK_IMAGE;
                            return (
                                <div key={p.id} className="related-item">
                                    <div className="related-img-box">
                                        <img
                                            src={relImg}
                                            alt={p.name}
                                            className="related-img"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = FALLBACK_IMAGE;
                                            }}
                                        />
                                    </div>
                                    <div className="related-info">
                                        <p className="related-category">{p.categoryName}</p>
                                        <h6 className="related-name">{p.name}</h6>
                                        <p className="related-price">{p.price?.toLocaleString()}₫</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;