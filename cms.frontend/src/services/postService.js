import httpAxios from "./httpAxios";

const getAllPosts = async () => {
    const res = await httpAxios.get("/api/PostApi");
    return res.data;
};

const getPostById = async (id) => {
    const res = await httpAxios.get(`/api/PostApi/${id}`);
    return res.data;
};

const getLatestPosts = async (count = 3) => {
    const res = await httpAxios.get(
        `/api/PostApi/latest/${count}`
    );
    return res.data;
};

const postService = {
    getAllPosts,
    getPostById,
    getLatestPosts,
};

export default postService;