import React, { useEffect, useState, useRef } from "react";
import "./Recommended.css";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import productService from "../../services/productService";
import { FaShoppingCart, FaEye, FaSearch } from "react-icons/fa";

// Ảnh SVG dự phòng khi lỗi kết nối hoặc thiếu ảnh
const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='8' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";

const Recommended = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const sectionRef = useRef(null);
    const { addToCart } = useCart();

    const fetchProducts = async () => {
        try {
            const res = await productService.getAllProducts();
            setProducts(res);
        } catch (err) {
            console.error("Lỗi tải sản phẩm:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const uniqueCategories = Array.from(
            new Set(products.map((p) => p.categoryName))
        ).filter(Boolean);

        setCategories(
            uniqueCategories.map((name, index) => ({
                categoryId: index + 1,
                categoryName: name,
            }))
        );
    }, [products]);

    const filteredProducts = products.filter((p) => {
        const nameMatch = p.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const categoryMatch = p.categoryName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const inCategory =
            selectedCategory === "All" ||
            p.categoryName === selectedCategory;

        return (nameMatch || categoryMatch) && inCategory;
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [currentPage]);

    return (
        <section ref={sectionRef} className="recommended container py-5">
            <div className="text-center mb-5">
                <h2 className="fw-bold text-dark mb-2">🔥 Sản phẩm nổi bật</h2>
                <p className="text-secondary">Những sản phẩm được yêu thích và bán chạy nhất</p>
            </div>

            <div className="search-filter-wrapper mb-4">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <select
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">Tất cả danh mục</option>
                    {categories.map((c) => (
                        <option key={c.categoryId} value={c.categoryName}>
                            {c.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid-products">
                {currentProducts.length === 0 ? (
                    <p className="text-center text-muted">Không có sản phẩm nào</p>
                ) : (
                    currentProducts.map((p) => {
                        const imageSrc = p.imageUrl?.startsWith("http")
                            ? p.imageUrl
                            : `http://localhost:5114${p.imageUrl}`;

                        return (
                            <div key={p.id} className="product-card">
                                <div className="image-box-admin">
                                    <div className="image-wrapper">
                                        <img
                                            src={imageSrc}
                                            alt={p.name}
                                            className="product-img-admin"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = FALLBACK_IMAGE;
                                            }}
                                        />
                                    </div>

                                    <div className="overlay">
                                        <Link to={`/product/${p.id}`} className="view-btn">
                                            <FaEye /> Xem
                                        </Link>
                                        <button className="cart-btn" onClick={() => addToCart(p)}>
                                            <FaShoppingCart /> Giỏ
                                        </button>
                                    </div>
                                </div>

                                <div className="info-box text-center">
                                    <h5 className="product-name">{p.name}</h5>
                                    <p className="category-name">{p.categoryName}</p>
                                    <div className="price-box">
                                        <span className="new-price text-success fw-bold">
                                            {p.price?.toLocaleString()}₫
                                        </span>
                                    </div>
                                    <div className="mt-2">Tồn kho: {p.stockQuantity}</div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-wrapper mt-5">
                    <button
                        className="page-btn nav-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        ←
                    </button>

                    {(() => {
                        const visiblePages = 4;
                        let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
                        let endPage = startPage + visiblePages - 1;

                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = Math.max(1, endPage - visiblePages + 1);
                        }

                        const pages = [];
                        for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                                <button
                                    key={i}
                                    className={currentPage === i ? "page-btn active" : "page-btn"}
                                    onClick={() => setCurrentPage(i)}
                                >
                                    {i}
                                </button>
                            );
                        }

                        return (
                            <>
                                {pages}
                                {endPage < totalPages && (
                                    <>
                                        <span className="dots">...</span>
                                        <button className="page-btn" onClick={() => setCurrentPage(totalPages)}>
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </>
                        );
                    })()}

                    <button
                        className="page-btn nav-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        →
                    </button>
                </div>
            )}
        </section>
    );
};

export default Recommended;