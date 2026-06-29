import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import ProductDetail from "../pages/home/ProductDetail"; // ✅ đúng đường dẫn
import Recommended from "../pages/home/Recommended"; // ✅ đúng đường dẫn
import CartPage from "../pages/cart/CartPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ProfilePage from "../pages/user/ProfilePage"; // Sửa đường dẫn import
import PostDetail from "../pages/home/PostDetail"
//import ProductList from "../pages/products/ProductList";
import ProductList from "../pages/products/ProductList";
import PostList from "../pages/home/PostList";
import About from "../pages/about/About";
const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/" element={<Recommended />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/post/:id" element={<PostDetail />} />
                
            <Route path="/products" element={<ProductList />} />

            <Route path="/posts" element={<PostList />} />

            <Route path="/about" element={<About />} />
           
        </Routes>
  </main>
);
export default Main;