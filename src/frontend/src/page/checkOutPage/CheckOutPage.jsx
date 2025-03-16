import React, { useEffect } from 'react';
import './CheckOutPage.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { useForm } from 'antd/es/form/Form';
import { Form, Input, Radio, Select } from 'antd';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems } from '../../redux/feature/cartSlice';
import api from '../../config/api';
import Cookies from 'js-cookie';
import { clearCart } from '../../redux/feature/cartSlice';
import { Button } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

export default function CheckOutPage() {
    const [form] = useForm();
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.sellPrice * item.quantity;
    }, 0);
    const [userAddress, setUserAddress] = React.useState([]);
    const [userVoucher, setUserVoucher] = React.useState([]);
        const [selectedVoucher, setSelectedVoucher] = React.useState(null);
    const [voucherCode, setVoucherCode] = React.useState('');

    const handleAddressChange = (value) => {
        const selectedAddress = userAddress.find((address) => address.addressId === value);
        if (selectedAddress) {
            form.setFieldsValue({
                province: selectedAddress.city,
                district: selectedAddress.district,
                address: selectedAddress.addDetail,
                ward: selectedAddress.ward,
            });
        }
    };

    const handleFetchVoucher = async () => {
        try {
            const response = await api.get('user/vouchers');
            if (response.data.statusCode === 200) {
                setUserVoucher(response.data.data);
            }
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch voucher:', error.response?.data);
        }
    };

    useEffect(() => {
        handleFetchVoucher();
    }, []);

    const handleCheckout = async (values) => {
        values.eventId = 5;
        values.orderItems = cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            sellPrice: item.sellPrice,
        }));

        try {
            const response = await api.post('Orders/create', values);
            console.log(response.data);

            if (response.data.statusCode === 201) {
                const OrderId = BigInt(response.data.data.ordId).toString();
                const paymentCreate = {
                    OrderId,
                    PaymentMethod: values.paymentMethod,
                    PaymentAmount: totalAmount,
                };
                try {
                    const responsePayment = await api.post('Payment/create', paymentCreate);
                    const paymentUrl = responsePayment.data.data.paymentUrl;
                    // Clear the cart after successful payment initiation

                    dispatch(clearCart());
                    window.location.assign(paymentUrl);
                } catch (error) {
                    console.log('Failed to create payment:', error.response.data);
                }
            }
        } catch (error) {
            console.error('Failed to checkout:', error.response.data);
        }
    };

    useEffect(() => {
        const fetchAddressAndSetDefault = async () => {
            try {
                const response = await api.get('address/get-all-address');
                if (response.data.statusCode === 200) {
                    const addresses = response.data.data.items;
                    setUserAddress(addresses);

                    const defaultAddress = addresses.find((address) => address.status === true);
                    if (defaultAddress) {
                        form.setFieldsValue({
                            userAddress: defaultAddress.addressId,
                            province: defaultAddress.city,
                            district: defaultAddress.district,
                            address: defaultAddress.addDetail,
                            ward: defaultAddress.ward,
                            email: user?.email || '',
                            name: user?.fullName || '',
                            phone: user?.phone || '',
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch address:', error.response?.data);
            }
        };

        fetchAddressAndSetDefault();
    }, [form]);

    return (
        <Container>
            <Link to={routes.cart}>
                <Button
                    type="default"
                    icon={<LeftOutlined />}
                    size="large"
                    style={{ fontWeight: 'bold', marginTop: '3%' }}>
                    Quay về giỏ hàng
                </Button>
            </Link>
            <Row className="order-checkout">
                <Col xs={6} className="order-checkout-info">
                    <Form form={form} layout="vertical" className="form-checkout" onFinish={handleCheckout}>
                        <h4
                            style={{
                                fontWeight: 'bold',
                                marginBottom: '5%',
                                marginTop: '5%',
                            }}>
                            Thông tin nhận hàng
                        </h4>
                        <Form.Item name="userAddress" rules={[{ required: true, message: 'Chọn địa chỉ' }]}>
                            <Select size="large" placeholder="Chọn địa chỉ nhận hàng" onChange={handleAddressChange}>
                                {userAddress.map((address, index) => (
                                    <Select.Option value={address.addressId} key={index}>
                                        {address.addDetail}, {address.ward}, {address.district}, {address.city}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item name="email" rules={[{ required: true, message: 'Nhập Email' }]}>
                            <Input placeholder="Email" size="large" />
                        </Form.Item>

                        <Form.Item name="name">
                            <Input placeholder="Họ và Tên" size="large" />
                        </Form.Item>

                        <Form.Item name="phone">
                            <Input placeholder="Số điện thoại" size="large" />
                        </Form.Item>

                        <Form.Item name="address">
                            <Input placeholder="Địa Chỉ" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="ward">
                            <Input placeholder="Phường xã" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="district">
                            <Input placeholder="Quận huyện" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="province">
                            <Input placeholder="Tỉnh thành" disabled size="large" />
                        </Form.Item>

                        <Form.Item name="note">
                            <Input.TextArea rows={3} placeholder="Ghi chú" size="large" />
                        </Form.Item>

                        <div className="order-method">
                            <Form.Item
                                className="order-method-pay"
                                name="paymentMethod"
                                rules={[{ required: true, message: 'Chọn phướng thức thanh toán' }]}>
                                <div>
                                    <h5 className="font-bold">Thanh toán</h5>
                                    <Radio.Group className="radio-group1">
                                        <Radio value="VNPay" className="border-bottom">
                                            <div className="pay-row-vnp">
                                                <p>Thanh toán qua VNPAY</p>
                                                <img
                                                    src="https://static.ybox.vn/2024/1/4/1705551987477-logo-ngang.png"
                                                    alt=""
                                                />
                                            </div>
                                        </Radio>
                                        <Radio value="COD">Thanh toán khi nhận hàng (COD)</Radio>
                                    </Radio.Group>
                                </div>
                            </Form.Item>

                            <Form.Item
                                className="order-method-ship"
                                rules={[{ required: true, message: 'Chọn phướng thức vận chuyển' }]}>
                                <div>
                                    <h5 className="font-bold">Vận chuyển</h5>
                                    <Radio.Group className="radio-group2">
                                        <Radio value="Ahamove" className="">
                                            <div className="ship-row-ahamove">
                                                <p> Vận chuyển Giao Hàng Nhanh</p>
                                                <img
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Orange.png"
                                                    alt=""
                                                />
                                            </div>
                                        </Radio>
                                        {/* <Radio value="GHTK">
                                            <div className="ship-row-ghtk">
                                                <p> Vận chuyển GHTK</p>
                                                <img
                                                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHTK-H.png"
                                                    alt=""
                                                />
                                            </div>
                                        </Radio> */}
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                        </div>
                    </Form>
                </Col>
                <Col xs={1}></Col>
                <Col xs={5} className="order-checkout-receipt">
                    <div className="confirm-receipt">
                        <div className="confirm-receipt-title">
                            <h5 style={{ fontWeight: 'bold' }}>Đơn hàng</h5>
                            <span>({cartItems.length} sản phẩm)</span>
                        </div>
                        <div className="confirm-receipt-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="confirm-receipt-items-row">
                                    {/* <div className="confirm-receipt-items-row-part">
                    <div className="confirm-receipt-items-row-part-img">
                      <img src={item.img} alt="" />
                    </div>
                    <p>{item.name}</p>
                  </div>
                  <p>{item.price.toLocaleString()} đ</p> */}
                                    <div className="confirm-receipt-items-row-part1">
                                        <div className="confirm-receipt-items-row-part1-img">
                                            <img src={item.images[0]} alt="" />
                                        </div>
                                        <div className="confirm-receipt-items-row-part1-name">
                                            <p>{item.productName}</p>
                                            <p>Số lượng: {item.quantity} </p>
                                        </div>
                                    </div>
                                    <div className="confirm-receipt-items-row-part2">
                                        <p className="font-bold">{item.sellPrice.toLocaleString()} đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="available-vouchers">
                            <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Voucher khả dụng</h6>
                            <div className="voucher-list">
                                {userVoucher.length > 0 ? (
                                    userVoucher.map((voucher, index) => (
                                        <div
                                            key={index}
                                            className={`voucher-card ${
                                                selectedVoucher === voucher.voucherId ? 'selected' : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedVoucher(voucher.voucherId);
                                                setVoucherCode(voucher.voucherCode);
                                            }}>
                                            <div className="voucher-info">
                                                <div className="voucher-code">{voucher.voucherCode}</div>
                                                <div className="voucher-discount">Giảm {voucher.voucherDiscount}%</div>
                                                <div className="voucher-desc">{voucher.voucherDesc}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có voucher nào khả dụng</p>
                                )}
                            </div>
                        </div>
                        <div className="confirm-receipt-voucher">
                            <input
                                type="text"
                                placeholder="Mã giảm giá"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                            />
                            <button
                                onClick={() => {
                                    // Apply voucher logic here
                                    console.log('Applying voucher:', voucherCode);
                                    // You can add logic to calculate discount based on the selected voucher
                                }}>
                                Áp dụng
                            </button>
                        </div>
                        <div className="confirm-receipt-price">
                            <div className="confirm-receipt-price-spacebetween">
                                <p>Tạm tính: </p>
                                <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
                            </div>
                            <div className="confirm-receipt-price-spacebetween">
                                <p>Phí vận chuyển </p>
                                <span className="font-bold">-</span>
                            </div>
                        </div>
                        <div className="confirm-receipt-total">
                            <h5>Tổng cộng</h5>
                            <span className="font-bold">{totalAmount.toLocaleString()} đ</span>
                        </div>
                        <div className="confirm-receipt-button" onClick={() => form.submit()}>
                            <button>Đặt hàng</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
