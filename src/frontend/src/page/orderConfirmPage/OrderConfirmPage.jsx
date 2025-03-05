import React from 'react';
import './OrderConfirmPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
export default function OrderConfirmPage() {
    const cartItem = [
        {
            id: 1,
            img: 'https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png',
            brandName: 'dior',
            name: 'Suar rua matdadasdasdadasdasy Giảm Thâm Nám & Dưỡng Sáng Da 30ml',
            quantity: '23',
            price: 250000,
            total: 2565405,
        },
        {
            id: 1,
            img: 'https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png',
            brandName: 'dior',
            name: 'Serum La Roche-Posay Giảm Thâm Nám & Dưỡng Sáng Da 30ml',
            quantity: '23',
            price: 250000,
            total: 2565405,
        },
        {
            id: 1,
            img: 'https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png',
            brandName: 'dior',
            name: 'Serum La Roche-Posay Giảm Thâm Nám & Dưỡng Sáng Da 30ml',
            quantity: '23',
            price: 250000,
            total: 2565405,
        },
        // {
        //   id: 1,
        //   img: "https://images.girlslife.com/posts/041/41861/pinkbeautyproductsskincareinnisfreecherryblossom.png",
        //   brandName: "dior",
        //   name: "Serum La Roche-Posay Giảm Thâm Nám & Dưỡng Sáng Da 30ml",
        //   quantity: "23",
        //   price: 250000,
        //   total: 2565405,
        // },
    ];

    return (
        <Container>
            <Row className="order-confirm-main">
                <Col xs={6} className="order-1">
                    <div className="order-thank">
                        <h3 className="font-bold" style={{ fontSize: '48px' }}>
                            Cảm ơn bạn đã mua hàng !
                        </h3>
                        <h5 style={{ fontSize: '24px' }}>
                            Đơn hàng của bạn sẽ được xử lý trong vòng 24 tiếng. Chúng tôi sẽ thông báo qua email một khi
                            đơn hàng của bạn đã được vận chuyển.
                        </h5>
                    </div>

                    <div className="order-info">
                        <h3 className="font-bold order-info-title" style={{ fontSize: '32px' }}>
                            {' '}
                            Thông tin đơn hàng
                        </h3>
                        <div className="order-info-part">
                            <h5 className="font-bold" style={{ fontSize: '24px' }}>
                                Họ và Tên:
                            </h5>
                            <p style={{ fontSize: '20px' }}>Phong Lâm</p>
                        </div>
                        <div className="order-info-part">
                            <h5 className="font-bold" style={{ fontSize: '24px' }}>
                                Địa chỉ:
                            </h5>
                            <p style={{ fontSize: '20px' }}>
                                Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh
                            </p>
                        </div>
                        <div className="order-info-part">
                            <h5 className="font-bold" style={{ fontSize: '24px' }}>
                                Email:
                            </h5>
                            <p style={{ fontSize: '20px' }}>phonglqse183161@fpt.edu.vn</p>
                        </div>
                        <div className="order-info-part">
                            <h5 className="font-bold" style={{ fontSize: '24px' }}>
                                Số điện thoại:
                            </h5>
                            <p style={{ fontSize: '20px' }}>0123456789</p>
                        </div>
                    </div>

                    <div className="order-1-button">
                        <button>Theo dõi đơn hàng</button>
                        <button>Tiếp tục mua sắm</button>
                    </div>
                </Col>
                <Col xs={6} className="order-2">
                    <div className="order-detail">
                        <div className="order-detail-title">
                            <h5 className="font-bold">Tổng kết đơn hàng</h5>
                        </div>

                        <div className="order-detail-info-1">
                            <div className="order-detail-info-1-part">
                                <p className="font-bold">Mua ngày</p>
                                <p>15-01-2025</p>
                            </div>
                            <div className="order-detail-info-1-part middle">
                                <p className="font-bold">Đơn hàng</p>
                                <p>1213123</p>
                            </div>
                            <div className="order-detail-info-1-part">
                                <p className="font-bold">Phương thức thanh toán</p>
                                <p>Thanh toán VN Pay</p>
                            </div>
                        </div>

                        <div className="order-detail-info-2">
                            {cartItem.map((item, index) => (
                                <div key={index} className="order-detail-info-2-rowItem">
                                    <div className="order-detail-info-2-rowItem-part1">
                                        <div className="order-detail-info-2-rowItem-img">
                                            <img src={item.img} alt="" />
                                        </div>
                                        <div className="order-detail-info-2-rowItem-name">
                                            <p>{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="order-detail-info-2-rowItem-part2">
                                        <p className="font-bold">{item.price.toLocaleString()}đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="order-detail-info-3">
                            <div className="order-detail-info-3-part">
                                <p>Tạm tính:</p>
                                <span>1.380.000 ₫</span>
                            </div>
                            <div className="order-detail-info-3-part">
                                <p>Giảm giá:</p>
                                <span>-50.000 ₫</span>
                            </div>
                            <div className="order-detail-info-3-part">
                                <p>Phí vận chuyển:</p>
                                <span>-</span>
                            </div>
                        </div>

                        <div className="order-detail-info-4">
                            <h5 className="font-bold" style={{ fontSize: '24px' }}>
                                Tổng đơn hàng
                            </h5>
                            <span className="font-bold" style={{ fontSize: '24px' }}>
                                1.380.000 ₫
                            </span>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
