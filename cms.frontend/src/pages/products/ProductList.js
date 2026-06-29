import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import productService from "../../services/productService";
import { FaShoppingCart, FaEye, FaSearch } from "react-icons/fa";
import "./ProductList.css";
import "../home/Recommended.css"; // Sử dụng CSS nâng cao từ trang Recommended

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const sectionRef = useRef(null);
    const { addToCart } = useCart();

    // 1. Tải toàn bộ sản phẩm từ API
    const loadProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm:", error);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    // 2. Tự động trích xuất danh mục duy nhất từ danh sách sản phẩm
    useEffect(() => {
        if (products.length > 0) {
            const uniqueCategories = Array.from(
                new Set(products.map((p) => p.categoryName))
            ).filter(Boolean);

            setCategories(
                uniqueCategories.map((name, index) => ({
                    categoryId: index + 1,
                    categoryName: name,
                }))
            );
        }
    }, [products]);

    // 3. Tự động cuộn lên đầu danh sách khi chuyển trang
    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [currentPage]);

    // 4. Logic tìm kiếm + lọc theo danh mục
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

    // 5. Logic tính toán phân trang
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <section ref={sectionRef} className="recommended container py-5">
            {/* Tiêu đề trang */}
            <div className="text-center mb-5">
                <h2 className="fw-bold text-dark mb-2">Tất cả sản phẩm</h2>
                <p className="text-secondary">Khám phá bộ sưu tập sản phẩm phong phú của chúng tôi</p>
            </div>

            {/* Thanh tìm kiếm và bộ lọc danh mục (Đồng bộ CSS từ Recommended) */}
            <div className="search-filter-wrapper mb-4 d-flex justify-content-center align-items-center gap-3 flex-wrap">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset về trang 1 khi gõ tìm kiếm
                        }}
                    />
                </div>

                <select
                    className="category-select"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
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

            {/* Lưới hiển thị danh sách sản phẩm */}
            <div className="grid-products">
                {currentProducts.length === 0 ? (
                    <div className="w-100 text-center py-5">
                        <p className="text-muted fs-5">Không tìm thấy sản phẩm nào phù hợp</p>
                    </div>
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
                                        />
                                    </div>

                                    {/* Nút thao tác nhanh khi Hover */}
                                    <div className="overlay">
                                        <Link to={`/product/${p.id}`} className="view-btn">
                                            <FaEye /> Xem
                                        </Link>
                                        <button className="cart-btn" onClick={() => addToCart(p)}>
                                            <FaShoppingCart /> Giỏ
                                        </button>
                                    </div>
                                </div>

                                {/* Thông tin sản phẩm */}
                                <div className="info-box text-center">
                                    <h5 className="product-name">{p.name}</h5>
                                    <p className="category-name">{p.categoryName || "Chưa phân loại"}</p>

                                    <div className="price-box">
                                        <span className="new-price text-success fw-bold">
                                            {p.price ? p.price.toLocaleString() : 0}₫
                                        </span>
                                    </div>

                                    <div className="mt-2 text-muted small">
                                        Tồn kho: {p.stockQuantity ?? 0}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Thanh điều hướng phân trang số thông minh */}
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
                        let startPage = Math.max(
                            1,
                            currentPage - Math.floor(visiblePages / 2)
                        );
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
                                        <span className="page-dots">...</span>
                                        <button
                                            className="page-btn"
                                            onClick={() => setCurrentPage(totalPages)}
                                        >
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

export default ProductList;