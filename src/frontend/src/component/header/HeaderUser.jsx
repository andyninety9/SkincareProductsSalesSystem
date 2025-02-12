import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaSearch, FaShoppingBag } from "react-icons/fa";
import { routes } from "../../routes";
import dropdownImage from "../../assets/dropdown.webp";
import "./HeaderUser.css";
import "@fontsource/marko-one";

const HeaderUser = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  let closeTimeout = null;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="border-bottom">

      <div className="text-center text-white py-2 small" style={{ backgroundColor: "#D8959A" }}>
        Giao hàng toàn quốc với chỉ 30000đ
      </div>

      {/* Header Content */}
      <div className="container d-flex justify-content-between align-items-center py-3">
        <div className="d-flex" style={{ flex: 1 }}></div>

        {/* Logo (Navigates to Home) */}
        <h1 className="fw-bold m-0 text-center" style={{ fontFamily: "Marko One", fontSize: "2rem" }}>
          <Link to={routes.home} className="text-dark text-decoration-none">
            Mavid
          </Link>
        </h1>


        {/* Icons */}
        <div className="d-flex gap-3 align-items-center justify-content-end" style={{ flex: 1 }}>
          <Link to={routes.login} className="text-dark text-decoration-none">Đăng nhập</Link>
          <FaHeart className="fs-5 text-secondary cursor-pointer" />
          <FaSearch className="fs-5 text-secondary cursor-pointer" />
          <FaShoppingBag className="fs-5 text-secondary cursor-pointer" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="container d-flex justify-content-center align-items-center gap-4 pb-3 flex-nowrap">
        <Link to={routes.home} className="text-dark text-decoration-none" style={{ whiteSpace: "nowrap" }}>
          Trang chủ
        </Link>
        <div
          className="position-relative"
          ref={dropdownRef}
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <span className="text-dark text-decoration-none cursor-pointer black-sparkle" style={{ whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", transform: "translateY(6px)" }}>✨</span>
            Sản phẩm
            <span style={{ display: "inline-block", transform: "translateY(-6px)" }}>✨</span>
          </span>
          {isDropdownOpen && (
            <div
              className="position-absolute p-4 rounded"
              style={{
                position: "absolute",
                top: "100%",
                left: "110%",
                transform: "translateX(-50%)",
                width: "100vw",
                height: "fit-content",
                maxWidth: "1440px",
                background: "#fffbfc",
                padding: "20px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
                overflowX: "hidden",
                overflowY: "hidden",
              }}
            >

              <div className="row">
                {/* Product Categories */}
                <div className="col-xl-8 ">
                  <div className="row ps-5 " >
                    <div className="col-md-4" style={{ paddingLeft: "9rem", fontSize: "17px" }}>
                      <h6 className="fw-bold mt-2 ">Chăm Sóc Da</h6>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Tất cả</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Chống nắng</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Tẩy trang</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Sữa rửa mặt</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Tẩy da chết mặt</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Mặt nạ</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Nước cân bằng</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Tinh chất</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Kem dưỡng</Link>
                      <Link to="/products/skincare" className="text-dark text-decoration-none d-block">Xịt khoáng</Link>
                    </div>
                    <div className="col-md-4 mt-2" style={{ paddingLeft: "7rem", fontSize: "17px" }}>
                      <h6 className="fw-bold">Tắm & Dưỡng Thể</h6>
                      <Link to="/products/bodycare" className="text-dark text-decoration-none d-block">Tất cả</Link>
                      <Link to="/products/bodycare" className="text-dark text-decoration-none d-block">Tẩy da chết cơ thể</Link>
                      <Link to="/products/bodycare" className="text-dark text-decoration-none d-block">Sữa tắm</Link>
                      <Link to="/products/bodycare" className="text-dark text-decoration-none d-block">Xịt cơ thể</Link>
                      <Link to="/products/bodycare" className="text-dark text-decoration-none d-block">Dưỡng thể</Link>
                    </div>
                    <div className="col-md-4 mt-2" style={{ paddingLeft: "4rem", fontSize: "17px" }}>
                      <h6 className="fw-bold">Chăm Sóc Tóc</h6>
                      <Link to="/products/haircare" className="text-dark text-decoration-none d-block">Tất cả</Link>
                      <Link to="/products/haircare" className="text-dark text-decoration-none d-block">Dầu gội</Link>
                      <Link to="/products/haircare" className="text-dark text-decoration-none d-block">Kem ủ</Link>
                      <Link to="/products/haircare" className="text-dark text-decoration-none d-block">Dầu xả</Link>
                      <Link to="/products/haircare" className="text-dark text-decoration-none d-block">Tinh chất dưỡng tóc</Link>
                    </div>
                  </div>
                </div>
                {/* Image */}
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                  <img src={dropdownImage} alt="Dropdown" className="img-fluid rounded" style={{ maxWidth: "250px" }} />
                </div>
              </div>
            </div>
          )}
        </div>
        <Link to="/promotions" className="text-dark text-decoration-none" style={{ whiteSpace: "nowrap" }}>
          Khuyến mãi
        </Link>
        <Link to={routes.about} className="text-dark text-decoration-none" style={{ whiteSpace: "nowrap" }}>
          Về chúng tôi
        </Link>
      </nav>

    </header>
  );
};

export default HeaderUser;
