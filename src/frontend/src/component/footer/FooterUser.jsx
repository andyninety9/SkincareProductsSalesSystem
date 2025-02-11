import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import '../../App.css';

const Footer = () => {
  return (
    <footer className="py-4 px-5 mt-auto" style={{ backgroundColor: "#F6EEF0", borderTop: "0.5px solid #5A2D2F" }}>
      <div className="container d-flex justify-content-between">
        <div style={{ maxWidth: "300px" }}>
          <h2 className="fw-bold fs-4 marko-font">Mavid</h2>
          <p className="small">
            Đặt mua ngay các sản phẩm mỹ phẩm phù hợp với làn da của bạn, cam kết 100% chính hãng.
          </p>
          <p className="small">© 2025 coty operations</p>
        </div>

        <div>
          <h3 className="fw-bold fs-5">Chăm Sóc Khách Hàng</h3>
          <ul className="list-unstyled small mt-2">
            <li><a href="#" className="text-dark text-decoration-none">Liên hệ chúng tôi</a></li>
            <li><a href="#" className="text-dark text-decoration-none">Hỏi đáp</a></li>
            <li><a href="#" className="text-dark text-decoration-none">Chính sách đổi trả</a></li>
            <li><a href="#" className="text-dark text-decoration-none">Chính sách bán hàng</a></li>
            <li><a href="#" className="text-dark text-decoration-none">Chính sách bảo mật</a></li>
          </ul>
        </div>

        <div>
          <h3 className="fw-bold fs-5">Mạng Xã Hội</h3>
          <div className="d-flex gap-4 mt-4">
            <Facebook style={{ color: "#D8959A", cursor: "pointer" }} />
            <Instagram style={{ color: "#D8959A", cursor: "pointer" }} />
            <Twitter style={{ color: "#D8959A", cursor: "pointer" }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
