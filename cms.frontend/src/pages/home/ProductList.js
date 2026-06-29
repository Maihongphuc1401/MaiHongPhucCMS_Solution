import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import productService from "../../services/productService";
import { FaShoppingCart, FaEye } from "react-icons/fa";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data.slice(0, 8)); // ch? l?y 8 s?n ph?m n?i b?t
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="container py-5">

            <div className="text-center mb-4">
                <h2>S?n ph?m n?i b?t</h2>
            </div>

            <div className="row">

                {products.map((p) => {

                    const image =
                        p.imageUrl?.startsWith("http")
                            ? p.imageUrl
                            : `http://localhost:5114${p.imageUrl}`;

                    return (

                        <div
                            className="col-lg-3 col-md-4 col-sm-6 mb-4"
                            key={p.id}
                        >

                            <div className="card h-100 shadow-sm">

                                <img
                                    src={image}
                                    className="card-img-top"
                                    alt={p.name}
                                />

                                <div className="card-body">

                                    <h5>{p.name}</h5>

                                    <p className="text-success fw-bold">
                                        {p.price.toLocaleString()} ?
                                    </p>

                                    <div className="d-flex justify-content-between">

                                        <Link
                                            to={`/product/${p.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            <FaEye /> Xem
                                        </Link>

                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => addToCart(p)}
                                        >
                                            <FaShoppingCart /> Gi?
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

        </section>
    );
};

export default ProductList;