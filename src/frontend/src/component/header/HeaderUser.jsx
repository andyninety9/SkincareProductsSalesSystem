import React from "react";
import { FaHeart, FaUser, FaSearch, FaShoppingBag } from "react-icons/fa";

const HeaderUser = () => {
  return (
    <header className="border-bottom">
      <div className="text-center text-white py-2 small" style={{ backgroundColor: "#D8959A" }}>
        Giao hàng toàn quốc với chỉ 30000đ
      </div>

      {/* Main Header */}
      <div className="container d-flex justify-content-between align-items-center py-3">
        {/* Empty div to balance flex alignment */}
        <div></div>

        {/* Logo*/}
        <h1 className="fw-bold m-0" style={{ fontFamily: "'Marko One', serif" }}>
          Mavid
        </h1>

        {/* Icons */}
        <div className="d-flex gap-3">
          <FaHeart className="fs-5 text-secondary cursor-pointer" />
          <FaUser className="fs-5 text-secondary cursor-pointer" />
          <FaSearch className="fs-5 text-secondary cursor-pointer" />
          <FaShoppingBag className="fs-5 text-secondary cursor-pointer" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="container d-flex justify-content-center gap-4 pb-3">
        <a href="#" className="text-dark text-decoration-none">Trang chủ</a>
        <a href="#" className="text-dark text-decoration-none">Sản phẩm ✨</a>
        <a href="#" className="text-dark text-decoration-none">Khuyến mãi</a>
        <a href="#" className="text-dark text-decoration-none">Về chúng tôi</a>
      </nav>
    </header>
  );
};

export default HeaderUser;
