import { useState } from "react";
import SelectBox from "../../component/button/Button.jsx";
import CardProduct from "../../component/cardProduct/card.jsx";
import CustomPagination from "../../component/pagination/CustomPagination.jsx";
import banner from "../../assets/productbanner.png";
import { Button } from "antd";

const categories = [
    { name: "Da thường", image: "/src/assets/da-thuong.jpg" },
    { name: "Da khô", image: "/src/assets/da-kho.jpg" },
    { name: "Da dầu", image: "/src/assets/da-dau.jpg" },
    { name: "Da hỗn hợp", image: "/src/assets/da-hon-hop.jpg" },
    { name: "Da nhạy cảm", image: "/src/assets/da-nhay-cam.jpg" },
];

// Danh sách sản phẩm mẫu
const products = Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    img: "https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg",
    name: `Sản phẩm ${index + 1}`,
    desc: "Mô tả ngắn về sản phẩm",
    price: (Math.random() * 50 + 10).toFixed(2),
}));

export default function ProductPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12; // Số sản phẩm mỗi trang

    // Cắt danh sách sản phẩm theo trang hiện tại
    const displayedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="product-page" style={{ margin: "0", maxWidth: "1440px" }}>
            {/* Banner */}
            <div className="banner" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", padding: "0", margin: "0" }}>
                {/* Ảnh banner */}
                <img
                    src={banner}
                    alt="Banner"
                    className="banner-image"
                    style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />

                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                        color: "white",
                        fontSize: "30px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                    }}
                >
                    Sản phẩm
                </div>
            </div>



            {/* Categories and Filters */}
            <div
                className="categories-filters"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0 20px",
                    maxWidth: "1200px",
                    margin: "20px auto",
                }}
            >
                {/* Categories */}
                <div className="categories" style={{ display: "flex", gap: "20px" }}>
                    {categories.map((cat, index) => (
                        <div key={index} className="category-item" style={{ textAlign: "center" }}>
                            <img src={cat.image} alt={cat.name} className="category-icon" style={{ width: "100px", height: "120px" }} />
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="filters" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
    <select
        style={{
            width: "200px", // Điều chỉnh chiều rộng cho vừa
            height: "35px", // Điều chỉnh chiều cao cho vừa
            padding: "10px 15px",
            backgroundColor: "#F6F6F6", // Màu nền sáng hơn
            border: "1px solid #E0E0E0", // Đường viền mỏng và nhẹ
            borderRadius: "30px", // Tạo viền bo tròn để mềm mại hơn
            fontSize: "10px",
            fontWeight: "400",
            color: "#666", // Màu chữ xám tối
            appearance: "none", // Tắt mặc định của dropdown trên trình duyệt
            outline: "none", // Loại bỏ outline khi chọn
            boxShadow: "none", // Không có bóng đổ
        }}
    >
       <option value="featured">Nổi bật</option>
<option value="best-selling">Bán chạy nhất</option>
<option value="price-high-to-low">Giá (Từ cao đến thấp)</option>
<option value="price-low-to-high">Giá (Từ thấp đến cao)</option>

    </select>
    <Button
        style={{
            backgroundColor: "#D8959A", // Màu hồng giống trong ảnh
            height: "35px",
            width: "50px",
            color: "white",
            padding: "12px 24px",
            borderRadius: "35px", // Viền bo tròn như dropdown
            fontSize: "10px",
            fontWeight: "500",
            textTransform: "uppercase",
            border: "none", // Không có đường viền
            cursor: "pointer", // Hiệu ứng con trỏ khi hover
        }}
    >
        Lọc
    </Button>
</div>

            </div>


            {/* Products Grid */}
            <div
                className="product-grid"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)", // 4 cột
                    gap: "20px",
                    marginTop: "30px",
                    maxWidth: "calc(100% - 40px)", // Giới hạn chiều rộng, trừ đi padding 2 bên
                    width: "100%", // Đảm bảo không bị co hẹp
                    padding: "0 20px", // Padding hai bên
                    justifyContent: "center", // Đảm bảo grid nằm giữa
                    alignItems: "center", // Căn giữa theo chiều dọc (nếu cần)
                    marginLeft: "auto",
                    marginRight: "auto", // Giúp căn giữa chính xác
                }}
            >
                {displayedProducts.map((product) => (
                    <CardProduct key={product.id} product={product} />
                ))}
            </div>


            <div style={{ marginBottom: "5%" }}>
                <CustomPagination
                    style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}
                    currentPage={page}
                    totalItems={products.length}
                    pageSize={pageSize}
                    onPageChange={setPage}
                />
            </div>

        </div>
    );
}
