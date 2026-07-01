import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../../services/postService";

const FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' font-family='sans-serif' font-size='6' fill='%2394a3b8' dominant-baseline='middle' text-anchor='middle'>No Image Available</text></svg>";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await postService.getPostById(id);
                setPost(data);
            } catch (err) {
                console.error("Lỗi khi tải chi tiết bài viết:", err);
            }
        };

        fetchPost();
    }, [id]);

    if (!post) return <p>Đang tải...</p>;

    return (
        <div className="container py-5">
            <h1>{post.title}</h1>

            <img
                src={`http://localhost:5114${post.imageUrl}`}
                alt={post.title}
                className="img-fluid mb-4"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = FALLBACK_IMAGE;
                }}
            />

            <div
                dangerouslySetInnerHTML={{
                    __html: post.content,
                }}
            />
        </div>
    );
};

export default PostDetail;