import React from 'react';
import './CartPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { Button, ConfigProvider, Table, Typography } from 'antd';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    selectCartItems,
} from '../../redux/feature/cartSlice';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';

const { Text } = Typography;

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems); // Lấy giỏ hàng từ Redux
    const navigate = useNavigate();

    // Debug: Log cartItems to verify data
    console.log('Cart Items:', cartItems);

    // 🛠 Tránh lỗi NaN khi không có sản phẩm
    const totalAmount = cartItems.length > 0
        ? cartItems.reduce((total, item) => total + (item.sellPrice || 0) * (item.quantity || 0), 0)
        : 0;

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'images',
            key: 'images',
            render: (_, record) => {
                // Debug: Log the images array for this record
                console.log(`Images for ${record.productName}:`, record.images);

                return (
                    <div className="table-col-name">
                        <div className="table-col-name-img">
                            <img
                                src={record.images?.[0] || 'https://via.placeholder.com/100'}
                                alt={record.productName || 'Product Image'}
                                onError={(e) => {
                                    console.error(`Failed to load image: ${record.images?.[0]}`);
                                    e.target.src = 'https://via.placeholder.com/100'; // Fallback on error
                                }}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                        </div>
                        <div className="table-col-name-content">
                            <h5>{record.brandName || 'N/A'}</h5>
                            <Text>{record.productName || 'Unnamed Product'}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Còn lại: {record.stocks !== undefined ? record.stocks : 'N/A'} sản phẩm
                            </Text>
                        </div>
                    </div>
                );
            },
            width: 400,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
            render: (sellPrice) => (
                <Text className="font-bold">{(sellPrice || 0).toLocaleString()} đ</Text>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Button
                        size="small"
                        onClick={() => dispatch(decreaseQuantity({ productId: record.productId }))}
                        disabled={quantity <= 1}
                    >
                        -
                    </Button>
                    <Text>{quantity || 0}</Text>
                    <Button
                        size="small"
                        onClick={() => dispatch(increaseQuantity({ productId: record.productId }))}
                        disabled={quantity >= (record.stocks || Infinity)}
                    >
                        +
                    </Button>
                </div>
            ),
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => (
                <Text className="font-bold">{((record.sellPrice || 0) * (record.quantity || 0)).toLocaleString()} đ</Text>
            ),
        },
        {
            title: 'Xoá',
            render: (_, record) => (
                <RiDeleteBinLine
                    onClick={() => dispatch(removeFromCart({ productId: record.productId }))}
                    size={25}
                    color="#D8959A"
                    className="button-delete"
                />
            ),
        },
    ];

    return (
        <Container>
            <div style={{ marginBottom: '3%' }}>
                <div className="cart-title">
                    <h5 className="font-bold">Giỏ hàng</h5> <span>({cartItems.length} sản phẩm)</span>
                </div>
                <div className="cart-div">
                    <Row>
                        <Col xs={8}>
                            <ConfigProvider theme={{ components: { Table: { headerBg: '#EFEFEF', borderColor: '#D8959A' } } }}>
                                <Table
                                    className="table-cart"
                                    dataSource={cartItems}
                                    columns={columns}
                                    pagination={false}
                                    locale={{ emptyText: 'Giỏ hàng trống' }}
                                />
                            </ConfigProvider>
                        </Col>
                        <Col xs={4}>
                            <div className="cart-receipt">
                                <div className="cart-receipt-main">
                                    <div className="cart-receipt-main-title">
                                        <p>Hoá đơn của bạn</p>
                                    </div>
                                    <div className="cart-receipt-main-content">
                                        <div className="cart-receipt-main-content-part">
                                            <p>Tạm tính: </p>
                                            <span className="font-bold" style={{ fontSize: '18px' }}>
                                                {totalAmount.toLocaleString()} đ
                                            </span>
                                        </div>
                                        <div className="cart-receipt-main-content-part">
                                            <p>Giảm giá </p>
                                            <span className="font-bold" style={{ fontSize: '18px' }}>-0 đ</span>
                                        </div>
                                        <div className="cart-receipt-main-content-part">
                                            <p style={{ fontSize: '13px' }}>
                                                Vui lòng kiểm tra giỏ hàng trước khi thanh toán
                                            </p>
                                        </div>
                                        <div className="cart-receipt-main-content-part-total">
                                            <p>Tổng cộng: </p>
                                            <span className="font-bold" style={{ fontSize: '18px' }}>
                                                {totalAmount.toLocaleString()} đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="cart-receipt-button"
                                    onClick={() => navigate(routes.checkout)}
                                    disabled={cartItems.length === 0}
                                >
                                    Tiến hành đặt hàng
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
}