import React, { useEffect, useRef, useState } from 'react';
import './CartPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { Button, ConfigProvider, Table, Typography } from 'antd';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseQuantity, increaseQuantity, removeFromCart, selectCartItems } from '../../redux/feature/cartSlice';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import Cookies from 'js-cookie';

const { Text } = Typography;

export default function CartPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const prevUserCookieRef = useRef(null);

    // console.log('Cart Items:', cartItems);
    useEffect(() => {
        function updateUserFromCookies() {
            const userCookie = Cookies.get('user');
            if (userCookie !== prevUserCookieRef.current) {
                prevUserCookieRef.current = userCookie;
                try {
                    setUser(userCookie ? JSON.parse(userCookie) : null);
                } catch (error) {
                    setUser(null);
                }
            }
        }

        updateUserFromCookies();

        const cookieCheckInterval = setInterval(updateUserFromCookies, 1000);

        return () => clearInterval(cookieCheckInterval);
    }, []);

    console.log('User:', user);

    const totalAmount =
        cartItems.length > 0
            ? cartItems.reduce((total, item) => total + (item.sellPrice || 0) * (item.quantity || 0), 0)
            : 0;

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'images',
            key: 'images',
            render: (_, record) => (
                <div className="table-col-name">
                    <div className="table-col-name-img">
                        <img
                            src={
                                typeof record.images?.[0] === 'string'
                                    ? record.images[0]
                                    : record.images?.[0]?.prodImageUrl || 'https://via.placeholder.com/100'
                            }
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            alt={record.productName || 'Product Image'}
                        />
                    </div>
                    <div className="table-col-name-content">
                        <h5>{record.brandName}</h5>
                        <Text>{record.productName || 'Unnamed Product'}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            Còn lại: {record.stocks !== undefined ? record.stocks : 'N/A'} sản phẩm
                        </Text>
                    </div>
                </div>
            ),
            width: '40%',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
            render: (sellPrice) => <Text className="font-bold">{(sellPrice || 0).toLocaleString()} đ</Text>,
            width: '20%',
            align: 'center',
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
                        disabled={quantity <= 1}>
                        -
                    </Button>
                    <Text>{quantity || 0}</Text>
                    <Button
                        size="small"
                        onClick={() => dispatch(increaseQuantity({ productId: record.productId }))}
                        disabled={quantity >= (record.stocks || Infinity)}>
                        +
                    </Button>
                </div>
            ),
            width: '15%', // Compact width for quantity
            align: 'center',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => (
                <Text className="font-bold">
                    {((record.sellPrice || 0) * (record.quantity || 0)).toLocaleString()} đ
                </Text>
            ),
            width: '20%',
            align: 'center',
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
            width: '5%',
            align: 'center',
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
                            <ConfigProvider
                                theme={{ components: { Table: { headerBg: '#EFEFEF', borderColor: '#D8959A' } } }}>
                                <Table
                                    className="table-cart"
                                    dataSource={cartItems}
                                    columns={columns}
                                    pagination={false}
                                    locale={{ emptyText: 'Giỏ hàng trống' }}
                                    // No scroll property to prevent horizontal scrolling
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
                                        {/* <div className="cart-receipt-main-content-part">
                                            <p>Giảm giá </p>
                                            <span className="font-bold" style={{ fontSize: '18px' }}>
                                                -0 đ
                                            </span>
                                        </div> */}
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
                                {user?.accountStatus === 'Verified' ? (
                                    <button
                                        className="cart-receipt-button"
                                        onClick={() => navigate(routes.checkout)}
                                        disabled={cartItems.length === 0}>
                                        Tiến hành đặt hàng
                                    </button>
                                ) : (
                                    <div>
                                        <div
                                            className="verification-warning"
                                            style={{
                                                color: '#D8959A',
                                                marginBottom: '10px',
                                                fontSize: '14px',
                                                textAlign: 'center',
                                            }}>
                                            Bạn cần xác thực tài khoản trước khi thanh toán
                                        </div>
                                        <button
                                            className="cart-receipt-button"
                                            style={{ backgroundColor: '#6c757d' }}
                                            onClick={() => navigate(routes.profile)}>
                                            Đi đến trang xác thực tài khoản
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
}
