import React, { useState } from "react";
import { Rate, Collapse, Button, Row, Col } from "antd";
import { BorderTopOutlined, HeartOutlined } from "@ant-design/icons";
import "@fontsource/nunito"; 
import "./ProductDetailPage.scss"
const { Panel } = Collapse;

const calculateAverageRating = (reviews) => {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Làm tròn đến 1 chữ số thập phân
};

export default function ProductDetailPage() {

    const [quantity, setQuantity] = useState(1);

    const productImages = [
        "https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg",
        "https://product.hstatic.net/1000301613/product/kem-duong-innisfree_323d8d42e3644ab9bb37b10e2a55c996.jpg",
        "https://image.hsv-tech.io/1987x0/bbx/common/5eb80ef5-c2f4-4ecc-af58-7b081f40b2b0.webp",
    ];


    const reviews = [
        {
            title: "Best cream ever",
            date: "15/01/2025",
            rating: 5,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBmZb7Pxj3VQtYcPZIiSBgD0oJ33YWWiwabg&s",
            content: "The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
        },
        {
            title: "Great product",
            date: "10/01/2025",
            rating: 4,
            image: "https://storage.beautyfulls.com/uploads-1/sg-press/600x/innisfree-green-tea-balancing-cream-ex-152085.webp",
            content: "Perfect!!! The way this cream feels on my it's pure heaven. It hydrates so good and it lasts for hours. I usually wear it during the day but last night was the first time I used it as a night moisturizer. I twist and turn during sleep and when I woke, I was still fully moisturized.",
        },
    ];

    const [mainImage, setMainImage] = useState(productImages[0]);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const productImage = "https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg";
    const averageRating = calculateAverageRating(reviews);


    return (
        <div>
            <div style={{
                maxWidth: "1100px",
                margin: "auto",
                padding: "20px 40px",
                // display: "flex",
                // gap: "50px",
                fontFamily: 'Nunito, sans-serif',
            }}>
                <div
                    style={{
                        display: "flex",
                        gap: "50px",
                    }}
                >
                    {/* Khu vực hình ảnh */}
                    <div style={{ display: "flex", gap: "20px" }}>
                        {/* Danh sách ảnh nhỏ */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                            alignSelf: "flex-start", // Giữ ảnh nhỏ luôn thẳng hàng trên
                        }}>
                            {productImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt="Product"
                                    onClick={() => setMainImage(img)}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        border: mainImage === img ? "2px solid #D8959A" : "2px solid transparent",
                                        transition: "border 0.2s ease-in-out",
                                        display: "block"
                                    }}
                                />
                            ))}
                        </div>

                        {/* Ảnh chính */}
                        <div style={{
                            width: "400px",
                            height: "400px",
                            minWidth: "400px", // Giữ cố định kích thước
                            minHeight: "400px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #ddd",
                            borderRadius: "15px",
                            overflow: "hidden"
                        }}>
                            <img
                                src={mainImage}
                                alt="Product Main"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "opacity 0.3s ease-in-out",
                                    display: "block",
                                }}
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div style={{ flex: 1 }}>
                        {/* Breadcrumb */}
                        <p style={{ fontSize: "14px", color: "#888", marginBottom: "10px" }}>Sản phẩm &gt; Tên sản phẩm</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            {/* Tên sản phẩm */}
                            <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px", lineHeight: "1.4", fontFamily:"Nunito" }}>BRAND</h1>
                            {/* Icon yêu thích */}
                            <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <HeartOutlined style={{ fontSize: "25px", color: "#333", cursor: "pointer" }} />
                                <span style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>Best seller</span>
                            </div>
                        </div>
                        <h2 style={{ fontSize: "30px", fontWeight: "bold", color: "#333", marginBottom: "12px", lineHeight: "1.4" }}>
                            Dewy Glow Jelly Cream
                        </h2>

                        <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px", lineHeight: "1.6" }}>
                            0.35 | hydrate + protect + glow
                        </p>

                        {/* Đánh giá */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                            <Rate defaultValue={5} disabled style={{ color: "#D8959A" }} />
                            <span style={{ fontSize: "14px", color: "#666" }}>(100 reviews)</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            {/* Nút chọn số lượng */}
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                width: "120px",  // Tăng độ rộng để nút không quá nhỏ
                                height: "45px",  // Cùng chiều cao với nút Add to Cart
                                justifyContent: "space-between"
                            }}>
                                <button onClick={decreaseQuantity} style={quantityButtonStyle}>−</button>
                                <span style={{ fontSize: "16px", fontWeight: "bold" }}>{quantity}</span>
                                <button onClick={increaseQuantity} style={quantityButtonStyle}>+</button>
                            </div>

                            {/* Nút Add to cart */}
                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: "#D8959A",
                                    borderColor: "#D8959A",
                                    width: "80%",
                                    height: "45px",
                                    fontSize: "18px",
                                }}
                            >
                                Add to cart - 350.000vnd
                            </Button>
                        </div>
                        <div style={{ marginTop: "20px" }}>
                            {/* Thông tin sản phẩm (Collapse) */}
                            <Collapse expandIconPosition="end" style={{ border: "none", background: "transparent" }}>
                                <Panel header={<span style={{ fontWeight: "bold", color: "#a06f6f", fontSize: "20px" }}>Chi tiết</span>} key="1" >
                                    <p style={{ lineHeight: "1.6" }}>
                                        Kem dưỡng dạng gel trong suốt INNISFREE Jeju Cherry Blossom Jelly Cream dưỡng ẩm sáng da từ hoa anh đào và Betaine tự nhiên, nhẹ nhàng và không gây nhờn rít.
                                    </p>
                                </Panel>
                                <Panel header={<span style={{ fontWeight: "bold", color: "#a06f6f", fontSize: "20px" }}>Thành phần</span>} key="2">
                                    <p style={{ lineHeight: "1.6" }}>
                                        Thành phần chính: Nước, Glycerin, Betaine, chiết xuất hoa anh đào, Niacinamide...
                                    </p>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>
                {/* Phần công dụng, cách sử dụng và thành phần (Ảnh 1 bên, chữ 1 bên) */}
                <div style={{ marginTop: "50px" }}>
                    <div style={{ display: "flex", backgroundColor: "#F6EEF0", borderTopLeftRadius: "30px", borderTopRightRadius: "30px" }}>
                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                    src={productImage}
                                    alt="Product"
                                    style={{
                                        width: "100%",
                                        height: "350px",
                                        borderRadius: "0px",
                                    }}
                                />
                            </Col>
                            <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <div style={{ width: "80%", padding: "0 50px" }}>
                                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Công dụng</h2>
                                    <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                                        Dưỡng trắng sáng, chống oxy hóa và chống viêm. Cải thiện sắc tố da, làm đồng đều màu da dáng kề.
                                        Hỗ trợ dưỡng, tăng cường ẩm cho da, cải thiện độ đàn hồi cho da. Glycerin dưỡng ẩm và ngăn chặn các dấu hiệu lão hóa da.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ display: "flex", backgroundColor: "#D8959A" }}>
                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <div style={{ width: "80%", padding: "0 50px" }}>
                                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", marginTop: "30px" }}>Cách sử dụng</h2>
                                    <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                                        Sử dụng ở bước chăm sóc cuối cùng, hãy lấy một lượng kem vừa đủ thoa đều lên vùng mặt và cổ,
                                        massage đều để kem hấp thụ nhanh chóng.
                                    </p>
                                </div>
                            </Col>
                            <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                    src="https://product.hstatic.net/1000360941/product/toner-innisfree-hoa-anh-dao_3400df3de24543f3958a7e5b704ab8ac_master.jpg"
                                    alt="Product"
                                    style={{
                                        width: "100%",
                                        height: "350px",
                                        borderRadius: "0px",
                                    }}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div style={{ display: "flex", backgroundColor: "#D8959A", borderBottomLeftRadius: "30px", borderBottomRightRadius: "30px" }}>
                        <Row gutter={[20, 20]}>
                            <Col xs={24} md={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <img
                                    src={productImage}
                                    alt="Product"
                                    style={{
                                        width: "100%",
                                        height: "350px",
                                        borderRadius: "0px",
                                    }}
                                />
                            </Col>
                            <Col xs={24} md={12} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <div style={{ width: "80%", padding: "0 50px" }}>
                                    <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px", marginTop: "30px" }}>Thành phần</h2>
                                    <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
                                        Water, Dipropylene Glycol, Niacinamide, Glycerin, Betaine, 1,2-Hexanediol, Carbomer, Tromethamine, Perfume,
                                        Ammonium Propanediol, Prunus.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            {/* Phần đánh giá */}
            <div style={{
                maxWidth: "1440px",
                backgroundColor: "#F6EEF0",
            }}>
                <div style={{
                    maxWidth: "1100px",
                    margin: "auto",
                    padding: "20px 300px",
                }}>
                    <div style={{ marginTop: "50px" }}>
                        <div>
                            <h2 style={{ fontSize: "35px", fontWeight: "bold", marginBottom: "20px", color: "#A76A6E", textAlign: "center" }}>
                                Đánh giá sản phẩm
                            </h2>
                            {/* Hiển thị đánh giá trung bình */}
                            <div style={{ fontSize: "16px", marginBottom: "20px", textAlign: "center" }}>
                                {/* <span style={{ fontWeight: "bold" }}>Đánh giá trung bình: </span> */}
                                <Rate value={parseFloat(averageRating)} disabled style={{ color: "#A76A6E" }} />
                                <span style={{ fontSize: "14px", color: "#A76A6E", marginLeft: "10px" }}>
                                    {averageRating} / 5
                                </span>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {reviews.map((review, index) => (
                                <div key={index} style={{ display: "flex", flexDirection: "row", borderBottom: "1px solid #ddd", paddingBottom: "20px" }}>
                                    {/* Phần đánh giá và nội dung */}
                                    <div style={{ flex: 1, display: "flex", flexDirection: "column", marginRight: "20px", width: "40%%" }}>
                                        {/* Hiển thị sao đánh giá */}
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <Rate value={review.rating} disabled style={{ color: "#A76A6E" }} />
                                            {/* <span style={{ fontSize: "25px", color: "#A76A6E" }}>{review.title}</span> */}
                                            <span style={{ fontSize: "14px", color: "#666" }}>({review.date})</span>
                                        </div>
                                        <span style={{ fontSize: "25px", color: "#A76A6E", marginTop: "10px" }}>{review.title}</span>
                                        {/* Hiển thị nội dung đánh giá */}
                                        <p style={{ fontSize: "16px", color: "#333", lineHeight: "1.6", marginTop: "5px" }}>
                                            {review.content}
                                        </p>
                                    </div>

                                    {/* Phần hình ảnh */}
                                    <div style={{ flexShrink: 0 }}>
                                        <img
                                            src={review.image}
                                            alt="Review"
                                            style={{ width: "200px", height: "auto", borderRadius: "5px" }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p style={{ color: "#A76A6E", textAlign: "center", paddingTop: "2%" }}>2/10 đánh giá</p>
                    <div style={{display:"flex", justifyContent:"center", paddingTop:"2%"}}>
                        <button style={{ backgroundColor: "#A76A6E", color: "white", padding: "10px 20px", borderRadius: "5px", border: "none", cursor: "pointer" }}>Xem tất cả đánh giá</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Style cho nút chọn số lượng
const quantityButtonStyle = {
    width: "35px",
    height: "35px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "18px",
    backgroundColor: "transparent",
    color: "#777",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};
