import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { Dropdown } from "react-bootstrap";
import productService from "../services/productService"; // ✅ import service thật
import "./Header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Header = () => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ State cho tìm kiếm
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  // ✅ Fetch sản phẩm theo từ khóa (gọi API thật)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === "") {
        setResults([]);
        return;
      }
      try {
        const data = await productService.searchProducts(query); // 🔍 gọi API
        setResults(data.content || []);
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 400); // ⏳ debounce 400ms tránh gọi API liên tục

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // ✅ Khi nhấn Enter hoặc icon tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`);
    }
  };

  // ✅ Khi chọn kết quả trong dropdown
  const handleSelect = (slug) => {
    setQuery("");
    setResults([]);
    navigate(`/product/${slug}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header shadow-sm bg-white sticky-top">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 header-top">
          {/* Logo */}
          <Link
            to="/"
            className="d-flex align-items-center text-decoration-none me-3 header-logo"
          >
            <img
              src={require("../assets/images/logo.png")}
              alt="Logo"
              height="40"
              className="me-2"
            />
            <span className="fw-bold fs-5 text-primary">E-Shop</span>
          </Link>

          {/* Thanh tìm kiếm */}
          <form
            className="header-search position-relative flex-grow-1 mx-3"
            onSubmit={handleSubmit}
          >
            <div className="input-group shadow-sm rounded-pill overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="form-control border-0 ps-3"
                placeholder="Tìm kiếm sản phẩm..."
              />
              <button className="btn btn-warning px-3" type="submit">
                <i className="fa fa-search"></i>
              </button>
            </div>

            {/* Dropdown kết quả tìm kiếm */}
            {results.length > 0 && (
              <ul className="search-results list-group position-absolute w-100 shadow-sm mt-1">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelect(item.slug)}
                    style={{ cursor: "pointer" }}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </form>

          {/* Giỏ hàng + User */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/cart"
              className="btn btn-outline-primary position-relative cart-btn"
            >
              <i className="fa fa-shopping-cart"></i>
              {cart.length > 0 && (
                <span className="badge bg-danger position-absolute cart-badge">
                  {cart.length}
                </span>
              )}
            </Link>

            {!user ? (
              <div className="d-flex">
                <Link to="/login" className="btn btn-outline-secondary me-2">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Đăng ký
                </Link>
              </div>
            ) : (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  className="d-flex align-items-center border rounded-pill px-2 py-1 user-dropdown"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                    }
                    alt="avatar"
                    className="rounded-circle me-2"
                    style={{
                      width: "36px",
                      height: "36px",
                      objectFit: "cover",
                    }}
                  />
                  <span className="text-dark small fw-semibold">
                    {user.email || "Người dùng"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">
                    <i className="fa fa-user me-2 text-primary"></i> Thông tin cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">
                    <i className="fa fa-box me-2 text-success"></i> Đơn hàng của tôi
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <i className="fa fa-sign-out-alt me-2"></i> Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </div>

        {/* Thanh menu */}
        <nav className="navbar navbar-expand mt-3 pt-2 border-top header-menu">
          <ul className="navbar-nav mx-auto text-uppercase fw-semibold">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Thời trang
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Điện tử
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Khuyến mãi
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
