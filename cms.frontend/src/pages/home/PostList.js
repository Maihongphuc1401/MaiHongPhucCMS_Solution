import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import postService from "../../services/postService";
import { FaSearch, FaEye } from "react-icons/fa";
import "../home/Recommended.css"; // Tái sử dụng CSS giao diện bộ lọc & phân trang đẹp

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6; // Đặt 6 bài viết trên 1 trang cho cân đối (lưới 3 cột)
    const sectionRef = useRef(null);

    // 1. Tải toàn bộ bài viết từ API
    const loadPosts = async () => {
        try {
            const data = await postService.getAllPosts();
            setPosts(data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách bài viết:", err);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    // 2. Tự động trích xuất danh mục tin tức (nếu bài viết có trường categoryName hoặc tương đương)
    useEffect(() => {
        if (posts.length > 0) {
            const uniqueCategories = Array.from(
                new Set(posts.map((p) => p.categoryName).filter(Boolean))
            );
            setCategories(uniqueCategories);
        }
    }, [posts]);

    // 3. Tự động cuộn lên đầu danh sách bài viết khi chuyển trang
    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [currentPage]);

    // 4. Logic Tìm kiếm theo tiêu đề + Lọc theo danh mục bài viết
    const filteredPosts = posts.filter((post) => {
        const matchesSearch = post.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            post.categoryName === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // 5. Tính toán phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    return (
        <section ref={sectionRef} className="recommended container py-5">
            {/* Tiêu đề */}
            <div className="text-center mb-5">
                <h2 className="fw-bold text-dark mb-2">📰 Tin Tức Mới Nhất</h2>
                <p className="text-secondary">Cập nhật xu hướng, mẹo vặt và tin tức công nghệ mới nhất</p>
            </div>

            {/* Thanh Tìm kiếm + Bộ lọc Tin tức */}
            <div className="search-filter-wrapper mb-5 d-flex justify-content-center align-items-center gap-3 flex-wrap">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Tìm bài viết..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset về trang 1 khi gõ tìm kiếm
                        }}
                    />
                </div>

                {/* Chỉ hiển thị Dropdown lọc danh mục nếu dữ liệu bài viết thực sự có danh mục */}
                {categories.length > 0 && (
                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
                        }}
                    >
                        <option value="All">Tất cả chuyên mục</option>
                        {categories.map((cat, idx) => (
                            <option key={idx} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Danh sách bài viết bài viết */}
            <div className="row">
                {currentPosts.length === 0 ? (
                    <div className="col-100 text-center py-5">
                        <p className="text-muted fs-5">Không tìm thấy bài viết nào phù hợp</p>
                    </div>
                ) : (
                    currentPosts.map((post) => {
                        // Kiểm tra đường dẫn ảnh tuyệt đối hay tương đối
                        const imageSrc = post.imageUrl?.startsWith("http")
                            ? post.imageUrl
                            : `http://localhost:5114${post.imageUrl}`;

                        return (
                            <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                                <div className="card h-100 shadow-sm border-0 product-card" style={{ borderRadius: "15px", overflow: "hidden" }}>

                                    {/* Khung ảnh bài viết */}
                                    <div style={{ position: "relative", overflow: "hidden", height: "220px" }}>
                                        <img
                                            src={imageSrc}
                                            className="card-img-top w-100 h-100"
                                            alt={post.title}
                                            style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                                            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                        />
                                        {post.categoryName && (
                                            <span className="badge bg-orange position-absolute top-0 start-0 m-3 shadow-sm" style={{ background: "#ff7b42", color: "#fff", padding: "6px 12px", borderRadius: "20px", fontSize: "12px" }}>
                                                {post.categoryName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nội dung tóm tắt */}
                                    <div className="card-body d-flex flex-column justify-content-between p-4">
                                        <div>
                                            <h5 className="card-title fw-bold text-dark text-truncate-2 mb-3" style={{ lineHeight: "1.4", height: "48px", overflow: "hidden" }}>
                                                {post.title}
                                            </h5>
                                            <p className="card-text text-secondary small mb-4">
                                                {post.content && post.content.length > 110
                                                    ? post.content.substring(0, 110) + "..."
                                                    : post.content || "Chưa có nội dung tóm tắt..."}
                                            </p>
                                        </div>

                                        <Link
                                            to={`/post/${post.id}`}
                                            className="btn btn-outline-primary btn-sm align-self-start d-flex align-items-center gap-2 px-3 py-2"
                                            style={{ borderRadius: "8px", borderColor: "#ff7b42", color: "#ff7b42" }}
                                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff7b42"; e.currentTarget.style.color = "#fff"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ff7b42"; }}
                                        >
                                            <FaEye /> Xem chi tiết
                                        </Link>
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

export default PostList;