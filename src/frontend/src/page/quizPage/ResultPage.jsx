import React, { useState } from "react";
import { Card, Typography, Row, Col, Image } from "antd";
import Link from "antd/es/typography/Link";


const { Title, Paragraph } = Typography;

const ResultPage = () => {
    const [showOptions, setShowOptions] = useState(false);

  return (
    <div style={{ maxWidth: "1440px",  margin: "15px auto", padding: "0 10%" }}>
      {/* Loại da Baumann */}
      <Card style={{ marginBottom: "20px", border: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            gap: "20px",
          }}
        >
          <img
            src="https://skintypesolutions.com/cdn/shop/articles/img-1690362697700_80992943-e972-417a-bc16-187943ba4712.jpg?v=1692782760"
            alt="Loại da Baumann"
            style={{ width: "30%", height: "auto" }}
          />
          <div>
            <Title level={4} style={{ color: "#E77D3B" }}>
              Loại da Baumann của bạn là:
            </Title>
            <Paragraph style={{ fontSize: "20px" }}>
              <strong>Da dầu | Nhạy cảm | Không có sắc tố | Dễ bị nhăn.</strong>
            </Paragraph>
            <Paragraph style={{ fontSize: "18px" }}>
              Loại da này đặc trưng bởi tính nhờn và viêm nhiễm. Da OSNT ít dễ
              bị nhăn hơn vì bã nhờn giàu chất chống oxy hóa có tác dụng bảo vệ.
              Loại da này có thể trở nên dễ chăm sóc hơn khi bạn lớn tuổi nếu
              duy trì thói quen sống lành mạnh.
            </Paragraph>
            <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <img
    src="https://cdn.shopify.com/s/files/1/0740/5984/1838/files/OSNT.png" 
    alt="OSNT"
    style={{ width: "50px", height: "50px"}}
  />
  <h1 style={{fontWeight:"bold", color:"#FCCAA7", textAlign:"center"}}>OSNT</h1>
  </div>
          </div>
        </div>
      </Card>

      {/* Quy trình chăm sóc */}
      <Card style={{ marginBottom: "20px", backgroundColor: "#F6EEF0" }}>
  <Row style={{ display: "flex", alignItems: "center" }}>
    <Col style={{ textAlign: "center" }}>
      <img style={{ width: "100%", maxWidth: "350px", height:"auto", marginRight: "20px" }} 
      src="https://media.hasaki.vn/hsk/cac-hang-my-pham-noi-tieng-14.jpg" 
      alt="Quy trình chăm sóc da" />
    </Col>
    <Col style={{ flex: 1 }}>
      <Title level={4}>Quy trình chăm sóc da được khuyến nghị:</Title>
      <Paragraph>
        ✅ Miễn phí vận chuyển
        <br />✅ Tiết kiệm lên đến 25%
      </Paragraph>
      <Paragraph>
        Sử dụng mã <strong>ROUTINE25</strong> để được giảm giá lên đến 25% khi
        bạn mua từ 3 sản phẩm trở lên trong quy trình chăm sóc da của mình.
      </Paragraph>
    </Col>
  </Row>
</Card>

{/* Quy trình đề xuất */}
<h3>Quy trình đề xuất</h3>
<hr style={{ border: "1.5px solid #D8959A", margin: "20px 0", borderRadius:"10px" }} />
<Card style={{ border: "none" }}>
  <Row align="middle" style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: "10px" }}>
    <Col flex="0 0 150px" style={{ textAlign: "center" }}>
      <Image
        src="https://image.hsv-tech.io/1987x0/bbx/common/b4ac69d8-c990-4cd8-adab-34a9e6ae08ea.webp"
        alt="Tên sản phẩm"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <Link
        style={{
          color: "black",
          textDecoration: "underline",
          marginTop: "10px",
          display: "block",
          cursor: "pointer",
        }}
        onClick={() => setShowOptions(!showOptions)}
      >
        {showOptions ? "Ẩn các tùy chọn khác" : "Tùy chọn khác"}
      </Link>
    </Col>
    <Col flex="1">
      <Title level={5}>Bước 2 - Tên sản phẩm</Title>
      <Paragraph>
        Salicylic acid là một thành phần chống viêm có thể cắt xuyên qua bã nhờn, xâm nhập vào lỗ chân lông và làm sạch mụn đầu đen...
      </Paragraph>
    </Col>
  </Row>

  {/* Danh sách sản phẩm thay thế */}
  <div
    style={{
      display: showOptions ? "flex" : "none",
      gap: "10px",
      marginTop: "10px",
      justifyContent: "center",
      flexWrap: "wrap",
      opacity: showOptions ? 1 : 0,
      transform: showOptions ? "translateY(0)" : "translateY(-20px)",
      transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
    }}
  >
    {[1, 2, 3, 4].map((item) => (
      <div
        key={item}
        style={{
          width: "150px",
          textAlign: "center",
          border: "1px solid #ddd",
          padding: "10px",
          borderRadius: "5px",
          background: "#fff",
        }}
      >
        <Image
          src="https://www.lottemart.vn/media/catalog/product/cache/0x0/3/4/3499320013185-1.jpg.webp"
          alt={`Sản phẩm ${item}`}
          style={{ maxWidth: "100%" }}
        />
        <p style={{ marginTop: "5px", fontWeight: "bold" }}>Tên sản phẩm</p>
        <p>200.000 VNĐ</p>
      </div>
    ))}
  </div>
</Card>

    </div>
  );
};

export default ResultPage;
