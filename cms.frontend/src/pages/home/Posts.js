import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import postService from "../../services/postService";

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='6' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image</text></svg>";

const HomePosts = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const postsPerPage = 6;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await postService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPosts();
    }, []);

    // Phân trang
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = posts.slice(
        indexOfFirstPost,
        indexOfLastPost
    );

    const totalPages = Math.ceil(
        posts.length / postsPerPage
    );

    // Khi đổi trang cuộn lên đầu section bài viết
    const handlePageChange = (page) => {
        setCurrentPage(page);

        window.scrollTo({
            top: 1200,
            behavior: "smooth",
        });
    };

    return (
        <section className="container py-5">
            <h2 className="text-center mb-4">
                📰 Tin tức mới nhất
            </h2>

            <div className="row">
                {currentPosts.map((post) => {
                    const imgUrl = post.imageUrl ? `http://localhost:5114${post.imageUrl}` : FALLBACK_IMAGE;
                    return (
                        <div className="col-lg-4 col-md-6 mb-4" key={post.id}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={imgUrl}
                                    alt={post.title}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover" }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = FALLBACK_IMAGE;
                                    }}
                                />

                                <div className="card-body d-flex flex-column">
                                    <h5 className="fw-bold">
                                        {post.title}
                                    </h5>

                                    <p className="text-muted small">
                                        {post.createdDate
                                            ? new Date(post.createdDate).toLocaleDateString()
                                            : "Không rõ ngày"}
                                    </p>

                                    <p className="flex-grow-1">
                                        {post.content && post.content.length > 150
                                            ? post.content.substring(0, 150) + "..."
                                            : post.content || "Chưa có nội dung tóm tắt..."}
                                    </p>

                                    <Link
                                        to={`/post/${post.id}`}
                                        className="btn btn-warning mt-auto"
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                    <button
                        className="btn btn-outline-warning"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        ←
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn ${currentPage === index + 1 ? "btn-warning" : "btn-outline-warning"}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-outline-warning"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        →
                    </button>
                </div>
            )}
        </section>
    );
};

export default HomePosts;