import React from 'react';
import { Button } from 'react-bootstrap';
import service1 from "../../assets/service1.jpeg";
import service2 from "../../assets/service2.jpg";
import service3 from "../../assets/service3.jpg";

const cardStyle = (bgColor) => ({
    width: "100%",
    height: "100%",
    maxWidth: "500px",
    backgroundColor: bgColor,
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "left",
    marginBottom: '10px'
});

const titleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#6B3F3F",
    borderBottom: "1px solid #d8a4a4",
    paddingBottom: "8px",
    fontFamily: "'Prata', serif",
};

const textStyle = {
    fontSize: "18px",
    color: "#6B3F3F",
    marginBottom: "6px",
};
const App = () => {
    return (




        <div className="container-fluid p-0">


            {/* Banner */}
            <div className="text-center mb-4 position-relative" style={{
                background: `linear-gradient(rgba(181, 113, 112, 0.5), rgba(120, 120, 120, 0.5)), url(${service1}) no-repeat center center / cover`,
                height: '300px',
                width: '100vw',
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

            }}>
                <h2 className="text-white fw-bold" style={{ fontSize: '70px', fontFamily: "'Prata', serif" }}>
                    Dịch vụ
                </h2>
            </div>

            <div className="container">

                <div className="row justify-content-center mt-4">
                    <div className="col-md-10">
                        <div className="card text-white position-relative" style={{
                            backgroundImage: `url(${service2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '10px',
                            height: '280px',
                            marginBottom: '50px',
                            marginTop: '50px', 
                            border: 'none'
                        }}>
                            <div className="card-body d-flex align-items-center justify-content-end p-5" style={{ color: '#6B3F3F' }}>
                                <div
                                    style={{
                                        width: "1px",
                                        height: "100%",
                                        backgroundColor: "#d8a4a4",
                                        marginRight: "20px",

                                    }}
                                ></div>
                                <div>
                                    <h3 className="fw-bold mb-3" style={{ fontFamily: "Prata, serif" }}>Chương trình khuyến mãi</h3>
                                    <ul className="mb-3" style={textStyle}>
                                        <li>Mã giảm giá dành cho khách hàng mới</li>
                                        <li>Combo giá ưu đãi</li>
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button variant="primary" style={{ backgroundColor: '#C48C8C', border: 'none' }}>
                                            XEM NGAY
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="row g-5 justify-content-center">
                    <div className="col-md-5 mb-5 " >
                        <div style={cardStyle("#F6EEF0")}>
                            <h4 style={titleStyle} >Hỗ trợ đa dạng phương thức thanh toán</h4>
                            <p style={textStyle}>- Thanh toán khi giao hàng (COD)</p>
                            <p style={textStyle}>- Thanh toán bằng Ví MoMo</p>
                            <p style={textStyle}>- Thanh toán bằng thẻ ATM/VISA/MASTER</p>
                        </div>
                    </div>

                    <div className="col-md-5 mb-5">
                        <div style={cardStyle("#FCEEEF")}>
                            <h4 style={titleStyle}>Giao hàng toàn quốc</h4>
                            <p style={textStyle}>- Miễn phí vận chuyển với đơn từ 99.000 VND</p>
                            <p style={textStyle}>- Phí vận chuyển 30.000 VND với đơn dưới 99.000 VND</p>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div style={cardStyle("#FCEEEF")}>
                            <h4 style={titleStyle}>Đơn vị cung cấp uy tín</h4>
                            <p style={textStyle}>- Hơn 2K đánh giá 5 sao</p>
                            <p style={textStyle}>- Cam kết sản phẩm đạt chất lượng</p>
                            <p style={textStyle}>- Xử lý yêu cầu khách hàng nhanh chóng</p>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div style={cardStyle("#F6EEF0")}>
                            <h4 style={titleStyle}>Hỗ trợ tư vấn 24/7</h4>
                            <p style={textStyle}>- Đưa ra giải pháp phù hợp với bạn</p>
                            <p style={textStyle}>- Thông tin khách hàng bảo mật tuyệt đối</p>
                        </div>
                    </div>
                </div>


                {/* Product Exploration */}
                <div className="row justify-content-center mt-4">
                    <div className="col-md-10">
                        <div className="card text-white position-relative" style={{
                            backgroundImage: `url(${service3})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '10px',
                            height: '280px',
                            marginBottom: '50px',
                            marginTop: '50px',
                            border: 'none'
                            
                        }}>
                            <div className="card-body d-flex align-items-center p-5" style={{ color: '#6B3F3F' }}>

                                <div>
                                    <h3 className="fw-bold mb-3" style={{ fontFamily: "Prata, serif" }}>Khám phá hơn 100 sản phẩm</h3>
                                    <ul className="mb-3" style={textStyle}>
                                        <li>Đến từ thương hiệu chất lượng</li>
                                        <li>Bảo hành 1 tháng cho mọi sản phẩm</li>
                                    </ul>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <Button variant="primary" style={{ backgroundColor: '#C48C8C', border: 'none' }}>
                                            XEM NGAY
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        width: "1px",
                                        height: "100%",
                                        backgroundColor: "#d8a4a4",
                                        marginLeft: "20px",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
