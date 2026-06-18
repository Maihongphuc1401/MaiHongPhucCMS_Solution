import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../../services/postService";

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const data =
                await postService.getPostById(id);

            setPost(data);
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