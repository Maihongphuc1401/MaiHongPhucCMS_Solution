import httpAxios from "./httpAxios";

const getAllProducts = async () => {
    const res = await httpAxios.get("/api/public/products");
    return res.data;
};

const getProductById = async (id) => {
    const res = await httpAxios.get(`/api/public/products/${id}`);
    return res.data;
};

const productService = {
    getAllProducts,
    getProductById,
};

export default productService;