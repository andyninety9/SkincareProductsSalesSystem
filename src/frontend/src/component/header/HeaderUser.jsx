import { useState } from "react";
import { Search, Heart, ShoppingBag } from "lucide-react";

export default function HeaderUser() {
  return (
    <header style={{ width: "100%", borderBottom: "1px solid #ddd", backgroundColor: "white", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        {/* Logo */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", padding: "16px" }}>
          <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "600", textAlign: "center" }}>Mavid</h1>
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: "16px" }}>
            <a href="#" style={{ marginLeft: "16px", fontSize: "18px", textDecoration: "none", color: "black", transition: "color 0.3s" }}>Đăng nhập</a>
            <a href="#" style={{ color: "black", transition: "color 0.3s" }}><Search size={20} /></a>
            <a href="#" style={{ color: "black", transition: "color 0.3s" }}><Heart size={20} /></a>
            <a href="#" style={{ color: "black", transition: "color 0.3s" }}><ShoppingBag size={20} /></a>
          </div>
        </div>
        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          {/* Navigation */}
          <nav style={{ display: "flex", gap: "32px", fontSize: "18px" }}>
            <a href="#" style={{ textDecoration: "none", color: "black", transition: "color 0.3s" }}>Trang chủ</a>
            <a href="#" style={{ textDecoration: "none", color: "black", position: "relative", transition: "color 0.3s" }}>
              Sản phẩm <span style={{ position: "absolute", top: "-5px", right: "-10px", fontSize: "12px" }}>✨</span>
            </a>
            <a href="#" style={{ textDecoration: "none", color: "black", transition: "color 0.3s" }}>Khuyến mãi</a>
            <a href="#" style={{ textDecoration: "none", color: "black", transition: "color 0.3s" }}>Về chúng tôi</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
