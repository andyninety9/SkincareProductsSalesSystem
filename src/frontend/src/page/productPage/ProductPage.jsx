import { useState, useEffect } from "react";
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

export default function ProductPage() {
    const [page, setPage] = useState(1);
    const pageSize = 12; // Số sản phẩm mỗi trang
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu từ API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `products?limit=${pageSize}&page=${page}`
                );
                const data = await response.json();
                if (data.statusCode === 200) {
                    setProducts(data.data.items || []);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    return (
        <div className="product-page" style={{ margin: "0", maxWidth: "100%" }}>
            {/* Banner */}
            <div className="banner" style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", padding: "0", margin: "0" }}>
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
                            width: "200px",
                            height: "35px",
                            padding: "10px 15px",
                            backgroundColor: "#F6F6F6",
                            border: "1px solid #E0E0E0",
                            borderRadius: "30px",
                            fontSize: "10px",
                            fontWeight: "400",
                            color: "#666",
                            appearance: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                    >
                        <option value="featured">Nổi bật</option>
                        <option value="best-selling">Bán chạy nhất</option>
                        <option value="price-high-to-low">Giá (Từ cao đến thấp)</option>
                        <option value="price-low-to-high">Giá (Từ thấp đến cao)</option>
                    </select>
                    <Button
                        style={{
                            backgroundColor: "#D8959A",
                            height: "35px",
                            width: "50px",
                            color: "white",
                            padding: "12px 24px",
                            borderRadius: "35px",
                            fontSize: "10px",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        Lọc
                    </Button>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div style={{ textAlign: "center", margin: "50px 0" }}>Đang tải...</div>
            ) : (
                <div
                    className="product-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px",
                        marginTop: "30px",
                        maxWidth: "calc(100% - 40px)",
                        width: "100%",
                        padding: "0 20px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                >
                    {products.length > 0 ? (
                        products.map((product) => <CardProduct key={product.productId} product={product} />)
                    ) : (
                        <div style={{ textAlign: "center", width: "100%", gridColumn: "span 4" }}>
                            Không có sản phẩm nào.
                        </div>
                    )}
                </div>
            )}

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
